export interface TokenDto {
  tokenType: string;
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
}
