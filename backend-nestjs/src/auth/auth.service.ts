import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (passwordMatch) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  async login({ email, password }: any) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const userData: any = await this.usersService.findOne(user.id);
    delete userData.password;

    userData.roles = await Promise.all(
      userData.roles.map(async (role) => {
        return {
          description: role.description,
          permissions: await Promise.all(
            role.permissions.map(async (p) => p.action),
          ),
        };
      }),
    );

    //TODO UPDATE USER LAST LOGIN

    return {
      user: userData,
      access_token: this.jwtService.sign({ ...userData }),
    };
  }
}
