export interface IUser {
  id: string;
  full_name: string | null;
  email: string | null;
  gender: boolean | null;
  phone: string;
  identity_card: string | null;
  is_public?: boolean | null;
  date_of_birth: string;
  relatives?: IRelative[] | null;
  password?: string,
  address: string | null;
  is_active?: boolean;
  is_completed: boolean;
  created_at?: string
}


export interface ICreateUser {
  full_name: string; 
  identity_card: string; 
  phone: string; 
  email?: string; 
  password: string; 
  gender: boolean; 
  date_of_birth: string; 
  address?: string;
  relatives?: IRelative[]; 
  is_active?: boolean;
  is_public?: boolean; 
  is_completed?: boolean;
}

export interface IFilterUser {
  name?: string;
  email?: string;
  gender?: boolean;
  phone?: string;
  identity_card?: string;
  date_of_birth?: string | null;
  address?: string;
}

export interface IListUser {
  limit? : number,
  offset?: number,
  filters?: IFilterUser 
}

export interface IRelative {
  full_name: string;
  phone: string;
  relationship: string;
}
