import { IsEmail, IsString, Length, ValidateIf } from 'class-validator';

export class LoginDto {
  @ValidateIf((object: LoginDto) => !object.email, {
    message: 'login: Должен быть указан логин или email',
  })
  @IsString({ message: 'login: Логин должен быть строкой' })
  @Length(3, 25, {
    message: 'login: Логин должен содержать от 3 до 25 символов',
  })
  login?: string;

  @ValidateIf((object: LoginDto) => !object.login, {
    message: 'email: Должен быть указан логин или email',
  })
  @IsEmail({}, { message: 'email: Неверный формат email' })
  email?: string;

  @IsString({ message: 'password: Пароль должен быть строкой' })
  password: string;
}
