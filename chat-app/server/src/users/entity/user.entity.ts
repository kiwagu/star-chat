import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  uid?: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  firstName?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  lastName?: string;

  @Column({
    type: 'varchar',
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  email?: string;

  cardNumber = '4242 4242 4242 4242';

  cardName = 'John Smith';

  cardExpiry = '1123';

  cardCvc = '737';

  @BeforeInsert() async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
