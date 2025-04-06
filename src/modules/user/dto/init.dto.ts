import { IsString, IsUUID } from 'class-validator';

export class InitHttpDto {}
export class InitDto extends InitHttpDto {
  @IsString({ message: 'profileUid: Значение должно быть строкой.' })
  @IsUUID(undefined, {
    message: 'profileUid: Значение должно быть в формате UUID.',
  })
  profileUid: string;
}
