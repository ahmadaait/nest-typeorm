import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import ms from 'ms';
import { AllConfigType } from 'src/config/config.type';
import { Session } from 'src/session/entities/session.entity';
import { ISessionService } from 'src/session/session';
import { User } from 'src/users/entities/user.entity';
import { IUsersService } from 'src/users/users';
import { Services } from 'src/utils/constants';
import { IAuthService } from './auth';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { AuthProvidersEnum } from './enums/auth-providers.enum';
import { LoginResponseType } from './types/login-response.type';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USERS) private readonly usersService: IUsersService,
    @Inject(Services.SESSION) private readonly sessionService: ISessionService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseType> {
    const user = await this.usersService.findOneUser({
      email: loginDto.email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'notFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: `needLoginViaProvider:${user.provider}`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const session = await this.sessionService.create({
      user,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      sessionId: session.id,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }

  private async getTokensData(data: {
    id: User['id'];
    sessionId: Session['id'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow<string>(
      'auth.expires',
      {
        infer: true,
      }
    );

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow<string>('auth.secret', {
            infer: true,
          }),
          expiresIn: tokenExpiresIn,
        }
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow<string>('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow<string>(
            'auth.refreshExpires',
            {
              infer: true,
            }
          ),
        }
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
