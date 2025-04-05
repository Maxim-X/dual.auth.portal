import {
  IsEmail,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class LoginDto {
  @ValidateIf((object: LoginDto) => !object.email, {
    message: 'Должен быть указан логин или email',
  })
  @IsString({ message: 'Логин должен быть строкой' })
  @Length(3, 25, { message: 'Логин должен содержать от 3 до 25 символов' })
  login?: string;

  @ValidateIf((object: LoginDto) => !object.login, {
    message: 'Должен быть указан логин или email',
  })
  @IsEmail({}, { message: 'Неверный формат email' })
  email?: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  password: string;
}
