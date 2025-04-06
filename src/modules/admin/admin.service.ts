import { Injectable } from '@nestjs/common';
import { GetUsersDto } from './dto/get-users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { AppHttpResponse } from '../../shared/utils/AppHttpResponse';
import { GetUsersResponseInterface } from './interfaces/get-users-response.interface';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async getUsers(
    getUsersDto: GetUsersDto,
  ): Promise<AppHttpResponse<GetUsersResponseInterface>> {
    const findOptionsWhere: FindOptionsWhere<UserEntity> = {};
    if (getUsersDto.login) {
      findOptionsWhere.login = ILike(getUsersDto.login);
    }

    if (getUsersDto.email) {
      findOptionsWhere.email = ILike(getUsersDto.email);
    }

    const skip =
      getUsersDto.page === 1 ? 0 : (getUsersDto.page - 1) * getUsersDto.limit;

    const [users, total]: [users: UserEntity[], total: number] =
      await this.userRepository.findAndCount({
        where: findOptionsWhere,
        take: getUsersDto.limit,
        skip: skip,
        order: {
          created_at: 'DESC',
        },
      });

    return new AppHttpResponse('Ok', 'Ok', { users, total });
  }
}
