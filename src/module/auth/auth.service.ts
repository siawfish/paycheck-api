import { HttpStatus, Injectable, HttpException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto, ForgotPassword, GetOtpDto, LoginDto, RegisterForUserDto, VerifyOtpDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { isPhoneNumber } from 'class-validator';
import { ObjectId } from 'mongodb';
import { SmsOtpService } from '../sms-otp/sms-otp.service';
import { ResponseVerifyOtp } from '../sms-otp/entities/sms-otp.entity';
import { CompaniesService } from '../companies/companies.service';
import { EmploymentsService } from '../employments/employments.service';
import { VerifyType } from '../users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: SmsOtpService,
    private readonly jwt: JwtService,
    private readonly companyService: CompaniesService,
    private readonly employmentService: EmploymentsService,
  ) {}
  saltOrRounds = 10;

  async generateJwtToken(payload: any) {
    return this.jwt.sign(payload);
  }

  async validateUser(IdentityCard: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ IdentityCard });

    if (user && this.checkPassword(password, user.password_hashed)) {
      const { ...result } = user;

      return result;
    }

    return null;
  }

  async validateUserByToken(id: string): Promise<any> {
    const user = await this.usersService.findOne({ _id: ObjectId(id) });
    if (user) {
      return user;
    }
    return null;
  }

  async login(params: LoginDto) {
    const currentUser: any = await this.usersService.findOne({
      personal_id: params.personal_id,
    });

    if (!currentUser) {
      throw new UnprocessableEntityException(`Identity card does not exist`);
    }
    const passwordValid = await this.checkPassword(params.password, currentUser.password_hashed);

    if (!passwordValid) {
      throw new UnprocessableEntityException('Password failed');
    }

    const payload = {
      email: currentUser.email,
      phone_number: currentUser.phone_number,
      _id: currentUser._id,
      sub: currentUser._id,
    };

    const accessToken = await this.generateJwtToken(payload);

    currentUser.accessToken = accessToken;

    return currentUser;
  }

  async register(params: RegisterForUserDto) {
    //Convert to array
    const companies = [params.company_id];

    //Find employment content
    let employment = null;
    if (params.employment_id) {
      employment = await this.employmentService.findOne(params.employment_id);
      if (!employment) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: 'Could not find employment',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    //Check is Identity Card is not exits
    const checkIdentityCard = await this.usersService.findOne({
      personal_id: params.personal_id,
    });

    if (checkIdentityCard) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Identity card alredy exits',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const phoneNumber = params.country_code + params.phone_number;
    //Check is phone number
    if (!isPhoneNumber(phoneNumber)) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Phone number failed',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    //Check is phone number is not exits
    const checkPhone = await this.usersService.findOne({
      country_code: params.country_code,
      phone_number: params.phone_number,
    });

    if (checkPhone) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Phone number alredy exits',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    //Hash Password
    const password_hashed = await this.encryptionPassword(params.password);

    const result: any = await this.usersService.createUser({
      ...params,
      companies: companies,
      password_hashed: password_hashed,
      employment_name: employment?.name,
    });
    result._id = result._id.toString();

    result.accessToken = await this.generateJwtToken({
      email: result.email,
      phone: result.phone,
      _id: result._id,
      sub: result._id,
    });

    return result;
  }

  async encryptionPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async checkPassword(input: string, password: string) {
    return await bcrypt.compare(input, password);
  }

  async forgotPassword(inf: ForgotPassword) {
    const user = await this.usersService.findOne({ personal_id: inf.personal_id });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: `Identity card don't exits`,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const check = await this.otpService.findOne({ userId: user._id });

    if (!check) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: `OTP don't exits`,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const now = Date.now();

    if (now > check.expires) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Timeout OTP. Please try again',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else if (!(await bcrypt.compare(inf.OTP, check.hash))) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'OTP failed',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newPassword = await this.encryptionPassword(inf.new_password);

    const result = await this.usersService.updateUser(user._id, { password_hashed: newPassword });

    return {
      ...result,
      accessToken: await this.generateJwtToken({
        email: result.email,
        phone: result.phone_number,
        _id: result._id,
        sub: result._id,
      }),
    };
  }

  async getOtp(inf: GetOtpDto) {
    const user = await this.usersService.findOne({
      personal_id: inf.personal_id,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: `Identity card don't exits`,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.otpService.create(user._id, user.phone_number);
    return { userId: user._id };
  }

  async verifyOtp(inf: VerifyOtpDto) {
    const check = await this.otpService.findOne({ userId: inf.userId });

    const now = Date.now();

    if (now > check.expires) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Timeout OTP. Please try again',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else if (!(await bcrypt.compare(inf.OTP, check.hash))) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'OTP failed',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = await this.usersService.findOne({ _id: ObjectId(check.userId) });
    //Check user exist
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: `User don't exits`,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    //Approval phone number
    await this.usersService.updateUser(user._id, { phone_number_approval: VerifyType.APPROVED });

    const payload = {
      _id: user._id,
      sub: user._id,
    };

    const token: ResponseVerifyOtp = {
      accessToken: await this.generateJwtToken(payload),
    };

    return token;
  }

  async changePassword(_id: string, inf: ChangePasswordDto) {
    const check = await this.usersService.findOne({ _id: ObjectId(_id) });
    if (!check) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: `User not found`,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (inf.old_password) {
      const compare_password = await bcrypt.compare(inf.old_password, check.password_hashed);
      if (!compare_password) {
        throw new HttpException(
          {
            status: HttpStatus.FAILED_DEPENDENCY,
            error: `Wrong old password`,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    return await this.usersService.updateUser(_id, { password_hashed: await this.encryptionPassword(inf.new_password) });
  }
}
