import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserDTO } from '../user/interface/user.dto';
import { AuthDTO } from './interface/auth.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public register(@Body() dto: UserDTO): Promise<UserDTO> {
    return this.authService.create(dto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  public login(@Request() req): Promise<AuthDTO> {
    return this.authService.login(req.user);
  }
}
