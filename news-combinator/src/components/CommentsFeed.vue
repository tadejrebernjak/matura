<template>
  <h1 class="mt-10 text-2xl font-bold">Komentarji ({{ commentsCount }})</h1>
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
      <button class="new-comment-btn" @click="addComment">
        <i class="fas fa-paper-plane"></i>
        <span> Dodaj</span>
      </button>
    </div>
    <div class="comments-container">
      <Comment
        v-for="(comment, index) in comments"
        :comment="comment"
        :index="index"
        :key="comment.userID"
        @like="likeComment"
        @dislike="dislikeComment"
        @addReply="addReply"
        @likeReply="likeReply"
        @dislikeReply="dislikeReply"
      ></Comment>
    </div>
  </div>
</template>

<script>
import Comment from "../components/Comment";

export default {
  name: "CommentsFeed",
  components: {
    Comment,
  },
  props: {
    comments: Array,
    commentsCount: Number,
  },
  emits: [
    "newComment",
    "likeComment",
    "dislikeComment",
    "addReply",
    "likeReply",
    "dislikeReply",
  ],
  data: function () {
    return {
      newComment: "",
    };
  },
  methods: {
    addComment() {
      this.$emit("newComment", this.newComment);
      this.newComment = "";
    },
    likeComment(i) {
      this.$emit("likeComment", i);
    },
    dislikeComment(i) {
      this.$emit("dislikeComment", i);
    },
    addReply(newReply, i) {
      this.$emit("addReply", newReply, i);
    },
    likeReply(commentIndex, replyIndex) {
      this.$emit("likeReply", commentIndex, replyIndex);
    },
    dislikeReply(commentIndex, replyIndex) {
      this.$emit("dislikeReply", commentIndex, replyIndex);
    },
  },
};
</script>

<style scoped>
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
  @apply p-2 pr-3 font-bold w-28 border-2 shadow-md border-green-500 bg-white hover:bg-gray-100 rounded-lg text-lg;
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
