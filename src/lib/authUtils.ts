
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
