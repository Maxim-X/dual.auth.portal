import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { RoleEnum } from '../../enum/role.enum';

export class CreateSessionDto {
  @IsNotEmpty({ message: 'profile_uid: Поле не должно быть пустым.' })
  @IsUUID(undefined, {
    message: 'profile_uid: Значение должно быть в формате UUID.',
  })
  profile_uid: string;

  @IsNotEmpty({ message: 'role: Поле не должно быть пустым.' })
  @IsEnum(RoleEnum, {
    message:
      'role: Значение должно быть одним из допустимых значений перечисления RoleEnum.',
  })
  role: RoleEnum;
}
