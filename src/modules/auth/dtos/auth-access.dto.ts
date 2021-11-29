export interface AuthAccessDto {
  additionalPermissions: string[];
  roles: {
    name: string;
    permissions: string[];
  }[];
}
