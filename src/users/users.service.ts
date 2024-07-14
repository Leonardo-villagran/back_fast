import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserDTO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 8);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findAll(): Promise<UserDTO[]> {
    const users = await this.prisma.user.findMany({ include: { role: true } });
    return users.map((user) => {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: {
          id: user.role.id,
          name: user.role.name,
          createdAt: user.role.createdAt,
          updatedAt: user.role.updatedAt,
        },
      };
    });
  }

  async findOne(id: number): Promise<UserDTO | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: {
        id: user.role.id,
        name: user.role.name,
        createdAt: user.role.createdAt,
        updatedAt: user.role.updatedAt,
      },
    };
  }
  async update(
    id: number,
    data: Prisma.UserUpdateInput,
  ): Promise<Omit<User, 'password'>> {
    // Si se proporciona una nueva contraseña, haz el hash
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password as string, 8);
      data.password = hashedPassword;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        //password: true,
        roleId: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        // No seleccionamos el campo 'password'
      },
    });

    return updatedUser;
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
