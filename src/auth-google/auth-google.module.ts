import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { Services } from 'src/utils/constants';
import { AuthGoogleController } from './auth-google.controller';
import { AuthGoogleService } from './auth-google.service';

@Module({
  imports: [AuthModule, ConfigModule],
  providers: [
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
