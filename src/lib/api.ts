
import { User, Group, Student, LoginFormData, UserRole, Attendance, Score } from "./types";

// Base API URL - replace with actual backend URL
const API_BASE_URL = "https://itbrain-training-center.herokuapp.com/api"; // or your actual deployment URL

// Helper function for API requests
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  // Get token from localStorage if available
  const token = localStorage.getItem("eduAccessToken");
  
  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
        // Token expired - try to refresh the token
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          // Retry the request with the new token
          return fetchApi(endpoint, options);
        } else {
          // Refresh failed - logout
          localStorage.removeItem("eduAccessToken");
          localStorage.removeItem("eduRefreshToken");
          window.location.href = "/";
        }
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

// Function to refresh the access token
const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem("eduRefreshToken");
  if (!refreshToken) return false;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    if (data.access) {
      localStorage.setItem("eduAccessToken", data.access);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return false;
  }
};

// Auth endpoints
export const apiLogin = async (data: LoginFormData) => {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Login Error: ${response.status}`);
  }
  
  const responseData = await response.json();
  
  if (responseData.access && responseData.refresh) {
    localStorage.setItem("eduAccessToken", responseData.access);
    localStorage.setItem("eduRefreshToken", responseData.refresh);
    return {
      token: responseData.access,
      user: responseData.user,
    };
  }
  
  throw new Error("Invalid response from login API");
};

export const apiLogout = async () => {
  try {
    await fetchApi("/auth/logout/", { method: "POST" });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("eduAccessToken");
    localStorage.removeItem("eduRefreshToken");
  }
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
