import { UserEntity } from '../../../database/entities/user.entity';

export interface InitResponseInterface {
  user: UserEntity | null;
}
