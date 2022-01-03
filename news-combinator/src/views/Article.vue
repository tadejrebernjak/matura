<template>
  <div class="article-preview">
    <div class="mt-5">
      <div class="tag">{{ article.source }}</div>
      <div class="tag">{{ article.category }}</div>
    </div>
    <h1 class="text-3xl py-2 mt-2 font-bold text-white">
      {{ article.title }}
    </h1>
    <p class="border-b border-gray-300 text-gray-300 pb-2">
      {{ article.date }} • {{ article.time }}
    </p>
    <p class="text-lg text-gray-100 py-2">{{ article.summary }}</p>
    <div class="actions">
      <div class="grid items-center">
        <a class="visit-btn" :href="article.url" target="_blank"
          >Obišči članek</a
        >
      </div>
      <div class="details">
        <div class="visits">
          <i class="far fa-hand-pointer details-icon"></i>
          <p class="detail-value">999</p>
        </div>
        <div class="comments">
          <i class="far fa-comment details-icon"></i>
          <p class="detail-value">{{ counters.comments }}</p>
        </div>
        <div class="likes" :class="rating" v-on:click="like">
          <i class="far fa-thumbs-up details-icon"></i>
          <p class="detail-value">{{ counters.likes }}</p>
        </div>
        <div class="dislikes" :class="rating" v-on:click="dislike">
          <i class="far fa-thumbs-down details-icon"></i>
          <p class="detail-value">{{ counters.dislikes }}</p>
        </div>
      </div>
    </div>
  </div>
  <h1 class="mt-10 text-2xl font-bold">Komentarji ({{ counters.comments }})</h1>
  <div class="comments-feed">
    <div class="new-comment-container">
      <div class="flex">
        <img
          src="../assets/default-pfp.jpg"
          alt="Pfp"
          class="inline w-14 h-14 rounded-full mr-3 shadow-md"
        />
        <div class="w-full">
          <h2 class="text-left font-bold text-white text-xl mb-1">Tadej</h2>
          <textarea
            class="new-comment-textarea"
            rows="4"
            placeholder="Napišite komentar o članku!"
            v-model="newComment"
          ></textarea>
        </div>
      </div>
      <button class="new-comment-btn" v-on:click="addComment">
        <i class="fas fa-paper-plane"></i>
        <span> Dodaj</span>
      </button>
    </div>
    <div class="comments-container">
      <div
        class="comment"
        v-for="(comment, index) in article.comments"
        :item="comment"
        :index="index"
        :key="comment.userID"
      >
        <div class="comment-left">
          <img src="../assets/default-pfp.jpg" alt="pfp" />
        </div>
        <div class="comment-right">
          <div class="comment-head">
            <p class="text-lg font-bold text-green-500">
              {{ comment.username }}
            </p>
            <p class="text-sm font-semibold text-gray-500">
              {{
                comment.createdAt.getDate() +
                "." +
                (comment.createdAt.getMonth() + 1) +
                "." +
                comment.createdAt.getFullYear() +
                " ob " +
                comment.createdAt.getHours() +
                ":" +
                comment.createdAt.getMinutes()
              }}
            </p>
          </div>
          <div class="comment-body">
            <p class="comment-text">{{ comment.body }}</p>
          </div>
          <div class="comment-foot">
            <button class="reply-button">
              <i class="fas fa-reply"></i> Odgovori
            </button>
            <div
              class="grid grid-cols-2 space-x-3 text-lg mr-2 font-bold text-gray-600"
            >
              <div
                class="text-center hover:text-gray-500 cursor-pointer transition-all duration-300"
                v-on:click="likeComment(index)"
              >
                <i class="fas fa-thumbs-up text-2xl"></i>
                <p>{{ comment.likes.length }}</p>
              </div>
              <div
                class="text-center hover:text-gray-500 cursor-pointer transition-all duration-300"
                v-on:click="dislikeComment(index)"
              >
                <i class="fas fa-thumbs-down text-2xl"></i>
                <p>{{ comment.dislikes.length }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArticlesService from "../articlesService";

export default {
  name: "Article",
  components: {},
  data() {
    return {
      article: "",
      counters: {
        comments: "",
        likes: "",
        dislikes: "",
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
    addComment() {
      if (this.newComment != "") {
        let comment = {
          userID: "61cb6fccb9878383962a5e75",
          username: "Tadej",
          body: this.newComment.trim(),
          createdAt: new Date(),
          likes: [],
          dislikes: [],
          replies: [],
        };

        this.article.comments.push(comment);
        this.counters.comments = this.article.comments.length;
        console.log(this.counters.comments);
        this.newComment = "";
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

<style scoped>
.tag {
  @apply inline mr-3 p-1 text-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white uppercase rounded-md;
}

.article-preview::before {
  content: "";
  z-index: -1;
  background-image: v-bind(articleImg);
  @apply absolute top-0 left-0 h-full w-full bg-no-repeat bg-center bg-cover rounded-lg;
}

.article-preview {
  background-color: rgba(0, 0, 0, 0.6);
  @apply p-7 relative rounded-lg shadow-2xl;
}

.actions {
  @apply my-5 mt-10 flex justify-between content-center flex-row flex-wrap;
}

.visit-btn {
  @apply text-white text-xl bg-gradient-to-br from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 opacity-95 hover:opacity-100 p-3 rounded-sm;
}

.details {
  @apply grid items-center place-content-center
   grid-cols-4 gap-5 mt-7;
}

@media screen and (max-width: 300px) {
  .details {
    @apply grid-cols-2;
  }
}

.details > div {
  @apply inline text-center mb-1 text-white text-opacity-75 hover:text-gray-300 cursor-pointer transition-all duration-200;
}

.details-icon {
  @apply text-4xl block;
}

.detail-value {
  @apply mt-1 font-bold text-lg;
}

.likes.liked {
  @apply text-lime-400 hover:text-lime-500;
}

.dislikes.disliked {
  @apply text-red-500 hover:text-red-600;
}

.comments-feed {
  @apply my-3 rounded-lg border-2 border-green-500 shadow-2xl overflow-hidden;
}

.new-comment-container {
  @apply p-3 bg-gradient-to-t from-green-400 to-green-500 text-right;
}

.new-comment-textarea {
  @apply w-full p-3 mb-2 border-2 shadow-md border-green-500 bg-white rounded-lg focus:outline-none focus:border-green-600 focus:bg-gray-50;
}

.new-comment-btn {
  @apply p-2 pr-3 font-bold w-28 border-2 shadow-md border-green-500 bg-gray-50 hover:bg-gray-100 rounded-lg text-lg;
}

.comments-container {
  @apply px-3 bg-gradient-to-b bg-gray-50;
}

.comment {
  @apply p-3 my-3 shadow-md border-2 border-gray-200 bg-white rounded-lg flex;
}

.comment-left {
  @apply inline mr-3;
}

.comment-left img {
  @apply w-14 rounded-full shadow-md;
}

.comment-right {
  @apply w-full;
}

.comment-head {
  @apply mb-2 pb-2 border-b border-gray-300;
}

.comment-text {
  white-space: pre-wrap;
}

.comment-foot {
  @apply my-2 flex justify-between;
}

.reply-button {
  @apply p-1 text-green-400 uppercase font-bold hover:text-green-500 transition-all;
}
</style>
