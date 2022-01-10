<template>
  <div class="comment">
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
        <div class="flex items-center justify-center">
          <button class="reply-button" @click="newReplyToggle">
            <span v-if="!replying"><i class="fas fa-reply"></i> Odgovori</span>
            <span v-else><i class="fas fa-window-close"></i> Skrij</span>
          </button>
        </div>
        <div
          class="grid grid-cols-2 space-x-3 text-lg mr-2 font-bold text-gray-600"
        >
          <div
            class="text-center hover:text-gray-500 cursor-pointer transition-all duration-300"
            @click="$emit('like', index)"
          >
            <i class="fas fa-thumbs-up text-2xl"></i>
            <p>{{ comment.likes.length }}</p>
          </div>
          <div
            class="text-center hover:text-gray-500 cursor-pointer transition-all duration-300"
            @click="$emit('dislike', index)"
          >
            <i class="fas fa-thumbs-down text-2xl"></i>
            <p>{{ comment.dislikes.length }}</p>
          </div>
        </div>
      </div>
      <div class="reply" v-if="replying">
        <textarea
          class="reply-text-area"
          v-model="newReply"
          rows="4"
          placeholder="Napišite odgovor zgornjem komentarju!"
        ></textarea>
        <button class="new-reply-btn" @click="addReply">Odgovori</button>
      </div>
      <div class="replies">
        <CommentReply
          v-for="(reply, index) in comment.replies"
          :reply="reply"
          :index="index"
          :key="reply.userID"
          @like="likeReply"
          @dislike="dislikeReply"
        ></CommentReply>
      </div>
    </div>
  </div>
</template>

<script>
import CommentReply from "../components/CommentReply";

export default {
  name: "Comment",
  components: {
    CommentReply,
  },
  props: {
    comment: Object,
    index: Number,
    key: String,
  },
  data: function () {
    return {
      replying: false,
      newReply: "",
    };
  },
  emits: ["addReply", "likeReply", "dislikeReply"],
  methods: {
    newReplyToggle() {
      this.replying = !this.replying;
    },
    addReply() {
      if (this.newReply.trim() != "") {
        this.$emit("addReply", this.newReply, this.index);
      }
      this.replying = !this.replying;
      this.newReply = "";
    },
    likeReply(i) {
      this.$emit("likeReply", this.index, i);
    },
    dislikeReply(i) {
      this.$emit("dislikeReply", this.index, i);
    },
  },
};
</script>

<style scoped>
.comment {
  @apply p-3 my-3 shadow-md border-2 border-gray-200 bg-white rounded-lg;
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

.reply-text-area {
  @apply w-full p-3 mb-2 border-2 shadow-md border-green-500 bg-white rounded-lg focus:outline-none focus:border-green-600 focus:bg-gray-50;
}

.new-reply-btn {
  @apply p-2 pr-3 font-bold w-28 shadow-md bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg text-lg text-white;
}
</style>
