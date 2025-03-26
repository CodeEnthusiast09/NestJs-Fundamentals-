import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from 'src/entities/users/users.entity';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid4 } from 'uuid';
import { CreateUserDTO } from './dto/create-user-dto';
import { LoginDTO } from 'src/auth/dto/login-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userDTO: CreateUserDTO): Promise<User> {
    const user = new User();

    user.firstName = userDTO.firstName;

    user.lastName = userDTO.lastName;

    user.email = userDTO.email;

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(userDTO.password, salt);

    user.apiKey = uuid4();

    const savedUser = await this.userRepository.save(user);

    delete savedUser.password;

    return savedUser;

    // const user = new User();
    // const salt = await bcrypt.genSalt();
    // userDTO.password = await bcrypt.hash(userDTO.password, salt);
    // user.apiKey = uuid4();
    // const savedUser = await this.userRepository.save(userDTO);
    // delete savedUser.password;
    // return savedUser;
  }

  async findOne(data: LoginDTO): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }
    return user;
  }

  async updateSecretKey(userId: string, secret: string): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        twoFASecret: secret,
        enable2FA: true,
      },
    );
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id: id });
  }

  async disable2FA(userId: string): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        enable2FA: false,
        twoFASecret: null,
      },
    );
  }

  async findByApiKey(apiKey: string): Promise<User> {
    return this.userRepository.findOneBy({ apiKey });
  }
}
