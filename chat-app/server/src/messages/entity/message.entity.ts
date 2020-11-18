import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '../../users/entity/user.entity';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => UserEntity)
  toUser: UserEntity;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  body: string;

  @Column({ update: false })
  createdAt: number = Date.now();
}
