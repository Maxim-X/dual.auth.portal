import { IsNotEmpty, IsUUID } from 'class-validator';

export class LogoutHttpDto {}

export class LogoutDto extends LogoutHttpDto {
  @IsNotEmpty()
  @IsUUID()
  sessionUid: string;
}
