import { getRequestOptions } from "./api";

const BASE_URL = "http://localhost:3000/students";

export const studentService = {
  // GET all students
  getAll: async () => {
    try {
      const response = await fetch(BASE_URL, getRequestOptions("GET"));
      if (!response.ok) throw new Error("Failed to fetch students");
      return await response.json();
    } catch (error) {
      console.error("studentService.getAll error:", error);
      throw error;
    }
  },

  // POST create student
  create: async (studentData) => {
    try {
      const response = await fetch(
        BASE_URL,
        getRequestOptions("POST", studentData)
      );
      if (!response.ok) throw new Error("Failed to save student");
      return await response.json();
    } catch (error) {
      console.error("studentService.create error:", error);
      throw error;
    }
  },

  // DELETE student
  delete: async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/${id}`,
        getRequestOptions("DELETE")
      );
      if (!response.ok) throw new Error("Failed to delete student");
      return await response.json();
    } catch (error) {
      console.error("studentService.delete error:", error);
      throw error;
    }
  },
};