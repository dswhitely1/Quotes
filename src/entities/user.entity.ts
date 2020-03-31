import {Column, Entity} from 'typeorm';
import {BaseEntity} from './base.entity';
import * as bcrypt from 'bcryptjs'

@Entity({name: 'user'})
export class User extends BaseEntity {
  @Column()
  email: string

  @Column()
  password: string

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10)
  }

  checkPassword(password: string) {
    return bcrypt.compareSync(password, this.password)
  }
}
