import api from "../service/baseService";

class UserService {
  //Create User
  static async insertUser(email, username, password) {
    try {
      const response = await api.post("users/create", {
        email,
        username,
        password,
      });
      return response;
    } catch (error) {
      if (error.response.status === 400) {
        return "Račun s to E-Pošto že obstaja";
      } else {
        return "Napaka v strežniku";
      }
    }
  }

  static async updateUser(email, username, password) {
    try {
      const response = await api.put("users/update", {
        email,
        username,
        password,
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async uploadPfp(file, filename) {
    const formData = new FormData();
    formData.append("file", file, filename);

    try {
      const response = await api.post("users/pfp", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }

  static async authenticateUser(email, password) {
    try {
      const response = await api.post("users/login", {
        email,
        password,
      });
      return response;
    } catch (error) {
      return error.response;
    }
  }
}

export default UserService;
