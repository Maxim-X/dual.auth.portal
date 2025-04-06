import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'email: Email не должен быть пустым' })
  @IsEmail({}, { message: 'email: Неверный формат email' })
  email: string;

  @IsNotEmpty({ message: 'password: Пароль не должен быть пустым' })
  @IsString({ message: 'password: Пароль должен быть строкой' })
  password: string;
}
