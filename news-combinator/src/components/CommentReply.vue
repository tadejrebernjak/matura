<template>
  <div class="reply">
    <div class="reply-left">
      <img :src="reply.user.pfp || defaultPfp" alt="pfp" />
    </div>
    <div class="reply-right">
      <div class="reply-head">
        <div>
          <p class="text-lg font-bold text-green-500">
            {{ reply.user.username }}
          </p>
          <p class="text-sm font-semibold text-gray-500">
            {{ replyCreatedAt }}
            <span v-if="isEdited"> (urejen)</span>
          </p>
        </div>
        <div
          v-if="authenticated && user._id === reply.userID"
          class="text-xl cursor-pointer hover:text-gray-600"
          @click="$emit('deleteReply', reply._id)"
        >
          <i class="fas fa-trash-alt"></i>
        </div>
      </div>

      <div class="reply-body">
        <p class="reply-text">{{ reply.body }}</p>
      </div>
      <div
        class="reply-foot justify-end"
        :class="{
          'justify-between': authenticated && user._id === reply.userID,
        }"
      >
        <div
          class="flex items-center justify-center"
          v-if="authenticated && user._id === reply.userID"
        >
          <button class="edit-button" @click="editToggle">
            <span v-if="!editing"><i class="fas fa-edit"></i> Uredi</span>
            <span v-else><i class="fas fa-window-close"></i> Prekliči</span>
          </button>
        </div>

        <div
          class="grid grid-cols-2 space-x-3 text-lg mr-2 font-bold text-gray-600"
        >
          <div class="like-button" :class="rating" @click="likeReply">
            <i class="fas fa-thumbs-up text-2xl"></i>
            <p>{{ reply.likes.length }}</p>
          </div>
          <div class="dislike-button" :class="rating" @click="dislikeReply">
            <i class="fas fa-thumbs-down text-2xl"></i>
            <p>{{ reply.dislikes.length }}</p>
          </div>
        </div>
      </div>
      <div class="edit" v-if="editing">
        <textarea
          class="edit-text-area"
          v-model="editBody"
          rows="4"
          placeholder="Uredite vaš zgornji komentar"
        ></textarea>
        <button class="edit-submit-button" @click="editReply">Uredi</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
let defaultPfp = require("@/assets/default-pfp.jpg");
import moment from "moment";
import "moment/locale/sl";
moment.locale("sl");

export default {
  name: "CommentReply",
  props: {
    reply: Object,
    index: Number,
    key: String,
  },
  data: function () {
    return {
      replyCreatedAt: this.createdAtString(),
      isEdited: this.isEditedCheck(),
      defaultPfp: defaultPfp,
      rating: "",
      editing: false,
      editBody: this.reply.body,
    };
  },
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
    }),
  },
  emits: ["likeReply", "dislikeReply", "editReply", "deleteReply"],
  updated() {
    this.isEdited = this.isEditedCheck();
  },
  methods: {
    checkRating() {
      if (this.reply.likes.includes(this.user._id)) {
        return "liked";
      } else if (this.reply.dislikes.includes(this.user._id)) {
        return "disliked";
      } else {
        return "";
      }
    },
    createdAtString() {
      const time = moment(this.reply.createdAt).fromNow();
      const timeCapitalized = time.charAt(0).toUpperCase() + time.slice(1);

      return timeCapitalized;
    },
    isEditedCheck() {
      if (this.reply.createdAt !== this.reply.updatedAt) return true;
      else return false;
    },
    editToggle() {
      this.editing = !this.editing;
    },
    editReply() {
      this.$emit("editReply", this.reply._id, this.editBody);
      this.editing = false;
    },
    likeReply() {
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
        this.$emit("likeReply", this.reply._id);
      }
    },
    dislikeReply() {
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
        this.$emit("dislikeReply", this.reply._id);
      }
    },
  },
  mounted() {
    this.rating = this.checkRating();
  },
};
</script>

<style scoped>
.reply {
  @apply p-3 my-3 border border-l-8 border-emerald-300 bg-white rounded-md flex;
}

.reply-left {
  @apply inline mr-3;
}

.reply-left img {
  @apply w-14 rounded-full border border-gray-400;
}

.reply-right {
  @apply w-full;
}

.reply-head {
  @apply mb-2 pb-2 border-b border-gray-300 flex justify-between;
}

.reply-text {
  white-space: pre-wrap;
}

.reply-foot {
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

.edit-button {
  @apply p-1 text-green-400 uppercase font-bold hover:text-green-500 transition-all;
}

.edit-text-area {
  @apply w-full p-3 mb-2 border-2 border-green-500 bg-white rounded-lg focus:outline-none focus:border-green-600 focus:bg-gray-50;
}

.edit-submit-button {
  @apply p-2 font-bold w-28 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 rounded-lg text-white;
}
</style>
