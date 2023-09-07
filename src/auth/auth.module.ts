import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ForgotPasswordModule } from 'src/forgot-password/forgot-password.module';
import { MailsModule } from 'src/mails/mails.module';
import { SessionModule } from 'src/session/session.module';
import { UsersModule } from 'src/users/users.module';
import { Services } from 'src/utils/constants';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    SessionModule,
    MailsModule,
    PassportModule,
    ForgotPasswordModule,
    JwtModule.register({}),
  ],

  controllers: [AuthController],
  providers: [
    IsExist,
    IsNotExist,
    JwtRefreshStrategy,
    JwtStrategy,
    AnonymousStrategy,
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
  ],
  exports: [
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
