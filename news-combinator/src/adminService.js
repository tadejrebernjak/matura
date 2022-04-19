import api from "../service/baseService";

class AdminService {
  static async toggleVisibility(articleID) {
    try {
      await api.post("admin/articles/toggleVisibility/" + articleID);
    } catch (error) {
      return error;
    }
  }

  static async deleteArticle(articleID) {
    try {
      await api.delete("admin/articles/" + articleID);
    } catch (error) {
      return error;
    }
  }

  static async getArticles(category) {
    try {
      let response;

      response = await api.get("admin/articles/find/" + category);
      const data = response.data;

      return data;
    } catch (error) {
      return error;
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
      return error;
    }
  }

  static async getUsers() {
    try {
      const response = await api.get("admin/users");
      const data = response.data;

      return data;
    } catch (error) {
      return error;
    }
  }

  static async getUser(id) {
    try {
      const response = await api.get("admin/user/" + id);
      const data = response.data;

      return data;
    } catch (error) {
      return error;
    }
  }

  static async searchUsers(query) {
    try {
      const response = await api.get("admin/users/search/" + query);
      const data = response.data;

      return data;
    } catch (error) {
      return error;
    }
  }

  static async deleteUser(userID) {
    try {
      const response = await api.delete("admin/users/" + userID);
      return response;
    } catch (error) {
      return error;
    }
  }

  static async updateUser(user) {
    try {
      const response = await api.put("/admin/user", { user: user });
      return response;
    } catch (error) {
      return error;
    }
  }

  static async removePfp(userID) {
    try {
      const response = await api.delete("admin/user/pfp/" + userID);
      return response;
    } catch (error) {
      return error;
    }
  }

  static async muteUser(userID, muteDays) {
    try {
      const response = await api.post("admin/user/mute", {
        userID: userID,
        muteDays: muteDays,
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  static async unmuteUser(userID) {
    try {
      const response = await api.post("admin/user/unmute", {
        userID: userID,
      });
      return response;
    } catch (error) {
      return error;
    }
  }
}

export default AdminService;
