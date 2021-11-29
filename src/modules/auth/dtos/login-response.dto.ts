import { UserResponseDto } from '../../admin/access/users/dtos';
import { AuthAccessDto } from './auth-access.dto';
import { TokenDto } from './token.dto';

export class LoginResponseDto {
  token: TokenDto;
  user: UserResponseDto;
  access: AuthAccessDto;
}
