
import { User, LoginFormData, UserRole, Group } from "./types";

// Mock users for demonstration
export const MOCK_USERS = [
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
export const MOCK_GROUPS: Group[] = [
  {
    id: "1",
    name: "English Beginners",
    mentorId: "2", // Sarah Teacher
    schedule: "Mon, Wed 15:00-16:30",
    price: 500000, // Added price (in currency)
    students: [
      {
        id: "101",
        name: "Alex Learner",
        userId: "4",
        address: "123 Student St",
        phone: "+998901234567",
        parentPhone: "+998901234568",
        age: 15,
        groupId: "1",
        coins: 25,
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
        address: "456 Learner Ave",
        phone: "+998902345678",
        parentPhone: "+998902345679",
        age: 16,
        groupId: "1",
        coins: 30,
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
    price: 600000, // Added price
    students: [
      {
        id: "103",
        name: "Jack Math",
        userId: null,
        address: "789 Number Lane",
        phone: "+998903456789",
        parentPhone: "+998903456780",
        age: 17,
        groupId: "2",
        coins: 15,
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
    price: 700000, // Added price
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

// Get all students across all groups
export const getAllStudents = () => {
  return MOCK_GROUPS.flatMap(group => group.students);
};

// Get top students by coins and attendance
export const getTopStudents = (limit = 10) => {
  const allStudents = getAllStudents();
  
  // Calculate student scores based on coins and attendance
  const studentsWithScores = allStudents.map(student => {
    const attendanceRate = student.attendance.length > 0
      ? (student.attendance.filter(a => a.present).length / student.attendance.length) * 100
      : 0;
    
    // Combined score: coins + (attendance percentage * 0.5)
    const combinedScore = (student.coins || 0) + (attendanceRate * 0.5);
    
    return {
      ...student,
      combinedScore,
      attendanceRate
    };
  });
  
  // Sort students by combined score and take top 'limit' students
  const topStudents = studentsWithScores
    .sort((a, b) => b.combinedScore - a.combinedScore)
    .slice(0, limit);
  
  // Add ranks
  return topStudents.map((student, index) => ({
    ...student,
    rank: index + 1
  }));
};
