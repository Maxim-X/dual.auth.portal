import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from '../../dto/user/signup.dto';
import { UserAuthService } from '../../services/user-auth/user-auth.service';

@Controller('/auth/user')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return await this.userAuthService.signup(signupDto);
  }
}
