import { User } from './user.interface';

export interface Audit {
  id: number;
  action: 'create' | 'status_change';
  previous_status: string | null;
  new_status: string;
  comment: string | null;
  request_id: number;
  user_id: number;
  created_at: string;
  user: User;
}
