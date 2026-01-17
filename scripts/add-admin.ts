import { UsersService } from '../src/users/users.service';
import { HashService } from '../src/auth/hash.service';
import { Role } from '../src/auth/roles.enum';

// This script assumes you have a way to get an instance of UsersService and HashService
// For a real app, you would run this in a NestJS context or as a migration/seed script

async function addAdmin() {
  const usersService = new UsersService();
  const hashService = new HashService();
  const email = 'admin2@example.com';
  const password = 'adminpass';
  const hashed = await hashService.hashPassword(password);
  const admin = await usersService.createUser(email, hashed, Role.Admin);
  console.log('Admin created:', admin);
}

addAdmin().catch(console.error);
