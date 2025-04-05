import { Injectable } from '@nestjs/common';
import { SignupDto } from '../../dto/user/signup.dto';
import { AppHttpException } from '../../../../shared/utils/AppHttpException';
import { AppHttpResponse } from '../../../../shared/utils/AppHttpResponse';
import { SignupResponseInterface } from '../../interfaces/user/signup-response.interface';
import { UserEntity } from '../../../../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { GeneralAuthService } from '../general-auth/general-auth.service';
import { RoleEnum } from '../../enum/role.enum';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly generalAuthService: GeneralAuthService,
  ) {}

  public async signup(
    signupDto: SignupDto,
  ): Promise<AppHttpResponse<SignupResponseInterface>> {
    if (!signupDto.email && !signupDto.login) {
      throw new AppHttpException(
        'Должен быть указан логин или email',
        'Должен быть указан логин или email',
      );
    }

    const checkExistsUser = await this.userRepository.exists({
      where: {
        email: signupDto.email,
        login: signupDto.login,
      },
    });

    if (checkExistsUser) {
      throw new AppHttpException(
        'Пользователь с данным логином или email уже зарегистрирован',
        'Пользователь с данным логином или email уже зарегистрирован',
      );
    }

    const hash: string = await bcrypt.hash(signupDto.password, 10);

    const newUser = new UserEntity();
    newUser.email = signupDto.email ?? null;
    newUser.login = signupDto.login ?? null;
    newUser.is_email_confirmed = false;
    newUser.password = hash;
    const user: UserEntity = await this.userRepository.save(newUser);

    const createSession = await this.generalAuthService.createSession({
      profile_uid: user.uid,
      role: RoleEnum.USER,
    });

    return new AppHttpResponse('Ok', 'Ok', {
      jwtToken: createSession.jwtToken,
    });
  }
}
