import { Injectable } from '@nestjs/common';
import { SignupDto } from '../../dto/user/signup.dto';
import { AppHttpException } from '../../../../shared/utils/AppHttpException';
import { AppHttpResponse } from '../../../../shared/utils/AppHttpResponse';
import { SignupResponseInterface } from '../../interfaces/user/signup-response.interface';
import { UserEntity } from '../../../../database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { GeneralAuthService } from '../general-auth/general-auth.service';
import { RoleEnum } from '../../enum/role.enum';
import { LoginDto } from '../../dto/user/login.dto';
import { LoginResponseInterface } from '../../interfaces/user/login-response.interface';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

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
    const checkExistsUser = await this.userRepository.exists({
      where: {
        email: signupDto.email,
        login: signupDto.login,
      },
    });

    if (checkExistsUser) {
      throw new AppHttpException(
        'Пользователь с данным логином или email уже зарегистрирован.',
        'Пользователь с данным логином или email уже зарегистрирован.',
      );
    }

    const hash: string = await bcrypt.hash(signupDto.password, 10);

    const newUser = new UserEntity();
    newUser.email = signupDto.email;
    newUser.login = signupDto.login;
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

  public async login(
    loginDto: LoginDto,
  ): Promise<AppHttpResponse<LoginResponseInterface>> {
    const findOptionsWhere: FindOptionsWhere<UserEntity>[] = [];
    if (loginDto.login) {
      findOptionsWhere.push({
        login: Equal(loginDto.login),
      });
    }

    if (loginDto.email) {
      findOptionsWhere.push({
        email: Equal(loginDto.email),
      });
    }

    const user: UserEntity | null = await this.userRepository.findOne({
      select: {
        uid: true,
        password: true,
      },
      where: findOptionsWhere,
    });

    if (user === null) {
      throw new AppHttpException(
        'Пользователь с данным Email/Логином не найден. Пожалуйста, проверьте введенные данные и попробуйте снова.',
        'Пользователь с данным Email/Логином не найден. Пожалуйста, проверьте введенные данные и попробуйте снова.',
      );
    }

    const checkPassword: boolean = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!checkPassword) {
      throw new AppHttpException(
        'Неверные учетные данные. Пожалуйста, проверьте введенные данные и попробуйте снова.',
        'Неверные учетные данные. Пожалуйста, проверьте введенные данные и попробуйте снова.',
      );
    }

    const createSession = await this.generalAuthService.createSession({
      profile_uid: user.uid,
      role: RoleEnum.USER,
    });

    return new AppHttpResponse('Ok', 'Ok', {
      jwtToken: createSession.jwtToken,
    });
  }
}
