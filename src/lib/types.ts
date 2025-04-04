
export type UserRole = 'CEO' | 'Mentor' | 'Admin' | 'Student';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  mentorId: string;
  schedule: string;
  students: Student[];
}

export interface Student {
  id: string;
  name: string;
  userId?: string;
  attendance: Attendance[];
  scores: Score[];
}

export interface Attendance {
  id: string;
  date: string;
  present: boolean;
  studentId: string;
}

export interface Score {
  id: string;
  date: string;
  value: number;
  studentId: string;
  description?: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (data: LoginFormData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// New interfaces for group management
export interface GroupFormData {
  name: string;
  mentorId: string;
  schedule: string;
}

export interface StudentFormData {
  name: string;
  userId?: string;
}

export interface AttendanceFormData {
  date: string;
  studentIds: Record<string, boolean>; // studentId: present
}

export interface ScoreFormData {
  date: string;
  studentId: string;
  value: number;
  description?: string;
}
