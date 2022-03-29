import api from "../service/baseService";

class AdminService {
  static async toggleVisibility(articleID) {
    try {
      await api.post("admin/articles/toggleVisibility/" + articleID);
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteArticle(articleID) {
    try {
      await api.delete("admin/articles/" + articleID);
    } catch (error) {
      console.log(error);
    }
  }

  static async getArticles(category) {
    try {
      let response;

      response = await api.get("admin/articles/find/" + category);
      const data = response.data;

      return data;
    } catch (error) {
      return;
    }
  }

  static async searchArticles(query, category) {
    try {
      const response = await api.get(
        "admin/articles/search/" + query + "/" + category
      );
      const data = response.data;

      return data;
    } catch (error) {
      return;
    }
  }

  static async getUsers() {
    try {
      const response = await api.get("admin/users");
      const data = response.data;

      return data;
    } catch (error) {
      return;
    }
  }

  static async searchUsers(query) {
    try {
      const response = await api.get("admin/users/search/" + query);
      const data = response.data;

      return data;
    } catch (error) {
      return;
    }
  }

  static async deleteUser(userID) {
    try {
      await api.delete("admin/users/" + userID);
    } catch (error) {
      console.log(error);
    }
  }
}

export default AdminService;
