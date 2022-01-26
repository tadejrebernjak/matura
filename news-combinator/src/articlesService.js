import api from "../service/baseService";

class ArticlesService {
  // Articles list
  static async getAllArticles() {
    try {
      const response = await api.get("articles");
      const data = response.data;

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  // Article details
  static async getArticleById(id) {
    try {
      const response = await api.get("articles/" + id);
      const data = response.data;

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async rateArticle(id, action) {
    try {
      const response = await api.post("articles/" + id + "/rate", {
        action: action,
      });
      return response;
    } catch (error) {
      return error;
    }
  }
}

export default ArticlesService;
