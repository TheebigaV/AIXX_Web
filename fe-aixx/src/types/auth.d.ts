export type User = {
    id: number;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
};

export type LoginFormState = {
    email: string;
    password: string;
};

export type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

export type BannerContent = {
  title1: string;
  title2: string;
  subtitle: string;
  image: string | null; // store image as URL or base64
};
