<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <img src="@/assets/logo.png" alt="Vuetify.js" class="mb-5 logo">
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.logo {
  margin-top: 30px;
  height: 400px;
  animation: latir infinite 5s linear;
}
@keyframes latir {
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.02, 1.02);
  }
  55% {
    transform: scale(0.95, 0.95);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>
