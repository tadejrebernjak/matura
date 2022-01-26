import api from "../service/baseService";

class ArticlesService {
  // Articles list
  static async getAllArticles() {
    try {
      const response = await api.get("articles");
      const data = response.data;

      return data;
    } catch (error) {
      return;
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
      await api.post("articles/" + id + "/rate", {
        action: action,
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async addComment(id, comment) {
    try {
      const response = await api.post("articles/" + id + "/comments", {
        comment: comment,
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  static async deleteComment(articleID, commentID) {
    try {
      const response = await api.delete(
        "articles/" + articleID + "/comments/" + commentID
      );
      return response;
    } catch (error) {
      return error;
    }
  }
}

export default ArticlesService;
