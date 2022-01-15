import axios from "axios";

const url = "http://localhost:5000/users";

class UserService {
  //Create User
  static async insertUser(email, username, password) {
    try {
      const response = await axios.post(url + "/create", {
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

  static async authenticateUser(email, password) {
    try {
      const response = await axios.post(url + "/login", {
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
