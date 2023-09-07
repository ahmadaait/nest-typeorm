import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class AuthForgotPasswordDto {
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;
}
