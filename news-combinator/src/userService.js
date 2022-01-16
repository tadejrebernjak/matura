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

  static async updateUser(email, username, pfpFile, pfpFileName, password) {
    try {
      const response = await api.post("users/create", {
        email,
        username,
        pfpFile,
        pfpFileName,
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
