import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GetUsersDto } from './dto/get-users.dto';
import { AppHttpResponse } from '../../shared/utils/AppHttpResponse';
import { GetUsersResponseInterface } from './interfaces/get-users-response.interface';
import { SessionAuthAdminGuard } from '../auth/guards/session-auth-admin.guard';

@Controller('/admin')
@UseGuards(SessionAuthAdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/users')
  private async getUsers(
    @Query() getUsersDto: GetUsersDto,
  ): Promise<AppHttpResponse<GetUsersResponseInterface>> {
    return await this.adminService.getUsers(getUsersDto);
  }
}
