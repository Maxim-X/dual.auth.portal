import {
  IsEmail,IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty({ message: 'Логин не должен быть пустым' })
  @IsString({ message: 'Логин должен быть строкой' })
  @Length(3, 25, { message: 'Логин должен содержать от 3 до 25 символов' })
  login: string;

  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  @IsEmail({}, { message: 'Неверный формат email' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,30}$/, {
    message:
      'Пароль должен содержать минимум 6 символов, максимум 30 символов, включая хотя бы одну букву и одну цифру',
  })
  password: string;
}
