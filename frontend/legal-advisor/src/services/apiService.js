// MODULES //
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; 

const apiService = {
  // Upload Document (PDF)
  uploadDocument: async (file, category) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const response = await axios.post(
        `${API_BASE_URL}/upload-doc`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error uploading document:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get All Documents
  getAllDocuments: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-docs`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching documents:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get Documents by Category
  getDocumentsByCategory: async (category) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-docs/${category}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching documents by category:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default apiService;
