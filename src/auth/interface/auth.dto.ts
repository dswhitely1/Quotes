import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';
import { User } from '../../models/user.entity';

export class AuthDTO implements Readonly<AuthDTO> {

  @ApiProperty({required: true})
  @IsEmail()
  email: string

  @ApiProperty({required: true})
  @Length(8, 100)
  password: string

  @ApiHideProperty()
  token: string

  @ApiHideProperty()
  message: string

  public static from(dto: Partial<AuthDTO>) {
    const auth = new AuthDTO()
    auth.message = `Welcome ${dto.email}!`
    auth.token = dto.token
    return auth
  }

  public static fromEntity(entity: User, token: string) {
    return this.from({
      email: entity.email,
      token
    })
  }
}
