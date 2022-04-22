<template>
  <h1 class="mt-10 text-2xl font-bold" id="commentsFeed">
    Komentarji ({{ commentsCount }})
  </h1>
  <div class="comments-feed">
    <div class="new-comment-container" v-if="authenticated">
      <div v-if="muted">
        <h1 class="text-white text-xl text-center font-bold">
          Vaš račun je blokiran do {{ mutedString }} in ne morate komentirati!
        </h1>
      </div>
      <div v-else class="flex">
        <div class="w-full">
          <h2 class="text-left font-bold text-white text-xl mb-1">
            {{ user.username }}
          </h2>
          <textarea
            class="new-comment-textarea"
            rows="4"
            placeholder="Napišite komentar o članku!"
            v-model="newComment"
          ></textarea>
        </div>
      </div>
      <button v-if="!muted" class="new-comment-btn" @click="addComment">
        <i class="fas fa-paper-plane"></i>
        <span> Dodaj</span>
      </button>
    </div>
    <div v-else class="new-comment-container">
      <h1 class="text-white text-xl text-center font-bold">
        Morate se prijaviti, preden lahko komentirate.
      </h1>
    </div>
    <div class="comments-container">
      <Comment
        v-for="(comment, index) in comments"
        :comment="comment"
        :index="index"
        :key="comment.userID"
        @deleteComment="deleteComment"
        @likeComment="likeComment"
        @dislikeComment="dislikeComment"
        @addReply="addReply"
        @editReply="editReply"
        @deleteReply="deleteReply"
        @editComment="editComment"
        @likeReply="likeReply"
        @dislikeReply="dislikeReply"
      ></Comment>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Comment from "../components/Comment";
import moment from "moment";
import "moment/locale/sl";
moment.locale("sl");

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
    "editComment",
    "deleteComment",
    "likeComment",
    "dislikeComment",
    "addReply",
    "editReply",
    "deleteReply",
    "likeReply",
    "dislikeReply",
  ],
  data: function () {
    return {
      newComment: "",
      mutedString: "",
    };
  },
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
      muted: "auth/muted",
    }),
  },
  methods: {
    addComment() {
      this.$emit("newComment", this.newComment);
      this.newComment = "";
    },
    editComment(editBody, commentID) {
      this.$emit("editComment", editBody, commentID);
    },
    deleteComment(id) {
      this.$emit("deleteComment", id);
    },
    likeComment(commentID) {
      this.$emit("likeComment", commentID);
    },
    dislikeComment(commentID) {
      this.$emit("dislikeComment", commentID);
    },
    addReply(newReply, commentID) {
      this.$emit("addReply", newReply, commentID);
    },
    editReply(replyID, editBody) {
      this.$emit("editReply", replyID, editBody);
    },
    deleteReply(commentID, replyID) {
      this.$emit("deleteReply", commentID, replyID);
    },
    likeReply(replyID) {
      this.$emit("likeReply", replyID);
    },
    dislikeReply(replyID) {
      this.$emit("dislikeReply", replyID);
    },
  },
  beforeMount() {
    if (this.authenticated && this.muted) {
      this.mutedString = moment(this.user.muteExpiration).format("LLL");
    }
  },
};
</script>

<style scoped>
.comments-feed {
  @apply my-3 rounded-lg border-2 border-green-500 shadow-lg overflow-hidden;
}

.new-comment-container {
  @apply p-3 bg-gradient-to-t from-green-400 to-green-500 text-right;
}

.new-comment-textarea {
  @apply w-full p-3 mb-2 border-2 border-green-500 bg-white rounded-lg focus:outline-none focus:border-green-600 focus:bg-gray-50;
}

.new-comment-btn {
  @apply p-2 pr-3 font-bold w-28 border-2 border-green-500 bg-white hover:bg-gray-100 rounded-lg text-lg;
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
