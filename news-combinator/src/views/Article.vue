<template>
  <ArticlePreview
    :article="article"
    :counters="counters"
    :rating="rating"
    :articleImg="articleImg"
    @like="like"
    @dislike="dislike"
  ></ArticlePreview>
  <CommentsFeed
    :comments="article.comments"
    :commentsCount="counters.comments"
    @newComment="addComment"
    @likeComment="likeComment"
    @dislikeComment="dislikeComment"
    @addReply="addReply"
    @likeReply="likeReply"
    @dislikeReply="dislikeReply"
  ></CommentsFeed>
</template>

<script>
import { mapGetters } from "vuex";
import ArticlesService from "../articlesService";
import ArticlePreview from "../components/ArticlePreview";
import CommentsFeed from "../components/CommentsFeed";

export default {
  name: "Article",
  components: {
    ArticlePreview,
    CommentsFeed,
  },
  data() {
    return {
      article: "",
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
    async like() {
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
      const response = await ArticlesService.rateArticle(
        this.article._id,
        "like"
      );
      console.log(response);
    },
    async dislike() {
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
      const response = await ArticlesService.rateArticle(
        this.article._id,
        "dislike"
      );
      console.log(response);
    },
    addComment(newComment) {
      if (newComment != "") {
        let comment = {
          userID: "61cb6fccb9878383962a5e75",
          username: "Tadej",
          body: newComment.trim(),
          createdAt: new Date(),
          likes: [],
          dislikes: [],
          replies: [],
        };

        this.article.comments.push(comment);
        this.counters.comments = this.article.comments.length;
      }
    },
    addZero(time) {
      if (time < 10) {
        time = "0" + time;
      }
    },
    likeComment(i) {
      this.article.comments[i].likes.push(1);
    },
    dislikeComment(i) {
      this.article.comments[i].dislikes.push(1);
    },
    addReply(newReply, i) {
      let reply = {
        userID: "61cb6fccb9878383962a5e75",
        username: "Tadej",
        body: newReply.trim(),
        createdAt: new Date(),
        likes: [],
        dislikes: [],
      };
      this.article.comments[i].replies.push(reply);
      console.log(this.article.comments[i].replies);
    },
    likeReply(commentIndex, replyIndex) {
      this.article.comments[commentIndex].replies[replyIndex].likes.push(1);
    },
    dislikeReply(commentIndex, replyIndex) {
      this.article.comments[commentIndex].replies[replyIndex].dislikes.push(1);
    },
  },
  beforeMount() {
    this.getArticle(this.$route.params.id);
  },
};
</script>
