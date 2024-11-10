import { randomUUID } from 'node:crypto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User, UserWithoutPassword } from '../interfaces';

@Injectable()
export class UserService {
  private users: User[] = [];

  async create(createUserDto: CreateUserDto) {
    const currentTimestamp = Date.now();

    const userWithoutPassword: UserWithoutPassword = {
      id: randomUUID(),
      login: createUserDto.login,
      version: 1,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
    };

    const newUser: User = {
      ...userWithoutPassword,
      password: createUserDto.password,
    };

    this.users.push(newUser);

    return userWithoutPassword;
  }

  async findAll() {
    return this.users;
  }

  async findOne(id: string) {
    const currentUsers = await this.findAll();

    const user = currentUsers.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userToReturn: UserWithoutPassword = {
      id: user.id,
      login: user.login,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      version: user.version,
    };

    return userToReturn;
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const currentUsers = await this.findAll();

    const user = currentUsers.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException();
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException();
    }

    const userToReturn: UserWithoutPassword = {
      id: user.id,
      login: user.login,
      createdAt: user.createdAt,
      updatedAt: Date.now(),
      version: user.version + 1,
    };

    this.users = currentUsers.map((user) => {
      if (user.id === id) {
        return { ...userToReturn, password: updatePasswordDto.newPassword };
      }

      return user;
    });

    return userToReturn;
  }

  async remove(id: string) {
    const currentUsers = await this.findAll();

    const userToDelete = currentUsers.find((user) => user.id === id);

    if (!userToDelete) {
      throw new NotFoundException();
    }

    this.users = currentUsers.filter((user) => user.id !== id);
  }
}
