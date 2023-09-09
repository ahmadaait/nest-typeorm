import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthGoogleLoginDto {
  @ApiProperty({ example: '12asa262sa5sa' })
  @IsNotEmpty()
  idToken: string;
}
