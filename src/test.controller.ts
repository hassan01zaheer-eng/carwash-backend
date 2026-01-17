import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { Role } from './auth/roles.enum';

@Controller('test')
export class TestController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Get('customer')
  getCustomer(@Request() req: ExpressRequest) {
    return { message: 'Hello Customer', user: req.user };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ShopOwner)
  @Get('owner')
  getOwner(@Request() req: ExpressRequest) {
    return { message: 'Hello Shop Owner', user: req.user };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin')
  getAdmin(@Request() req: ExpressRequest) {
    return { message: 'Hello Admin', user: req.user };
  }
}
