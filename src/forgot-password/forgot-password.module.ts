import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { ForgotPassword } from './entities/forgot-password.entity';
import { ForgotPasswordService } from './forgot-password.service';

@Module({
  imports: [TypeOrmModule.forFeature([ForgotPassword])],
  providers: [
    {
      provide: Services.FORGOT_PASSWORD,
      useClass: ForgotPasswordService,
    },
  ],
  exports: [
    {
      provide: Services.FORGOT_PASSWORD,
      useClass: ForgotPasswordService,
    },
  ],
})
export class ForgotPasswordModule {}
