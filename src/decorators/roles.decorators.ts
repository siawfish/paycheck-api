import { SetMetadata } from '@nestjs/common';
import { Role } from '../module/users/entities/users.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...role: Role[]) => SetMetadata(ROLES_KEY, role);
