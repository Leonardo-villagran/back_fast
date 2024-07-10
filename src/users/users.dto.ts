export class UserDTO {
  id: number;
  email: string;
  name: string;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;
  role: RoleDTO;
}

export class RoleDTO {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
