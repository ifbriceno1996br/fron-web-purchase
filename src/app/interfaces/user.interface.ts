export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  role_ids: number[] | null;
  roles: Role[];
}
