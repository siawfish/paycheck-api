import { Module, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { LocalStrategy } from './strategy/local.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../users/entities/users.entity';
import * as dotenv from 'dotenv';
import { User } from '../users/entities/users.entity';
import { SmsOtpService } from '../sms-otp/sms-otp.service';
import { SmsOtp } from '../sms-otp/entities/sms-otp.entity';
import { CompaniesService } from '../companies/companies.service';
import { EmploymentsService } from '../employments/employments.service';
import { Company } from '../companies/entities/company.entity';
import { Employment } from '../employments/entities/employment.entity';
// import { Repository } from 'typeorm';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SmsOtp, Company, Employment]),
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.SECRET_OR_KEY,
      signOptions: { expiresIn: '365d' },
    }),
    // Repository,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    LocalStrategy,
    UsersService,
    SmsOtpService,
    CompaniesService,
    EmploymentsService,
    UsersModule,
    // Repository,
  ],
})
export class AuthModule {}
