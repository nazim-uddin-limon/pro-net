export interface User {
  id: string;
  email: string;
  passwordHash: string | null;
  name: string;
  headline: string | null;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  location: string | null;
  website: string | null;
  openToWork: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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

export const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  name: user.name,
  headline: user.headline,
  bio: user.bio,
  avatarUrl: user.avatarUrl,
  location: user.location,
  website: user.website,
  openToWork: user.openToWork,
  createdAt: user.createdAt,
});
