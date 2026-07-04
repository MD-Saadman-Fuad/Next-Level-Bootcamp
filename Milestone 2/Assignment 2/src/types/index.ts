export type TUserRole = 'contributor' | 'maintainer';

export interface TUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: TUserRole;
  created_at: Date;
  updated_at: Date;
}

export type TIssueType = 'bug' | 'feature_request';
export type TIssueStatus = 'open' | 'in_progress' | 'resolved';

export interface TIssue {
  id: number;
  title: string;
  description: string;
  type: TIssueType;
  status: TIssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}
