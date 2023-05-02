import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CompaniesSubscriber } from './module/companies/subscribers/companies.subscriber';
import { PaymentsSubscriber } from './module/payment-settings/subscribers/payments.subscriber';
import { UserSubscriber } from './module/users/subscribers/users.subscriber';

console.log('process.env', process.env);

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: process.env.MONGODB_DATABASE_URL,
  logger: 'debug',
  subscribers: [PaymentsSubscriber, UserSubscriber, CompaniesSubscriber],
  useUnifiedTopology: true,
  synchronize: true,
  useNewUrlParser: true,
  autoLoadEntities: true,
};

module.exports = typeOrmConfig;
