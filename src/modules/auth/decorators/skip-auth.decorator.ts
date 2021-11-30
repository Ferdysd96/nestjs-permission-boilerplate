import { SetMetadata } from '@nestjs/common';
import { SKIP_AUTH } from '../constants';

export const SkipAuth = () => SetMetadata(SKIP_AUTH, true);
