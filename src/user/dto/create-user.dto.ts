import { UserRole } from '../entities/user-role.enum';

export class CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
  programId: number;
}
