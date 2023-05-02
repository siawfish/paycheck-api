import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth/auth.module';
import { UsersModule } from './module/users/users.module';
import { PaymentsModule } from './module/payment-settings/payments.module';
import { InvoicesModule } from './module/invoices/invoices.module';
import { TimersModule } from './module/timers/timers.module';
import { CompaniesModule } from './module/companies/companies.module';
import { SmsOtpModule } from './module/sms-otp/sms-otp.module';
import { HelpRequestModule } from './module/help-request/help-request.module';
import * as typeOrmConfig from './typeorm.config';
import { PayChecksModule } from './module/pay-checks/pay-checks.module';
import { TermOfServiceModule } from './module/term-of-service/term-of-service.module';
import { BankTransferModule } from './module/bank-transfer/bank-transfer.module';
import { UploadFilesModule } from './module/upload-files/upload-files.module';
import { TaxesModule } from './module/taxes/taxes.module';
import { CronService } from './cron/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { CaslModule } from './module/casl/casl.module';
import { BanksModule } from './module/banks/banks.module';
import { EmploymentsModule } from './module/employments/employments.module';
import { LocationModule } from './module/location/location.module';
import { NotificationsModule } from './module/notifications/notifications.module';
import { FcmModule } from './module/fcm/fcm.module';
import { CompanyFileModule } from './module/company-file/company-file.module';
import { LogsModule } from './module/paycheck-logs/logs.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),

    RouterModule.register([
      {
        path: 'api/v1/auth',
        module: AuthModule,
      },
    ]),
    AuthModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: UsersModule,
      },
    ]),
    UsersModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: PaymentsModule,
      },
    ]),
    PaymentsModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: InvoicesModule,
      },
    ]),
    InvoicesModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: TimersModule,
      },
    ]),
    TimersModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: CompaniesModule,
      },
    ]),
    CompaniesModule,
    SmsOtpModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: HelpRequestModule,
      },
    ]),
    HelpRequestModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: PayChecksModule,
      },
    ]),
    PayChecksModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: TermOfServiceModule,
      },
    ]),
    TermOfServiceModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: BankTransferModule,
      },
    ]),
    BankTransferModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: UploadFilesModule,
      },
    ]),
    UploadFilesModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: TaxesModule,
      },
    ]),
    TaxesModule,
    ScheduleModule.forRoot(),
    CronModule,
    CaslModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: BanksModule,
      },
    ]),
    BanksModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: EmploymentsModule,
      },
    ]),
    EmploymentsModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: LocationModule,
      },
    ]),
    LocationModule,
    NotificationsModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: NotificationsModule,
      },
    ]),
    RouterModule.register([
      {
        path: 'api/v1/',
        module: FcmModule,
      },
    ]),
    FcmModule,
    CompanyFileModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: CompanyFileModule,
      },
    ]),
    LogsModule,
    RouterModule.register([
      {
        path: 'api/v1/',
        module: LogsModule,
      },
    ]),
  ],
  controllers: [],
  providers: [CronService],
})
export class AppModule {}
