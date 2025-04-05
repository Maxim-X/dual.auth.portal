import { Body, Controller, Post } from '@nestjs/common';
import { AppHttpResponse } from '../../../../shared/utils/AppHttpResponse';
import { AdminAuthService } from '../../services/admin-auth/admin-auth.service';
import { LoginResponseInterface } from '../../interfaces/admin/login-response.interface';
import { LoginDto } from '../../dto/admin/login.dto';

@Controller('/auth/admin')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  private async login(
    @Body() loginDto: LoginDto,
  ): Promise<AppHttpResponse<LoginResponseInterface>> {
    return await this.adminAuthService.login(loginDto);
  }
}
