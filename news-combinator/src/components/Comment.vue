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
          <button class="reply-button" v-on:click="newReplyShow">
            <i class="fas fa-reply"></i> Odgovori
          </button>
        </div>
        <div
          class="grid grid-cols-2 space-x-3 text-lg mr-2 font-bold text-gray-600"
        >
          <div
            class="text-center hover:text-gray-500 cursor-pointer transition-all duration-300"
            v-on:click="$emit('like', index)"
          >
            <i class="fas fa-thumbs-up text-2xl"></i>
            <p>{{ comment.likes.length }}</p>
          </div>
          <div
            class="text-center hover:text-gray-500 cursor-pointer transition-all duration-300"
            v-on:click="$emit('dislike', index)"
          >
            <i class="fas fa-thumbs-down text-2xl"></i>
            <p>{{ comment.dislikes.length }}</p>
          </div>
        </div>
      </div>
      <div class="reply" v-if="replying">
        <textarea name="wawaw" id="" cols="30" rows="10"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Comment",
  props: {
    comment: Object,
    index: Number,
    key: String,
  },
  data: function () {
    return {
      replying: false,
    };
  },
  methods: {
    newReplyShow() {
      this.replying = true;
    },
  },
};
</script>

<style scoped>
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
