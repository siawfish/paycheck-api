import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { HelpRequestEntity } from './entity/help-request.entity';
import { HelpRequestController } from './help-request.controller';
import { HelpRequestService } from './help-request.service';

@Module({
  imports: [TypeOrmModule.forFeature([HelpRequestEntity])],
  controllers: [HelpRequestController],
  providers: [HelpRequestService, CaslAbilityFactory],
})
export class HelpRequestModule {}
