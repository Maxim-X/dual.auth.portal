import { UserEntity } from '../../../database/entities/user.entity';

export interface GetUsersResponseInterface {
  users: UserEntity[];
  total: number;
}
