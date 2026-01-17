import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Role } from '../auth/roles.enum';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      email: 'customer@example.com',
      password: '$2b$10$YkNYgoLDYyuX2Gzddyhz7eHMV/c30vPUrqyXDFVdG6G4S/11/BMEu',
      role: Role.Customer,
    },
    {
      id: 2,
      email: 'owner@example.com',
      password: '$2b$10$YkNYgoLDYyuX2Gzddyhz7eHMV/c30vPUrqyXDFVdG6G4S/11/BMEu',
      role: Role.ShopOwner,
    },
    {
      id: 3,
      email: 'admin@example.com',
      password: '$2b$10$YkNYgoLDYyuX2Gzddyhz7eHMV/c30vPUrqyXDFVdG6G4S/11/BMEu',
      role: Role.Admin,
    },
  ];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async createUser(
    email: string,
    password: string,
    role: Role = Role.Customer,
    ownerName?: string,
    shopName?: string,
    shopAddress?: string,
    city?: string,
    shopLocation?: string,
  ): Promise<User> {
    const id = this.users.length + 1;
    const user: User = {
      id,
      email,
      password,
      role,
      ownerName,
      shopName,
      shopAddress,
      city,
      shopLocation,
    };
    this.users.push(user);
    return user;
  }
}
