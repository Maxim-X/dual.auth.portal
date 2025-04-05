import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { RoleEnum } from '../../enum/role.enum';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsUUID()
  @IsNumber()
  profile_uid: string;

  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: RoleEnum;
}
