<template>
  <ArticlePreview
    :article="article"
    :counters="counters"
    :rating="rating"
    :articleImg="articleImg"
    @visit="visit"
    @like="like"
    @dislike="dislike"
  ></ArticlePreview>
  <CommentsFeed
    :comments="article.comments"
    :commentsCount="counters.comments"
    @newComment="addComment"
    @editComment="editComment"
    @deleteComment="deleteComment"
    @likeComment="likeComment"
    @dislikeComment="dislikeComment"
    @addReply="addReply"
    @editReply="editReply"
    @deleteReply="deleteReply"
    @likeReply="likeReply"
    @dislikeReply="dislikeReply"
  ></CommentsFeed>
</template>

<script>
import { mapGetters } from "vuex";
import ArticlesService from "../articlesService";
import ArticlePreview from "../components/ArticlePreview";
import CommentsFeed from "../components/CommentsFeed";
import router from "../router";

export default {
  name: "Article",
  components: {
    ArticlePreview,
    CommentsFeed,
  },
  data() {
    return {
      article: "",
      comments: null,
      counters: {
        comments: 0,
        likes: 0,
        dislikes: 0,
        clicks: 0,
      },
      articleImg: "",
      rating: "",
      newComment: "",
      error: "",
    };
  },
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
    }),
  },
  methods: {
    async getArticle(id) {
      try {
        this.article = await ArticlesService.getArticleById(id);
        this.articleImg = "url(" + this.article.image + ")";
        this.counters.comments = this.article.comments.length;
        this.counters.likes = this.article.likes.length;
        this.counters.dislikes = this.article.dislikes.length;
        this.counters.clicks = this.article.clicks.length;

        if (this.article.likes.includes(this.user._id)) {
          this.rating = "liked";
        } else if (this.article.dislikes.includes(this.user._id)) {
          this.rating = "disliked";
        } else {
          this.rating = "";
        }
      } catch (error) {
        this.error = error.message;
      }
    },
    async visit() {
      if (this.authenticated && !this.article.clicks.includes(this.user._id)) {
        try {
          await ArticlesService.visitArticle(this.article._id);
          this.counters.clicks++;
        } catch (error) {
          console.log(error);
        }
      }
    },
    async like() {
      if (this.authenticated) {
        switch (this.rating) {
          case "":
            this.rating = "liked";
            this.counters.likes++;
            break;
          case "liked":
            this.rating = "";
            this.counters.likes--;
            break;
          case "disliked":
            this.rating = "liked";
            this.counters.dislikes--;
            this.counters.likes++;
            break;
        }
        await ArticlesService.rateArticle(this.article._id, "like");
      } else {
        router.push("/login");
      }
    },
    async dislike() {
      if (this.authenticated) {
        switch (this.rating) {
          case "":
            this.rating = "disliked";
            this.counters.dislikes++;
            break;
          case "disliked":
            this.rating = "";
            this.counters.dislikes--;
            break;
          case "liked":
            this.rating = "disliked";
            this.counters.dislikes++;
            this.counters.likes--;
            break;
        }
        await ArticlesService.rateArticle(this.article._id, "dislike");
      } else {
        router.push("/login");
      }
    },

    async addComment(newComment) {
      newComment = newComment.trim();
      if (newComment != "") {
        try {
          const response = await ArticlesService.addComment(
            this.article._id,
            newComment
          );
          console.log(response);
          this.getArticle(this.$route.params.id);
        } catch (error) {
          console.log(error);
        }
      }
    },

    async editComment(editBody, commentID) {
      editBody = editBody.trim();
      if (editBody != "") {
        try {
          const response = await ArticlesService.editComment(
            this.article._id,
            commentID,
            editBody
          );
          console.log(response);
          this.getArticle(this.$route.params.id);
        } catch (error) {
          console.log(error);
        }
      }
    },

    async deleteComment(commentID) {
      try {
        const response = await ArticlesService.deleteComment(
          this.article._id,
          commentID
        );
        console.log(response);
        this.getArticle(this.$route.params.id);
      } catch (error) {
        console.log(error);
      }
    },
    async likeComment(commentID) {
      try {
        await ArticlesService.rateComment(this.article._id, commentID, "like");
        this.getArticle(this.$route.params.id);
      } catch (error) {
        console.log(error);
      }
    },
    async dislikeComment(commentID) {
      try {
        await ArticlesService.rateComment(
          this.article._id,
          commentID,
          "dislike"
        );
        this.getArticle(this.$route.params.id);
      } catch (error) {
        console.log(error);
      }
    },
    async addReply(newReply, commentID) {
      try {
        const response = await ArticlesService.addReply(
          this.article._id,
          commentID,
          newReply
        );
        console.log(response);
        this.getArticle(this.$route.params.id);
      } catch (error) {
        console.log(error);
      }
    },

    async editReply(replyID, commentID, editBody) {
      try {
        const response = await ArticlesService.editCommentReply(
          this.article._id,
          replyID,
          commentID,
          editBody
        );
        console.log(response);
        this.getArticle(this.$route.params.id);
      } catch (error) {
        console.log(error);
      }
    },

    async deleteReply(commentID, replyID) {
      try {
        const response = await ArticlesService.deleteCommentReply(
          this.article._id,
          commentID,
          replyID
        );
        console.log(response);
        this.getArticle(this.$route.params.id);
      } catch (error) {
        console.log(error);
      }
    },
    async likeReply(commentID, replyID) {
      try {
        await ArticlesService.rateCommentReply(
          this.article._id,
          commentID,
          replyID,
          "like"
        );
        this.getArticle(this.$route.params.id);
      } catch (error) {
        console.log(error);
      }
    },
    async dislikeReply(commentID, replyID) {
      try {
        await ArticlesService.rateCommentReply(
          this.article._id,
          commentID,
          replyID,
          "dislike"
        );
        this.getArticle(this.$route.params.id);
      } catch (error) {
        console.log(error);
      }
    },
  },
  beforeMount() {
    this.getArticle(this.$route.params.id);
  },
};
</script>
