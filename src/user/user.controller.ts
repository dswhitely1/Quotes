import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './interface/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  public async getAll(): Promise<UserDTO[]> {
    return this.userService.getAll();
  }
}
