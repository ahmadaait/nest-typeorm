import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'ramez@gmail.com' })
  @Transform(lowerCaseTransformer)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
