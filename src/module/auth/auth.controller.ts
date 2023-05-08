import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, ForgotPassword, GetOtpDto, LoginDto, RegisterForUserDto, VerifyOtpDto } from './dto/auth.dto';
import { User } from 'src/module/users/entities/users.entity';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { ResponseForgotPassword, ResponseVerifyOtp } from '../sms-otp/entities/sms-otp.entity';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login with Personal ID and Password' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @ApiOkResponse({ type: User })
  @Public()
  async login(@Body() body: LoginDto): Promise<User> {
    const user = await this.authService.login(body);
    return user;
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register an account for users' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @ApiResponse({ status: 201, description: 'Success Created', type: User })
  @Public()
  async register(@Body() body: RegisterForUserDto) {
    return await this.authService.register(body);
  }

  @Post('/get-otp')
  @ApiOperation({ summary: 'Create an otp and send for client, used in {Register, Forgot password} ' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @ApiResponse({ status: 200, description: 'OK', type: ResponseForgotPassword })
  @Public()
  async getOtp(@Body() body: GetOtpDto) {
    return await this.authService.getOtp(body);
  }

  @Post('/forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @ApiResponse({ status: 200, description: 'OK', type: ResponseVerifyOtp })
  @Public()
  @ApiOkResponse({ type: User })
  async forgotPassword(@Body() body: ForgotPassword) {
    return await this.authService.forgotPassword(body);
  }

  @Post('/verify-otp')
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Invalid record' })
  @ApiResponse({ status: 200, description: 'OK', type: ResponseVerifyOtp })
  @Public()
  @ApiOkResponse({ type: User })
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return await this.authService.verifyOtp(body);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @Post('/change-password')
  @ApiOkResponse({ type: User })
  async changePassword(@Req() req: any, @Body() body: ChangePasswordDto) {
    return await this.authService.changePassword(req.user._id, body);
  }

  @ApiOperation({ summary: 'Dangerously update user role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @Post('/dangerously-update-role')
  @Public()
  @ApiOkResponse({ type: User })
  async dangerouslyUpdateRole(@Req() req: any, @Body() body: any) {
    return await this.authService.dangerouslyUpdateRole(body);
  }
}
