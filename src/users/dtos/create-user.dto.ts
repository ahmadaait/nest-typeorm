import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { AuthProvidersEnum } from 'src/auth/enums/auth-providers.enum';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string | null;

  @MinLength(6)
  password?: string;

  @IsNotEmpty()
  firstName: string | null;

  @IsNotEmpty()
  lastName: string | null;

  provider?: AuthProvidersEnum;
  status?: UserStatus;
  socialId?: string | null;

  hash?: string | null;
}
