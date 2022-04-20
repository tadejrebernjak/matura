<template>
  <div class="comment">
    <div class="comment-left">
      <img :src="comment.user.pfp || defaultPfp" alt="pfp" />
    </div>
    <div class="comment-right">
      <div class="comment-head">
        <div>
          <router-link
            v-if="
              user.isAdmin &&
              comment.user._id != user._id &&
              !comment.user.isAdmin
            "
            :to="'/admin/user/' + comment.user._id"
          >
            <p class="text-lg font-bold text-green-500">
              {{ comment.user.username }}
              <span class="text-blue-500" v-if="comment.user.isAdmin"
                >[ADMIN]</span
              >
            </p>
          </router-link>

          <p v-else class="text-lg font-bold text-green-500">
            {{ comment.user.username }}
            <span class="text-blue-500" v-if="comment.user.isAdmin"
              >[ADMIN]</span
            >
          </p>

          <p class="text-sm font-semibold text-gray-500">
            {{ commentCreatedAt }}
            <span v-if="isEdited"> (urejen)</span>
          </p>
        </div>
        <div
          v-if="
            authenticated && (user._id === comment.user._id || user.isAdmin)
          "
          class="text-xl cursor-pointer hover:text-gray-600"
          @click="$emit('deleteComment', comment._id)"
        >
          <i class="fas fa-trash-alt"></i>
        </div>
      </div>
      <div class="comment-body">
        <p class="comment-text">{{ comment.body }}</p>
      </div>
      <div
        class="comment-foot justify-end"
        :class="{
          'justify-between': authenticated,
        }"
      >
        <div
          class="flex items-center justify-center"
          v-if="
            authenticated &&
            user._id !== comment.user._id &&
            (!muted || user.isAdmin)
          "
        >
          <button class="reply-button" @click="newReplyToggle">
            <span v-if="!replying"><i class="fas fa-reply"></i> Odgovori</span>
            <span v-else><i class="fas fa-window-close"></i> Prekliči</span>
          </button>
        </div>

        <div
          class="flex items-center justify-center"
          v-if="
            authenticated &&
            user._id === comment.user._id &&
            (!muted || user.isAdmin)
          "
        >
          <button class="reply-button" @click="editToggle">
            <span v-if="!editing"><i class="fas fa-edit"></i> Uredi</span>
            <span v-else><i class="fas fa-window-close"></i> Prekliči</span>
          </button>
        </div>

        <div
          class="grid grid-cols-2 space-x-3 text-lg mr-2 font-bold text-gray-600"
        >
          <div class="like-button" :class="rating" @click="likeComment">
            <i class="fas fa-thumbs-up text-2xl"></i>
            <p>{{ comment.likes.length }}</p>
          </div>
          <div class="dislike-button" :class="rating" @click="dislikeComment">
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

      <div class="edit" v-if="editing">
        <textarea
          class="edit-text-area"
          v-model="editBody"
          rows="4"
          placeholder="Uredite vaš zgornji komentar"
        ></textarea>
        <button class="edit-btn" @click="editComment">Uredi</button>
      </div>

      <div class="replies">
        <CommentReply
          v-for="(reply, index) in comment.replies"
          :reply="reply"
          :index="index"
          :key="reply.userID"
          @deleteReply="deleteReply"
          @editReply="editReply"
          @likeReply="likeReply"
          @dislikeReply="dislikeReply"
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
      isEdited: this.isEditedCheck(),
      replying: false,
      editing: false,
      rating: "",
      newReply: "",
      editBody: this.comment.body,
      defaultPfp: defaultPfp,
    };
  },
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
      muted: "auth/muted",
    }),
  },
  emits: [
    "addReply",
    "editComment",
    "likeComment",
    "dislikeComment",
    "deleteComment",
    "deleteReply",
    "editReply",
    "likeReply",
    "dislikeReply",
  ],
  updated() {
    this.isEdited = this.isEditedCheck();
  },
  methods: {
    checkRating() {
      if (this.comment.likes.includes(this.user._id)) {
        return "liked";
      } else if (this.comment.dislikes.includes(this.user._id)) {
        return "disliked";
      } else {
        return "";
      }
    },
    createdAtString() {
      const time = moment(this.comment.createdAt).fromNow();
      const timeCapitalized = time.charAt(0).toUpperCase() + time.slice(1);

      return timeCapitalized;
    },
    isEditedCheck() {
      if (this.comment.createdAt !== this.comment.updatedAt) return true;
      else return false;
    },
    newReplyToggle() {
      this.replying = !this.replying;
    },
    editToggle() {
      this.editing = !this.editing;
    },
    editComment() {
      this.$emit("editComment", this.editBody, this.comment._id);
      this.editing = false;
    },
    likeComment() {
      if (this.authenticated) {
        switch (this.rating) {
          case "":
            this.rating = "liked";
            break;
          case "liked":
            this.rating = "";
            break;
          case "disliked":
            this.rating = "liked";
            break;
        }
        this.$emit("likeComment", this.comment._id);
      }
    },
    dislikeComment() {
      if (this.authenticated) {
        switch (this.rating) {
          case "":
            this.rating = "disliked";
            break;
          case "disliked":
            this.rating = "";
            break;
          case "liked":
            this.rating = "disliked";
            break;
        }
        this.$emit("dislikeComment", this.comment._id);
      }
    },
    addReply() {
      if (this.newReply.trim() != "") {
        this.$emit("addReply", this.newReply.trim(), this.comment._id);
      }
      this.replying = !this.replying;
      this.newReply = "";
    },
    editReply(replyID, editBody) {
      this.$emit("editReply", replyID, editBody);
    },
    deleteReply(replyID) {
      this.$emit("deleteReply", this.comment._id, replyID);
    },
    likeReply(replyID) {
      this.$emit("likeReply", replyID);
    },
    dislikeReply(replyID) {
      this.$emit("dislikeReply", replyID);
    },
  },
  mounted() {
    this.rating = this.checkRating();
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
  @apply my-2 flex flex-row;
}

.like-button,
.dislike-button {
  @apply text-center hover:text-gray-500 cursor-pointer transition-all duration-300;
}

.like-button.liked {
  @apply text-green-400 hover:text-green-500;
}

.dislike-button.disliked {
  @apply text-red-500 hover:text-red-600;
}

.reply-button {
  @apply p-1 text-green-400 uppercase font-bold hover:text-green-500 transition-all;
}

.reply-text-area,
.edit-text-area {
  @apply w-full p-3 mb-2 border-2 border-green-500 bg-white rounded-lg focus:outline-none focus:border-green-600 focus:bg-gray-50;
}

.new-reply-btn,
.edit-btn {
  @apply p-2 font-bold w-28 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 rounded-lg text-white;
}
</style>
