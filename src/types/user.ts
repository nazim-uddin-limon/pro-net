export interface CreateUserInput {
  email: string;
  password?: string;
  name: string;
}

export interface UpdateUserInput {
  name?: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  location?: string;
  website?: string;
  openToWork?: boolean;
}

export interface PublicUser {
  id: string;
  name: string;
  headline: string | null;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  website: string | null;
  openToWork: boolean;
  createdAt: Date;
}
