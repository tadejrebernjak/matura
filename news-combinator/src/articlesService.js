import api from "../service/baseService";

class ArticlesService {
  // Articles list
  static async getArticles(category) {
    try {
      let response;

      response = await api.get("articles/find/" + category);
      const data = response.data;

      return data;
    } catch (error) {
      return;
    }
  }

  // Articles that the user visited
  static async getReadArticles() {
    try {
      const response = await api.get("articles/read");
      const data = response.data;

      return data;
    } catch (error) {
      return;
    }
  }

  // Search articles from search bar query
  static async searchArticles(query, category) {
    try {
      const response = await api.get(
        "articles/search/" + query + "/" + category
      );
      const data = response.data;

      return data;
    } catch (error) {
      return;
    }
  }

  // Articles from the current day
  static async getTodayArticles() {
    try {
      const response = await api.get("articles/today");
      const data = response.data;

      return data;
    } catch (error) {
      return;
    }
  }

  // Articles that the user liked
  static async getLikedArticles() {
    try {
      const response = await api.get("articles/liked");
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

  static async visitArticle(id) {
    try {
      await api.post("articles/" + id + "/visit");
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

  static async rateComment(commentID, action) {
    try {
      await api.post("articles/comment/" + commentID + "/rate", {
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

  static async addReply(commentID, newReply) {
    try {
      const response = await api.post(
        "articles/comments/" + commentID + "/replies",
        {
          reply: newReply,
        }
      );
      return response;
    } catch (error) {
      return error;
    }
  }

  static async editCommentReply(replyID, editBody) {
    try {
      const response = await api.put("articles/replies/" + replyID, {
        newReply: editBody,
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  static async deleteCommentReply(commentID, replyID) {
    try {
      const response = await api.delete(
        "articles/comments/" + commentID + "/replies/" + replyID
      );
      return response;
    } catch (error) {
      return error;
    }
  }

  static async editComment(commentID, editBody) {
    try {
      const response = await api.put("articles/comment/" + commentID, {
        newComment: editBody,
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

  static async rateCommentReply(replyID, action) {
    try {
      await api.post("articles/replies/" + replyID + "/rate", {
        action: action,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default ArticlesService;
