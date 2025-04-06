import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { InitHttpDto } from './dto/init.dto';
import { AppHttpResponse } from '../../shared/utils/AppHttpResponse';
import { InitResponseInterface } from './interfaces/init-response.interface';
import { ProfileUidDecorator } from '../auth/decorators/profile-uid.decorator';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';

@Controller('/user')
@UseGuards(SessionAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/init')
  private async init(
    @Query() initHttpDto: InitHttpDto,
    @ProfileUidDecorator() profileUid: string,
  ): Promise<AppHttpResponse<InitResponseInterface>> {
    return await this.userService.init({
      ...initHttpDto,
      profileUid: profileUid,
    });
  }
}
