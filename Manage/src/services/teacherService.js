import { getRequestOptions } from "./api";

const BASE_URL = "http://localhost:3000/teachers";

export const teacherService = {
  // GET all teachers
  getAll: async () => {
    try {
      const response = await fetch(BASE_URL, getRequestOptions("GET"));
      if (!response.ok) throw new Error("Failed to fetch teachers");
      return await response.json();
    } catch (error) {
      console.error("teacherService.getAll error:", error);
      throw error;
    }
  },

  // POST create teacher
  create: async (teacherData) => {
    try {
      const response = await fetch(
        BASE_URL,
        getRequestOptions("POST", teacherData)
      );
      if (!response.ok) throw new Error("Failed to save teacher");
      return await response.json();
    } catch (error) {
      console.error("teacherService.create error:", error);
      throw error;
    }
  },

  // PUT update teacher
  update: async (id, teacherData) => {
    try {
      const response = await fetch(
        `${BASE_URL}/${id}`,
        getRequestOptions("PUT", teacherData)
      );
      if (!response.ok) throw new Error("Failed to update teacher");
      return await response.json();
    } catch (error) {
      console.error("teacherService.update error:", error);
      throw error;
    }
  },

  // DELETE teacher
  delete: async (id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/${id}`,
        getRequestOptions("DELETE")
      );
      if (!response.ok) throw new Error("Failed to delete teacher");
      return await response.json();
    } catch (error) {
      console.error("teacherService.delete error:", error);
      throw error;
    }
  },
};