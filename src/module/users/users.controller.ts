import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckPolicies } from 'src/decorators/polices.decorator';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { Action, AppAbility } from '../casl/casl-ability.factory';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserType } from './entities/users.entity';
import { UsersService } from './users.service';
import { ObjectId } from 'mongodb';

@ApiTags('Users')
@UseGuards(PoliciesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(public readonly userService: UsersService) {}

  @ApiBearerAuth()
  @ApiQuery({
    required: true,
    name: 'limit',
    explode: true,
    example: 10,
  })
  @ApiQuery({
    required: true,
    name: 'page',
    explode: true,
    example: 0,
  })
  @ApiQuery({
    required: false,
    name: 'personal_id',
    explode: true,
    example: '053605416',
  })
  @ApiQuery({
    required: false,
    name: 'full_name',
    explode: true,
    example: 'Donlar Tump',
  })
  @ApiQuery({
    required: false,
    name: 'freelancer_type',
    explode: true,
    enum: UserType,
    example: UserType.FREELANCER,
  })
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK', type: [User] })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, User))
  @Get('')
  findAll(@Query() query: any) {
    return this.userService.findAll(query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get user's profile` })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @Get('me')
  findUser(@Req() req: any) {
    return this.userService.getProfile(req);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters',
  })
  @ApiOperation({ summary: `Get one user` })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, User))
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne({ _id: ObjectId(id) });
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters',
  })
  @ApiOperation({ summary: `Change information in profile` })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK', type: User })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto, @Req() req: any) {
    return this.userService.responseUpdateUser(id, body, req);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters',
  })
  @ApiOperation({ summary: `Delete a user` })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, User))
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 200, description: 'OK' })
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
