import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FieldNameNoApproval, User, VerifyType } from './entities/users.entity';
import { ObjectId } from 'mongodb';
import { isEnum } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(query: any): Promise<User> {
    const user = await this.usersRepository.findOne({ where: query });
    if (user) {
      user._id = user._id.toString();
      return user;
    }
    return null;
  }

  async getProfile(req: any) {
    const authorizationHeader = req.headers['authorization'];

    const user = { ...req.user, accessToken: authorizationHeader.split(' ')[1] };

    return user;
  }

  async responseUpdateUser(id: string, updateData: any, req: any) {
    const check_before = await this.findOne({ _id: ObjectId(id) });
    if (!check_before) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: `USER_NOT_EXIST`,
          messageCode: 1600,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const user = await this.updateUser(id, updateData);

    const authorizationHeader = req.headers['authorization'];

    return { ...user, accessToken: authorizationHeader.split(' ')[1] };
  }

  async findAll(query: any) {
    const { limit, page, personal_id, freelancer_type, full_name } = query;

    const Query = {};

    if (full_name) {
      Query['full_name'] = { $regex: `^${full_name}`, $options: 'i' };
    }
    if (personal_id) {
      Query['personal_id'] = { $regex: `^${personal_id}` };
    }

    if (freelancer_type) {
      Query['freelancer_type'] = freelancer_type;
    }

    const data = await this.usersRepository.find({
      where: Query,
      skip: Number(page) * Number(limit),
      take: Number(limit),
    });

    const result = data.map((value) => {
      value._id = value._id.toString();
      return value;
    });

    const count = await this.usersRepository.count(Query);

    const total_page = Math.ceil(count / limit);

    return { total_page: total_page, limit: Number(limit), current_page: Number(page), data: result };
  }

  async createUser(user: any) {
    const createUser = this.usersRepository.create(user);
    return await this.usersRepository.save(createUser);
  }

  async updateUser(id: string, updateData: any) {
    const user: any = await this.usersRepository.findOne({ where: { _id: ObjectId(id) } });

    Object.keys(updateData).forEach((value) => {
      if (!isEnum(value, FieldNameNoApproval)) {
        user[value + '_approval'] = VerifyType.PENDING;
      }
      if (value === 'phone_number') {
        user[value + '_approval'] = VerifyType.PENDING_ADMIN;
      }
      user[value] = updateData[value];
    });

    const result = await this.usersRepository.save(user);
    return await this.findOne({ _id: ObjectId(result._id) });
  }

  async delete(id: string) {
    return await this.usersRepository.delete(id);
  }

  async approveUser(id: string) {
    const user: any = await this.usersRepository.findOne({ where: { _id: ObjectId(id) } });
    user.isApproved = true;
    user.companies_approval = VerifyType.APPROVED;
    user.full_name_approval = VerifyType.APPROVED;
    user.phone_number_approval = VerifyType.APPROVED;
    user.email_approval = VerifyType.APPROVED;
    user.address_approval = VerifyType.APPROVED;
    user.country_approval = VerifyType.APPROVED;
    user.freelancer_type_approval = VerifyType.APPROVED;
    user.employment_id_approval = VerifyType.APPROVED;

    const result = await this.usersRepository.save(user);
    return await this.findOne({ _id: ObjectId(result._id) });
  }
}
