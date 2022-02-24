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

  static async rateComment(articleID, commentID, action) {
    try {
      await api.post(
        "articles/" + articleID + "/comments/" + commentID + "/rate",
        {
          action: action,
        }
      );
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

  static async addReply(articleID, commentID, newReply) {
    try {
      const response = await api.post(
        "articles/" + articleID + "/comments/" + commentID + "/replies",
        {
          reply: newReply,
        }
      );
      return response;
    } catch (error) {
      return error;
    }
  }

  static async editCommentReply(articleID, commentID, replyID, editBody) {
    try {
      const response = await api.put(
        "articles/" +
          articleID +
          "/comments/" +
          commentID +
          "/replies/" +
          replyID,
        {
          newReply: editBody,
        }
      );
      return response;
    } catch (error) {
      return error;
    }
  }

  static async deleteCommentReply(articleID, commentID, replyID) {
    try {
      const response = await api.delete(
        "articles/" +
          articleID +
          "/comments/" +
          commentID +
          "/replies/" +
          replyID
      );
      return response;
    } catch (error) {
      return error;
    }
  }

  static async editComment(articleID, commentID, editBody) {
    try {
      const response = await api.put(
        "articles/" + articleID + "/comments/" + commentID,
        {
          newComment: editBody,
        }
      );
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

  static async rateCommentReply(articleID, commentID, replyID, action) {
    try {
      await api.post(
        "articles/" +
          articleID +
          "/comments/" +
          commentID +
          "/replies/" +
          replyID +
          "/rate",
        {
          action: action,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
}

export default ArticlesService;
