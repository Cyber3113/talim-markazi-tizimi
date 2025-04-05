export type UserRole = 'CEO' | 'Mentor' | 'Admin' | 'Student';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  // New fields for mentors
  phone?: string;
  age?: string | number;
  email?: string;
  address?: string;
  password?: string; // Adding password field for creating users
}

export interface Group {
  id: string;
  name: string;
  mentorId: string;
  schedule: string;
  students: Student[];
  price?: number; // Adding price field for groups
}

export interface Student {
  id: string;
  name: string;
  userId?: string;
  attendance: Attendance[];
  scores: Score[];
  // New fields
  address?: string;
  phone?: string;
  parentPhone?: string;
  age?: number;
  groupId?: string;
  coins?: number; // For tracking "tanga"/coins
  rank?: number; // For tracking student ranking
  username?: string; // Add username field
  password?: string; // Add password field for creating users
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
  price?: number; // Adding price field
}

export interface StudentFormData {
  name: string;
  userId?: string;
  address?: string;
  phone?: string;
  parentPhone?: string;
  age?: number;
  groupId?: string;
  username?: string; // Add username field
  password?: string; // Add password field
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
  coins?: number; // For tracking "tanga"/coins
}
