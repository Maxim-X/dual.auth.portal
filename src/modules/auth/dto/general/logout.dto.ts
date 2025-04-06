import { IsNotEmpty, IsUUID } from 'class-validator';

export class LogoutHttpDto {}

export class LogoutDto extends LogoutHttpDto {
  @IsNotEmpty({ message: 'sessionUid: Поле не должно быть пустым.' })
  @IsUUID(undefined, {
    message: 'sessionUid: Значение должно быть в формате UUID.',
  })
  sessionUid: string;
}
