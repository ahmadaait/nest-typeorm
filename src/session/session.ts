import { User } from 'src/users/entities/user.entity';
import { FindOptions } from 'src/utils/types/find-options.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { DeepPartial } from 'typeorm';
import { Session } from './entities/session.entity';

export interface ISessionService {
  create(data: DeepPartial<Session>): Promise<Session>;
  findOne(options: FindOptions<Session>): Promise<NullableType<Session>>;
  findMany(options: FindOptions<Session>): Promise<Session[]>;
  softDelete({
    excludeId,
    ...criteria
  }: {
    id?: Session['id'];
    user?: Pick<User, 'id'>;
    excludeId?: Session['id'];
  }): Promise<void>;
}
