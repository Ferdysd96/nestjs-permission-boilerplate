import { UsersRepository } from '@modules/admin/access/users/users.repository';
import { Injectable, Logger } from '@nestjs/common';
import { UserStatus } from '@admin/access/users/user-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  RefreshTokenExpiredException,
  AccessTokenExpiredException,
  InvalidTokenException,
} from '@common/http/exceptions';
import { ValidateTokenResponseDto, JwtPayload, TokenDto } from '../dtos';
import { TokenError, TokenType } from '../enums';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate Auth token(JWT) service for login user
   * @param JwtPayload {JwtPayload}
   * @returns TokenDto Returns access and refresh tokens with expiry
   */
  public generateAuthToken(payload: JwtPayload): TokenDto {
    const accessTokenExpires = this.configService.get('ACCESS_TOKEN_EXPIRES_IN');
    const refreshTokenExpires = this.configService.get('REFRESH_TOKEN_EXPIRES_IN');
    const tokenType = this.configService.get('TOKEN_TYPE');
    const accessToken = this.generateToken(payload, accessTokenExpires);
    const refreshToken = this.generateToken(payload, refreshTokenExpires);

    return {
      tokenType,
      accessToken,
      accessTokenExpires,
      refreshToken,
    };
  }

  /**
   * Generate Refresh token(JWT) service for generating new refresh and access tokens
   * @param payload {JwtPayload}
   * @returns  Returns access and refresh tokens with expiry or error
   */
  public generateRefreshToken(refreshToken: string): TokenDto {
    const { id, username } = this.verifyToken(refreshToken, TokenType.RefreshToken);
    return this.generateAuthToken({ id, username });
  }

  /**
   * Verify JWT service
   * @param token JWT token
   * @param type {TokenType} "refresh" or "access"
   * @returns decrypted payload from JWT
   */
  public verifyToken(token: string, type: TokenType) {
    try {
      return this.jwtService.verify(token);
    } catch ({ name }) {
      if (name == TokenError.TokenExpiredError && type == TokenType.AccessToken) {
        throw new AccessTokenExpiredException();
      }
      if (name == TokenError.TokenExpiredError && type == TokenType.RefreshToken) {
        throw new RefreshTokenExpiredException();
      }
      throw new InvalidTokenException();
    }
  }

  /**
   * Validate received JWT
   * @param token {string}
   * @returns valid: boolean
   */
  public async validateToken(token: string): Promise<ValidateTokenResponseDto> {
    try {
      const { id } = this.jwtService.verify(token);
      const user = await this.usersRepository.findOne(id);
      if (!user || user.status == UserStatus.Blocked || user.status == UserStatus.Inactive) {
        return { valid: false };
      }

      return { valid: !!id };
    } catch (error) {
      Logger.error('Validation token error', error);
      return { valid: false };
    }
  }

  /**
   * Generate JWT token
   * @private
   * @param payload {JwtPayload}
   * @param expiresIn {string}
   * @returns JWT
   */
  private generateToken(payload: JwtPayload, expiresIn: string): string {
    const token = this.jwtService.sign(payload, { expiresIn });
    return token;
  }
}
