import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { User } from '../../models/user.entity';

export class UserDTO implements Readonly<UserDTO> {
  @ApiHideProperty()
  id: string;

  @ApiProperty({ required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @Length(8, 100)
  password: string;

  @ApiHideProperty()
  createdAt: Date;

  @ApiHideProperty()
  updatedAt: Date;

  public static from(dto: Partial<UserDTO>) {
    const user = new UserDTO();
    user.id = dto.id;
    user.email = dto.email;
    user.createdAt = dto.createdAt;
    user.updatedAt = dto.updatedAt;
    return user;
  }

  public static fromEntity(entity: User) {
    return this.from({
      id: entity.id,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  public toEntity() {
    const newUser = new User();
    newUser.id = this.id;
    newUser.email = this.email;
    newUser.password = this.password;
    newUser.hashPassword();
    newUser.createdAt = this.createdAt;
    newUser.updatedAt = this.updatedAt;
    return newUser;
  }
}
