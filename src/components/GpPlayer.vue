<template>
  <div class="gp-player">
    <aplayer :music="music" :list="list" :showLrc="true" :fixed="true" class="aplayer"/>
  </div>
</template>

<script>
import Aplayer from "vue-aplayer";
import $fetch from "@/util/fetch.js"

export default {
  name: 'GpPlayer',
  components: {
      Aplayer
  },
  data() {
    return {
      music: {},
      list: []
    }
  },
  
  methods: {
    async getMusic() {
      const resp = await $fetch({url: "https://api.github.com/repos/yepplus/gitpage-test-media/contents/music"});
      resp.data.filter((musicFolder) => {
          return musicFolder.name.indexOf(".info") > -1;
        }).forEach(async (musicFolder) => {
          const resp = await $fetch({url: "https://api.github.com/repos/yepplus/gitpage-test-media/contents/music/" + musicFolder.name});
          let metadata = {};
          let src = "";
          let musicProp = {};
          await resp.data.forEach(async music => {
            if (music.name === "metadata.json") {
                const resp = await $fetch({url: "https://api.github.com/repos/yepplus/gitpage-test-media/contents/music/" + musicFolder.name + "/metadata.json"});
                metadata = JSON.parse(Buffer.from(resp.data.content, "base64").toString("utf-8"));
                musicProp = metadata;
                musicProp.src = src;
                this.list.push(musicProp);
                this.music = this.list[0];
            } else {
                src = music.download_url;
            }
          });
        });
    }
  },
  created() {
    this.getMusic();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.aplayer {
  width: 500px;
}
</style>
