import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  @IsEmail({}, { message: 'Неверный формат email' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @IsString({ message: 'Пароль должен быть строкой' })
  password: string;
}
