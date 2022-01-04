<template>
  <ArticlePreview
    v-bind:article="article"
    v-bind:counters="counters"
    v-bind:rating="rating"
    v-bind:articleImg="articleImg"
    v-on:like="like"
    v-on:dislike="dislike"
  ></ArticlePreview>
  <CommentsFeed
    v-bind:comments="article.comments"
    v-bind:commentsCount="counters.comments"
    v-on:newComment="addComment"
    v-on:likeComment="likeComment"
    v-on:dislikeComment="dislikeComment"
  ></CommentsFeed>
</template>

<script>
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
      },
      articleImg: "",
      rating: "",
      newComment: "",
      error: "",
    };
  },
  methods: {
    async getArticle(id) {
      try {
        this.article = await ArticlesService.getArticleById(id);
        this.articleImg = "url(" + this.article.image + ")";
        this.counters.comments = this.article.comments.length;
        this.counters.likes = this.article.likes.length;
        this.counters.dislikes = this.article.dislikes.length;
      } catch (error) {
        this.error = error.message;
      }
    },
    like() {
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
    },
    dislike() {
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
  },
  beforeMount() {
    this.getArticle(this.$route.params.id);
  },
};
</script>
