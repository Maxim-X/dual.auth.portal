import { Injectable, ValidationError } from '@nestjs/common';
import { SignupDto } from '../../dto/admin/signup.dto';
import { SignupResponseInterface } from '../../interfaces/admin/signup-response.interface';
import { AppHttpResponse } from '../../../../shared/utils/AppHttpResponse';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { AdminEntity } from '../../../../database/entities/admin.entity';
import * as bcrypt from 'bcryptjs';
import { GeneralAuthService } from '../general-auth/general-auth.service';
import { RoleEnum } from '../../enum/role.enum';
import { AppHttpException } from '../../../../shared/utils/AppHttpException';
import { LoginResponseInterface } from '../../interfaces/admin/login-response.interface';
import { LoginDto } from '../../dto/admin/login.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly generalAuthService: GeneralAuthService,
  ) {}

  public async signup(
    signupDto: SignupDto,
  ): Promise<AppHttpResponse<SignupResponseInterface>> {
    const validated: ValidationError[] = await validate(
      plainToInstance(SignupDto, signupDto),
    );
    if (validated.length > 0) {
      throw new AppHttpException('Ошибки валидации.', 'Ошибки валидации.', {
        errors: JSON.stringify(
          validated.map((item: ValidationError) => item.constraints),
        ),
      });
    }

    const checkExistsAdmin = await this.adminRepository.exists({
      where: {
        email: signupDto.email,
      },
    });

    if (checkExistsAdmin) {
      throw new AppHttpException(
        'Администратор с данным email уже зарегистрирован.',
        'Администратор с данным email уже зарегистрирован.',
      );
    }

    const hash: string = await bcrypt.hash(signupDto.password, 10);
    const newAdmin = new AdminEntity();
    newAdmin.email = signupDto.email;
    newAdmin.password = hash;
    const admin = await this.adminRepository.save(newAdmin);

    const createSession = await this.generalAuthService.createSession({
      profile_uid: admin.uid,
      role: RoleEnum.ADMIN,
    });

    return new AppHttpResponse('Ok', 'Ok', {
      jwtToken: createSession.jwtToken,
    });
  }

  public async login(
    loginDto: LoginDto,
  ): Promise<AppHttpResponse<LoginResponseInterface>> {
    const admin: AdminEntity | null = await this.adminRepository.findOne({
      select: {
        uid: true,
        password: true,
      },
      where: {
        email: Equal(loginDto.email),
      },
    });

    if (admin === null) {
      throw new AppHttpException(
        'Администратор с данным Email не найден. Пожалуйста, проверьте введенные данные и попробуйте снова.',
        'Администратор с данным Email не найден. Пожалуйста, проверьте введенные данные и попробуйте снова.',
      );
    }

    const checkPassword: boolean = await bcrypt.compare(
      loginDto.password,
      admin.password,
    );

    if (!checkPassword) {
      throw new AppHttpException(
        'Неверные учетные данные. Пожалуйста, проверьте введенные данные и попробуйте снова.',
        'Неверные учетные данные. Пожалуйста, проверьте введенные данные и попробуйте снова.',
      );
    }

    const createSession = await this.generalAuthService.createSession({
      profile_uid: admin.uid,
      role: RoleEnum.ADMIN,
    });

    return new AppHttpResponse('Ok', 'Ok', {
      jwtToken: createSession.jwtToken,
    });
  }
}
