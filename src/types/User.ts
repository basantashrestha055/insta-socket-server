export interface SessionUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  profilepic?: string;
  bio: string;
  accountType: 'public' | 'private';
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  signupMethod: 'google' | 'credentials';
  followers: string[];
  following: string[];
  createdAt: Date;
  updatedAt: Date;
}
