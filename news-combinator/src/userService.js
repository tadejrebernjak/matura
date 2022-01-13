import axios from "axios";

const url = "http://localhost:5000/users";

class UserService {
  //Create User
  static async insertUser(email, username, password) {
    try {
      return await axios.post(url + "/create", {
        email,
        username,
        password,
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async authenticateUser(email, password) {
    try {
      const response = await axios.post(url + "/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response.status === 400) {
        return "Nepravilna E-Pošta ali geslo";
      } else {
        return "Internal Server Error";
      }
    }
  }
}

export default UserService;
