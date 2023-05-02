import { Body, ClassSerializerInterceptor, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckPolicies } from 'src/decorators/polices.decorator';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { Action, AppAbility } from '../casl/casl-ability.factory';
import { User } from '../users/entities/users.entity';
import { NotificationGlobal, NotificationUser } from './dto/notification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Notification')
@UseGuards(PoliciesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('notification')
export class NotificationController {
  constructor(public readonly nfService: NotificationsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: `Push notification for users` })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, User))
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK' })
  @Post('per')
  sendNotification(@Body() message: NotificationUser) {
    return this.nfService.sendNotificationForUser(message);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Push notification for all users` })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, User))
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @Post('global')
  sendGlobal(@Body() message: NotificationGlobal) {
    return this.nfService.sendNotificationGlobal(message);
  }
}
