import { Body, Controller, Post } from '@nestjs/common';
import { GeneralAuthService } from '../../services/general-auth/general-auth.service';
import { LogoutHttpDto } from '../../dto/general/logout.dto';
import { AppHttpResponse } from '../../../../shared/utils/AppHttpResponse';
import { SessionUidDecorator } from '../../decorators/session-uid.decorator';

@Controller('/auth')
export class GeneralAuthController {
  constructor(private readonly generalAuthService: GeneralAuthService) {}

  @Post('logout')
  private async logout(
    @Body() logoutHttpDto: LogoutHttpDto,
    @SessionUidDecorator() sessionUid: string,
  ): Promise<AppHttpResponse<object>> {
    return await this.generalAuthService.logout({
      ...logoutHttpDto,
      sessionUid: sessionUid,
    });
  }
}
