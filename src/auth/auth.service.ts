import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';
import { UserDTO } from '../user/interface/user.dto';
import { AuthDTO } from './interface/auth.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  public async create(dto: UserDTO) : Promise<UserDTO> {
    return await this.userRepository.save(dto.toEntity()).then(user => UserDTO.fromEntity(user))
  }

  public async login(dto: AuthDTO): Promise<AuthDTO> {
    const user = plainToClass(User, dto)
    return AuthDTO.fromEntity(user, 'Random Token')
  }
}
