import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignupDto {
  @IsNotEmpty({ message: 'email: Email не должен быть пустым' })
  @IsEmail({}, { message: 'email: Неверный формат email' })
  email: string;

  @IsString({ message: 'password: Пароль должен быть строкой' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,30}$/, {
    message:
      'password: Пароль должен содержать минимум 6 символов, максимум 30 символов, включая хотя бы одну букву и одну цифру',
  })
  password: string;
}
