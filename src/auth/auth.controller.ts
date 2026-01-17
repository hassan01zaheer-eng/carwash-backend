import { Controller, Post, Request, UseGuards, Body, BadRequestException } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UsersService } from '../users/users.service';
import { HashService } from './hash.service';
import { Role } from './roles.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}
  @Post('signup')
  async signup(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role?: Role,
    @Body('ownerName') ownerName?: string,
    @Body('shopName') shopName?: string,
    @Body('shopAddress') shopAddress?: string,
    @Body('city') city?: string,
    @Body('shopLocation') shopLocation?: string,
  ) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    if (role === Role.ShopOwner) {
      if (!ownerName || !shopName || !shopAddress || !city || !shopLocation) {
        throw new BadRequestException('All shop owner details are required');
      }
    }
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new BadRequestException('Email already registered');
    }
    const hashed = await this.hashService.hashPassword(password);
    const user = await this.usersService.createUser(
      email,
      hashed,
      role ?? Role.Customer,
      ownerName,
      shopName,
      shopAddress,
      city,
      shopLocation,
    );
    return {
      message: 'Signup successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ownerName: user.ownerName,
        shopName: user.shopName,
        shopAddress: user.shopAddress,
        city: user.city,
        shopLocation: user.shopLocation,
      },
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: ExpressRequest) {
    return this.authService.login(req.user);
  }
}
