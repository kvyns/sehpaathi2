import { auth } from "../auth/firebase";

const API_BASE_URL = 
  import.meta.env.VITE_ENVIRONMENT === "local" 
    ? "http://localhost:3000/api/files/admin" 
    : `${import.meta.env.VITE_BACKEND_URL}/api/files/admin`;

    console.log(API_BASE_URL)

export const materialService = {
  async uploadFiles(formData) {
    // console.log("Logging FormData service call content:");
    // for (const pair of formData.entries()) {
    // console.log(pair[0], ":", pair[1]);
    // }
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("No user is currently signed in");
      }

      const idToken = await user.getIdToken();

      const googleProvider = user.providerData.find(
        (provider) => provider.providerId === "google.com"
      );

      if (!googleProvider) {
        throw new Error("Please sign in with Google to upload files");
      }

      // Validate that formData contains required fields
      const requiredFields = ["branch", "semester", "subject", "category"];
      for (const field of requiredFields) {
        if (!formData.get(field)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate files are present
      if (!formData.getAll("file").length) {
        throw new Error("No files provided for upload");
      }

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        try {
          const error = await response.json();
          throw new Error(error.message || error.error || "Upload failed");
        } catch (jsonError) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  },

  async listFiles(branch, semester, subject, category) {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("No user is currently signed in");
      }

      const idToken = await user.getIdToken();

      // Build query parameters
      const params = new URLSearchParams();
      if (branch) params.append("branch", branch);
      if (semester) params.append("semester", semester);
      if (subject) params.append("subject", subject);
      if (category) params.append("category", category);

      const response = await fetch(
        `${API_BASE_URL}/files?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || error.error || "Failed to fetch files"
        );
      }
      return await response.json();
    } catch (error) {
      console.error("List error:", error);
      throw error;
    }
  },

   async getFileTree(){
    try {
      const response = await fetch(`${API_BASE_URL}/directory-tree`); 
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching file tree:', error);
      throw error;
    }
  },
};
