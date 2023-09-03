import { Module } from '@nestjs/common';
import { Service } from './.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [Service, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
