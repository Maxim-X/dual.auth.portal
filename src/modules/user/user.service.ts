import { Injectable } from '@nestjs/common';
import { AppHttpResponse } from '../../shared/utils/AppHttpResponse';
import { InitResponseInterface } from './interfaces/init-response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { InitDto } from './dto/init.dto';
import { AppHttpException } from '../../shared/utils/AppHttpException';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async init(
    initDto: InitDto,
  ): Promise<AppHttpResponse<InitResponseInterface>> {
    const user: UserEntity | null = await this.userRepository.findOne({
      where: {
        uid: Equal(initDto.profileUid),
      },
    });

    if (user === null) {
      throw new AppHttpException(
        'Пользователь не найден.',
        'Пользователь не найден.',
      );
    }

    return new AppHttpResponse('Ok', 'Ok', { user: user });
  }
}
