import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from 'src/mailer/mailer.module';
import { Services } from 'src/utils/constants';
import { MailsService } from './mails.service';

@Module({
  imports: [ConfigModule, MailerModule],
  providers: [
    {
      provide: Services.MAILS,
      useClass: MailsService,
    },
  ],
  exports: [
    {
      provide: Services.MAILS,
      useClass: MailsService,
    },
  ],
})
export class MailsModule {}
