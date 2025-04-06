import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersDto {
  @IsNumber({}, { message: 'page: Номер страницы должен быть числом.' })
  @Min(1, { message: 'page: Номер страницы не может быть меньше 1.' })
  @Type(() => Number)
  page: number;

  @IsNumber({}, { message: 'limit: Лимит должен быть числом.' })
  @Min(1, { message: 'limit: Лимит не может быть меньше 1.' })
  @Max(200, { message: 'limit: Лимит не может быть больше 200.' })
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsString({ message: 'login: Логин должен быть строкой.' })
  login?: string;

  @IsOptional()
  @IsString({ message: 'email: Email должен быть строкой.' })
  email?: string;
}
