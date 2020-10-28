<template>
  <div class="home">
    <gp-player/>
  </div>
</template>

<script>
// @ is an alias to /src
import GpPlayer from '@/components/GpPlayer'

export default {
  name: 'Home',
  components: {
    GpPlayer
  },
  mounted() {
      let token = localStorage.getItem("gitpage_token");
      if (token == null || token == "null") {
        token = prompt("github token");
        localStorage.setItem("gitpage_token", "Bearer " + token);
        console.log(token);
      }
  }
}
</script>
