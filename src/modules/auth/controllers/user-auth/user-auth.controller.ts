import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from '../../dto/user/signup.dto';
import { UserAuthService } from '../../services/user-auth/user-auth.service';
import { AppHttpResponse } from '../../../../shared/utils/AppHttpResponse';
import { SignupResponseInterface } from '../../interfaces/user/signup-response.interface';
import { LoginDto } from '../../dto/user/login.dto';

@Controller('/auth/user')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post('signup')
  private async signup(
    @Body() signupDto: SignupDto,
  ): Promise<AppHttpResponse<SignupResponseInterface>> {
    return await this.userAuthService.signup(signupDto);
  }

  @Post('login')
  private async login(
    @Body() loginDto: LoginDto,
  ): Promise<AppHttpResponse<SignupResponseInterface>> {
    return await this.userAuthService.login(loginDto);
  }
}
