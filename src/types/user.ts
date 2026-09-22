export type UserRole = 'APPLICANT' | 'OFFICER' | 'ADMIN';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation?: string;
  department?: string;
  avatarUrl?: string;
}
