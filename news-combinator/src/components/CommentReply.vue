<template>
  <div class="reply">
    <div class="reply-left">
      <img src="../assets/default-pfp.jpg" alt="pfp" />
    </div>
    <div class="reply-right">
      <div class="reply-head">
        <p class="text-lg font-bold text-green-500">
          {{ reply.username }}
        </p>
        <p class="text-sm font-semibold text-gray-500">
          {{
            reply.createdAt.getDate() +
            "." +
            (reply.createdAt.getMonth() + 1) +
            "." +
            reply.createdAt.getFullYear() +
            " ob " +
            reply.createdAt.getHours() +
            ":" +
            reply.createdAt.getMinutes()
          }}
        </p>
      </div>
      <div class="reply-body">
        <p class="reply-text">{{ reply.body }}</p>
      </div>
      <div class="reply-foot">
        <div
          class="grid grid-cols-2 space-x-3 text-lg mr-2 font-bold text-gray-600"
        >
          <div
            class="text-center hover:text-gray-500 cursor-pointer transition-all duration-300"
            @click="$emit('like', index)"
          >
            <i class="fas fa-thumbs-up text-2xl"></i>
            <p>{{ reply.likes.length }}</p>
          </div>
          <div
            class="text-center hover:text-gray-500 cursor-pointer transition-all duration-300"
            @click="$emit('dislike', index)"
          >
            <i class="fas fa-thumbs-down text-2xl"></i>
            <p>{{ reply.dislikes.length }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CommentReply",
  props: {
    reply: Object,
    index: Number,
    key: String,
  },
  emits: ["like", "dislike"],
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
  @apply w-14 rounded-full shadow-md;
}

.reply-right {
  @apply w-full;
}

.reply-head {
  @apply mb-2 pb-2 border-b border-gray-300;
}

.reply-text {
  white-space: pre-wrap;
}

.reply-foot {
  @apply my-2 flex flex-row;
}
</style>
