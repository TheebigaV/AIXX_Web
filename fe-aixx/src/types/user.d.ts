export interface UserTableData {
  id: string;
  name: string;
  email: string;
  role_id: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_id: string;
} 