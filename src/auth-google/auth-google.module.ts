import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { Services } from 'src/utils/constants';
import { AuthGoogleController } from './auth-google.controller';
import { AuthGoogleService } from './auth-google.service';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [AuthModule, ConfigModule, PassportModule],
  providers: [
    JwtStrategy,
    GoogleStrategy,
    {
      provide: Services.AUTH_GOOGLE,
      useClass: AuthGoogleService,
    },
  ],
  exports: [
    {
      provide: Services.AUTH_GOOGLE,
      useClass: AuthGoogleService,
    },
  ],
  controllers: [AuthGoogleController],
})
export class AuthGoogleModule {}
