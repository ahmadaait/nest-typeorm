import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { IUsersService } from 'src/users/users';
import { Routes, Services } from 'src/utils/constants';
import { NullableType } from 'src/utils/types/nullable.type';
import { IAuthService } from './auth';
import { AuthConfirmEmailDto } from './dtos/auth-confirm-email.dto';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dtos/auth-forgot-password.dto';
import { AuthRegisterDto } from './dtos/auth-register.dto';
import { AuthResetPasswordDto } from './dtos/auth-reset-password.dto';
import { LoginResponseType } from './types/login-response.type';

@ApiTags('Auth')
@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: AuthEmailLoginDto): Promise<LoginResponseType> {
    return this.authService.validateLogin(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async register(@Body() createUserDto: AuthRegisterDto): Promise<void> {
    return await this.authService.registerUser(createUserDto);
  }

  @Post('confirm-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(
    @Body() confirmEmailDto: AuthConfirmEmailDto
  ): Promise<void> {
    return this.authService.confirmEmail(confirmEmailDto.hash);
  }

  @ApiBearerAuth()
  @Get('status')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public status(@Request() request): Promise<NullableType<User>> {
    console.log(request.user);
    return this.authService.status(request.user);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto
  ): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password
    );
  }

  @ApiBearerAuth()
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public refresh(@Request() request): Promise<Omit<LoginResponseType, 'user'>> {
    return this.authService.refreshToken({
      sessionId: request.user.sessionId,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Request() request): Promise<void> {
    await this.authService.logout({
      sessionId: request.user.sessionId,
    });
  }
}
