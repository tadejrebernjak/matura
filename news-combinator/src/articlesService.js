import axios from "axios";

const url = "http://localhost:5000/articles";

class ArticlesService {
  //Create User
  static async getAllArticles() {
    try {
      const response = await axios.get(url);
      const data = response.data;

      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default ArticlesService;
