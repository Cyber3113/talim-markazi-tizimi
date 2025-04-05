
import { 
  User, 
  Group, 
  Student, 
  Attendance, 
  Score,
  UserRole
} from "./types";

import {
  apiGetGroups,
  apiGetGroupById,
  apiGetStudents,
  apiGetStudentById,
  apiGetMentors,
  apiGetTopStudents,
  apiGetAttendance,
  apiGetScores
} from "./api";

// Service layer that wraps API calls but maintains compatibility with existing codebase

// Users & Authentication
export const getUsers = async (role?: UserRole): Promise<User[]> => {
  if (role === 'Mentor') {
    return await apiGetMentors();
  }
  
  // For other roles, you would need a corresponding API endpoint
  throw new Error("API endpoint not implemented for this role");
};

// Groups
export const getGroupsByMentorId = async (mentorId: string): Promise<Group[]> => {
  const allGroups = await apiGetGroups();
  return allGroups.filter(group => group.mentorId === mentorId);
};

export const getGroupById = async (groupId: string): Promise<Group | null> => {
  try {
    return await apiGetGroupById(groupId);
  } catch (error) {
    console.error("Failed to get group by ID:", error);
    return null;
  }
};

// Students
export const getStudentById = async (studentId: string): Promise<Student | null> => {
  try {
    return await apiGetStudentById(studentId);
  } catch (error) {
    console.error("Failed to get student by ID:", error);
    return null;
  }
};

export const getStudentByUserId = async (userId: string): Promise<Student | null> => {
  try {
    const allStudents = await apiGetStudents();
    return allStudents.find(student => student.userId === userId) || null;
  } catch (error) {
    console.error("Failed to get student by user ID:", error);
    return null;
  }
};

export const getAllStudents = async (): Promise<Student[]> => {
  return await apiGetStudents();
};

// Attendance & Scores
export const getStudentAttendance = async (studentId: string): Promise<Attendance[]> => {
  return await apiGetAttendance(studentId);
};

export const getStudentScores = async (studentId: string): Promise<Score[]> => {
  return await apiGetScores(studentId);
};

// Top students
export const getTopStudents = async (limit = 10): Promise<Student[]> => {
  try {
    const topStudents = await apiGetTopStudents(limit);
    // Add rank property to each student
    return topStudents.map((student, index) => ({
      ...student,
      rank: index + 1
    }));
  } catch (error) {
    console.error("Failed to get top students:", error);
    return [];
  }
};

// Compatibility functions to ensure the app works while transitioning to API
// These can be removed once all components are updated to use the API directly

export const hasPermission = (role: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    'CEO': 4,
    'Admin': 3,
    'Mentor': 2,
    'Student': 1
  };
  
  return roleHierarchy[role] >= roleHierarchy[requiredRole];
};
