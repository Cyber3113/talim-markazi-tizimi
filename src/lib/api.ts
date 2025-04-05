
import { User, Group, Student, LoginFormData, UserRole, Attendance, Score } from "./types";

// Base API URL - replace with actual backend URL
const API_BASE_URL = "https://itbrain-training-center.herokuapp.com/api"; // or your actual deployment URL

// Helper function for API requests
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  // Get token from localStorage if available
  const token = localStorage.getItem("eduToken");
  
  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...options.headers,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      // Handle different error statuses
      if (response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("eduToken");
        localStorage.removeItem("eduUser");
        window.location.href = "/";
      }
      
      // Try to get error message from response
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.status}`);
    }
    
    // Check if response is empty
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Auth endpoints
export const apiLogin = async (data: LoginFormData) => {
  const response = await fetchApi("/auth/login/", {
    method: "POST",
    body: JSON.stringify(data),
  });
  
  if (response.token) {
    localStorage.setItem("eduToken", response.token);
  }
  
  return response;
};

export const apiLogout = async () => {
  await fetchApi("/auth/logout/", { method: "POST" });
  localStorage.removeItem("eduToken");
  localStorage.removeItem("eduUser");
};

export const apiGetCurrentUser = async (): Promise<User | null> => {
  try {
    const userData = await fetchApi("/auth/user/");
    return userData;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
};

// Groups endpoints
export const apiGetGroups = async (): Promise<Group[]> => {
  return await fetchApi("/groups/");
};

export const apiGetGroupById = async (id: string): Promise<Group> => {
  return await fetchApi(`/groups/${id}/`);
};

export const apiCreateGroup = async (data: Partial<Group>): Promise<Group> => {
  return await fetchApi("/groups/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const apiUpdateGroup = async (id: string, data: Partial<Group>): Promise<Group> => {
  return await fetchApi(`/groups/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const apiDeleteGroup = async (id: string): Promise<void> => {
  await fetchApi(`/groups/${id}/`, { method: "DELETE" });
};

// Students endpoints
export const apiGetStudents = async (): Promise<Student[]> => {
  return await fetchApi("/students/");
};

export const apiGetStudentById = async (id: string): Promise<Student> => {
  return await fetchApi(`/students/${id}/`);
};

export const apiCreateStudent = async (data: Partial<Student>): Promise<Student> => {
  return await fetchApi("/students/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const apiUpdateStudent = async (id: string, data: Partial<Student>): Promise<Student> => {
  return await fetchApi(`/students/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const apiDeleteStudent = async (id: string): Promise<void> => {
  await fetchApi(`/students/${id}/`, { method: "DELETE" });
};

// Attendance endpoints
export const apiGetAttendance = async (studentId?: string, groupId?: string): Promise<Attendance[]> => {
  let endpoint = "/attendance/";
  const params = new URLSearchParams();
  
  if (studentId) params.append("student_id", studentId);
  if (groupId) params.append("group_id", groupId);
  
  const queryString = params.toString();
  if (queryString) endpoint += `?${queryString}`;
  
  return await fetchApi(endpoint);
};

export const apiRecordAttendance = async (data: { 
  date: string;
  student_id: string;
  present: boolean;
}): Promise<Attendance> => {
  return await fetchApi("/attendance/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const apiUpdateAttendance = async (id: string, data: Partial<Attendance>): Promise<Attendance> => {
  return await fetchApi(`/attendance/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Scores and Coins endpoints
export const apiGetScores = async (studentId?: string): Promise<Score[]> => {
  let endpoint = "/scores/";
  if (studentId) endpoint += `?student_id=${studentId}`;
  
  return await fetchApi(endpoint);
};

export const apiAddScore = async (data: {
  student_id: string;
  value: number;
  date: string;
  description?: string;
  coins?: number;
}): Promise<Score> => {
  return await fetchApi("/scores/", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Top students
export const apiGetTopStudents = async (limit = 10): Promise<Student[]> => {
  return await fetchApi(`/students/top/?limit=${limit}`);
};

// Mentor endpoints
export const apiGetMentors = async (): Promise<User[]> => {
  return await fetchApi("/users/?role=Mentor");
};

export const apiGetMentorById = async (id: string): Promise<User> => {
  return await fetchApi(`/users/${id}/`);
};

export const apiCreateMentor = async (data: Partial<User>): Promise<User> => {
  const userData = {
    ...data,
    role: "Mentor" as UserRole
  };
  
  return await fetchApi("/users/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const apiUpdateMentor = async (id: string, data: Partial<User>): Promise<User> => {
  return await fetchApi(`/users/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const apiDeleteMentor = async (id: string): Promise<void> => {
  await fetchApi(`/users/${id}/`, { method: "DELETE" });
};
