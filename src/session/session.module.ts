import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],

  providers: [
    {
      provide: Services.SESSION,
      useClass: SessionService,
    },
  ],
  exports: [
    {
      provide: Services.SESSION,
      useClass: SessionService,
    },
  ],
})
export class SessionModule {}
