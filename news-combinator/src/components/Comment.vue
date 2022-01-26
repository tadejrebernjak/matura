<template>
  <div class="comment">
    <div class="comment-left">
      <img :src="comment.user.pfp || defaultPfp" alt="pfp" />
    </div>
    <div class="comment-right">
      <div class="comment-head">
        <div>
          <p class="text-lg font-bold text-green-500">
            {{ comment.user.username }}
          </p>
          <p class="text-sm font-semibold text-gray-500">
            {{ commentCreatedAt }}
          </p>
        </div>
        <div
          v-if="authenticated && user._id === comment.userID"
          class="text-xl cursor-pointer hover:text-gray-600"
          @click="$emit('deleteComment', comment._id)"
        >
          <i class="fas fa-trash-alt"></i>
        </div>
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
import { mapGetters } from "vuex";
let defaultPfp = require("@/assets/default-pfp.jpg");
import CommentReply from "../components/CommentReply";
import moment from "moment";
import "moment/locale/sl";
moment.locale("sl");

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
      commentCreatedAt: this.createdAtString(),
      replying: false,
      newReply: "",
      defaultPfp: defaultPfp,
    };
  },
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
    }),
  },
  emits: ["addReply", "likeReply", "dislikeReply"],
  methods: {
    createdAtString() {
      const time = moment(this.comment.createdAt).fromNow();
      const timeCapitalized = time.charAt(0).toUpperCase() + time.slice(1);

      return timeCapitalized;
    },
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
  @apply p-3 my-3 shadow-md border-2 border-l-8 border-gray-200 bg-white rounded-lg;
}

.comment-left {
  @apply inline mr-3;
}

.comment-left img {
  @apply w-14 rounded-full border border-gray-400;
}

.comment-right {
  @apply w-full;
}

.comment-head {
  @apply mb-2 pb-2 border-b border-gray-300 flex justify-between align-middle;
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
  @apply w-full p-3 mb-2 border-2 border-green-500 bg-white rounded-lg focus:outline-none focus:border-green-600 focus:bg-gray-50;
}

.new-reply-btn {
  @apply p-2 pr-3 font-bold w-28 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 rounded-lg text-lg text-white;
}
</style>
