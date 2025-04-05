import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column({ type: 'varchar' })
  login: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ default: false })
  is_email_confirmed: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
