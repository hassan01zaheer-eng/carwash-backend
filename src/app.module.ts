
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestController } from './test.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { HashService } from './auth/hash.service';
import { RolesGuard } from './auth/roles.guard';
import { LocalStrategy } from './auth/local.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'sql7.freesqldatabase.com',
      port: 3306,
      username: 'sql7815105',
      password: 'Gve2bgWc9e',
      database: 'sql7815105',
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
    }),
  ],
  controllers: [AppController, TestController, AuthController],
  providers: [
    AppService,
    AuthService,
    HashService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AppModule {}
