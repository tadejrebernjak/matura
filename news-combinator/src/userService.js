import axios from "axios";

const url = "http://localhost:5000/users";

class UserService {
  //Create User
  static async insertUser(email, username, password) {
    try {
      return axios.post(url + "/create", {
        email,
        username,
        password,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default UserService;
