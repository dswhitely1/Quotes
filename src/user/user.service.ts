import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './interface/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async getAll(): Promise<UserDTO[]> {
    return await this.userRepository
      .find()
      .then(users => users.map(user => UserDTO.fromEntity(user)));
  }
}
