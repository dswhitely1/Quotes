import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/interface/user.dto';
import { AuthDTO } from './interface/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public register(@Body() dto: UserDTO): Promise<UserDTO> {
    return this.authService.create(dto);
  }

  @Post('login')
  @HttpCode(200)
  public login(@Body() dto: AuthDTO): Promise<AuthDTO> {
    return this.authService.login(dto);
  }
}
