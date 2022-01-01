import axios from "axios";

const url = "http://localhost:5000/articles";

class ArticlesService {
  // Articles list
  static async getAllArticles() {
    try {
      const response = await axios.get(url);
      const data = response.data;

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  // Article details
  static async getArticleById(id) {
    try {
      const response = await axios.get(url + "/" + id);
      const data = response.data;

      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default ArticlesService;
