import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from 'src/utils/types/find-options.type';
import { DeepPartial, Repository } from 'typeorm';
import { ForgotPassword } from './entities/forgot-password.entity';
import { IForgotPasswordService } from './forgot-password';

@Injectable()
export class ForgotPasswordService implements IForgotPasswordService {
  constructor(
    @InjectRepository(ForgotPassword)
    private readonly forgotPasswordRepository: Repository<ForgotPassword>
  ) {}

  async create(data: DeepPartial<ForgotPassword>): Promise<ForgotPassword> {
    const forgotPasswordReq = this.forgotPasswordRepository.create(data);
    return this.forgotPasswordRepository.save(forgotPasswordReq);
  }

  findOne(options: FindOptions<ForgotPassword>): Promise<ForgotPassword> {
    return this.forgotPasswordRepository.findOne({
      where: options.where,
    });
  }

  async softDelete(id: ForgotPassword['id']): Promise<void> {
    await this.forgotPasswordRepository.softDelete(id);
  }
}
