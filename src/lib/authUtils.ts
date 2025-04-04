
import { User, LoginFormData, UserRole } from "./types";

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: "1",
    username: "ceo",
    password: "ceo123",
    role: "CEO" as UserRole,
    name: "John Director"
  },
  {
    id: "2",
    username: "mentor",
    password: "mentor123",
    role: "Mentor" as UserRole,
    name: "Sarah Teacher"
  },
  {
    id: "3",
    username: "admin",
    password: "admin123",
    role: "Admin" as UserRole,
    name: "Mike Manager"
  },
  {
    id: "4",
    username: "student",
    password: "student123",
    role: "Student" as UserRole,
    name: "Alex Learner"
  }
];

// Simulate API call with a delay
export const loginUser = async (data: LoginFormData): Promise<User | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = MOCK_USERS.find(
    user => user.username === data.username && user.password === data.password
  );
  
  if (user) {
    // Remove password before returning user data
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
  
  return null;
};

// Check if user has specific permission
export const hasPermission = (role: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    'CEO': 4,
    'Admin': 3,
    'Mentor': 2,
    'Student': 1
  };
  
  return roleHierarchy[role] >= roleHierarchy[requiredRole];
};

// Mock data for groups
export const MOCK_GROUPS = [
  {
    id: "1",
    name: "English Beginners",
    mentorId: "2", // Sarah Teacher
    schedule: "Mon, Wed 15:00-16:30",
    students: [
      {
        id: "101",
        name: "Alex Learner",
        userId: "4",
        attendance: [
          { id: "a1", date: "2025-04-01", present: true, studentId: "101" },
          { id: "a2", date: "2025-04-03", present: false, studentId: "101" }
        ],
        scores: [
          { id: "s1", date: "2025-04-01", value: 85, studentId: "101", description: "Vocabulary test" }
        ]
      },
      {
        id: "102",
        name: "Emma Student",
        userId: null,
        attendance: [
          { id: "a3", date: "2025-04-01", present: true, studentId: "102" },
          { id: "a4", date: "2025-04-03", present: true, studentId: "102" }
        ],
        scores: [
          { id: "s2", date: "2025-04-01", value: 92, studentId: "102", description: "Vocabulary test" }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Math Advanced",
    mentorId: "2", // Sarah Teacher
    schedule: "Tue, Thu 17:00-18:30",
    students: [
      {
        id: "103",
        name: "Jack Math",
        userId: null,
        attendance: [
          { id: "a5", date: "2025-04-02", present: true, studentId: "103" },
          { id: "a6", date: "2025-04-04", present: true, studentId: "103" }
        ],
        scores: [
          { id: "s3", date: "2025-04-02", value: 88, studentId: "103", description: "Algebra quiz" }
        ]
      }
    ]
  },
  {
    id: "3",
    name: "Programming Basics",
    mentorId: "5", // Another mentor
    schedule: "Mon, Fri 16:00-17:30",
    students: []
  }
];

// Utility functions for data management
export const getGroupsByMentorId = (mentorId: string) => {
  return MOCK_GROUPS.filter(group => group.mentorId === mentorId);
};

export const getGroupById = (groupId: string) => {
  return MOCK_GROUPS.find(group => group.id === groupId);
};

export const getStudentById = (studentId: string) => {
  for (const group of MOCK_GROUPS) {
    const student = group.students.find(student => student.id === studentId);
    if (student) return student;
  }
  return null;
};

export const getStudentByUserId = (userId: string) => {
  for (const group of MOCK_GROUPS) {
    const student = group.students.find(student => student.userId === userId);
    if (student) return student;
  }
  return null;
};
