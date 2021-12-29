<template>
  <div
    class="form max-w-md mx-auto mt-10 p-10 border bg-gray-50 border-gray-400 shadow-lg rounded-md"
  >
    <div class="form-control">
      <label for="email">E-Pošta</label>
      <input
        class=""
        type="email"
        id="email"
        v-model="email"
        placeholder="primer@mail.com"
      />
    </div>
    <div class="form-control">
      <label for="username">Uporabniško Ime</label>
      <input class="" type="text" id="username" v-model="text" />
    </div>
    <div class="form-control">
      <label for="password">Geslo</label>
      <input class="" type="password" id="password" v-model="password" />
    </div>
    <div class="form-control">
      <label for="password-repeat">Ponovitev gesla</label>
      <input class="" type="password" id="password-repeat" v-model="password" />
    </div>
    <div class="form-control text-center">
      <button
        class="p-2 mx-2 w-36 rounded-sm bg-green-400 hover:bg-green-500 text-lg hover:text-white transition duration-300"
      >
        Registriraj
      </button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Register",
  components: {},
};
</script>

<style scoped>
label {
  display: block;
}

input {
  width: 100%;
  @apply my-1 p-2 border border-gray-300;
}

.form-control {
  @apply my-4;
}
</style>
