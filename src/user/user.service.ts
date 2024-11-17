import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { UserWithoutPassword } from '../interfaces';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const prismaCreatedUser = await this.prisma.user.create({
      data: { login: createUserDto.login, password: createUserDto.password },
    });

    const updatedUser: UserWithoutPassword = {
      id: prismaCreatedUser.id,
      login: prismaCreatedUser.login,
      version: prismaCreatedUser.version,
      createdAt: prismaCreatedUser.createdAt.getTime(),
      updatedAt: prismaCreatedUser.updatedAt.getTime(),
    };

    return updatedUser;
  }

  async findAll() {
    const usersPrisma = await this.prisma.user.findMany();

    const updatedUsers: UserWithoutPassword[] = usersPrisma.map((user) => {
      return {
        id: user.id,
        login: user.login,
        version: user.version,
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
      };
    });

    return updatedUsers;
  }

  async findOne(id: string) {
    const userPrisma = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!userPrisma) {
      throw new NotFoundException('User not found');
    }

    const userToReturn: UserWithoutPassword = {
      id: userPrisma.id,
      login: userPrisma.login,
      createdAt: userPrisma.createdAt.getTime(),
      updatedAt: userPrisma.updatedAt.getTime(),
      version: userPrisma.version,
    };

    return userToReturn;
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto) {
    const userPrisma = await this.prisma.user.findUnique({
      where: { id: id },
    });

    if (!userPrisma) {
      throw new NotFoundException();
    }

    if (userPrisma.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException();
    }

    const updatedUserPrisma = await this.prisma.user.update({
      data: {
        password: updatePasswordDto.newPassword,
        version: userPrisma.version + 1,
      },
      where: {
        id: id,
      },
    });

    const userToReturn: UserWithoutPassword = {
      id: updatedUserPrisma.id,
      login: updatedUserPrisma.login,
      createdAt: updatedUserPrisma.createdAt.getTime(),
      updatedAt: updatedUserPrisma.updatedAt.getTime(),
      version: updatedUserPrisma.version,
    };

    return userToReturn;
  }

  async remove(id: string) {
    const userToDelete = await this.findOne(id);

    if (!userToDelete) {
      throw new NotFoundException();
    }

    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}
