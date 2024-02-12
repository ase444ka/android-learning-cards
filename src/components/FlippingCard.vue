<template>
    <div @click="() => flipped = !flipped" class="flipper">
    
        <Transition name="l">
          <p class="card" v-if="!flipped">
              <h1>{{props.note.about}}</h1>
              </p>
              </Transition>
              <!-- <div v-else>back!</div> -->
        <Transition>
       
          <p class="card" v-if="flipped">
              <CodeBlock
      v-if="props.note.code"
      :code="props.note.code.code"
      :lang="props.note.code.lang"
    />
    <div v-if="imageSrc" :style="sizesStyle">
      <<!-- ion-skeleton-text
        :animated="true"
        :style="{
          width: `${props.note.image.sizeX}px`,
          height: `${props.note.image.sizeY}px`,
        }"
        v-if="imageLoading"
      ></ion-skeleton-text> -->
      <div v-if="imageLoading">loading...</div>

      <img :src="imageSrc" @load="() => (imageLoading = false)" />
    </div>
              </p>
              <!-- <div v-else>back!</div> -->
        </Transition>
      </div>
</template>
<script setup>

import { ref, onMounted, watchEffect  } from 'vue'
import { storage } from "@/firebase.js";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import CodeBlock from "@/components/CodeBlock.vue";



const flipped = ref(false)
const trololo = ref('trololo')
const props = defineProps(["note"]);
const imageSrc = ref(null);
const imageSizeX = ref(0);
const imageSizeY = ref(0);
const imageLoading = ref(false);

watchEffect(async () => {
  if (!props.note.image) return;
  if (document.documentElement.clientWidth < 900) {
    let width = document.documentElement.clientWidth
    let height = document.documentElement.clientHeight
  }
  imageLoading.value = true
  imageSizeX.value = props.note.image.sizeX;
  imageSizeY.value = props.note.image.sizeY;
  let imgRef
  try {
    imgRef = storageRef(storage, props.note.image.path);

  } catch(e) {
    console.log('tororor ', e.message)
  }
  try {
    imageSrc.value = await getDownloadURL(imgRef);
    

    
  } catch(e) {
    console.log('OOPSSS - ',e.message)
  }
  finally {
  imageLoading.value = false

  }
});

</script>
<style lang="css">
.flipper {
    padding: 10px;
    display: grid;
    place-items: center;
    height: 100%;
    width: 50%;
    margin: 0 auto;
}
@media (max-width: 500px) {
  .flipper {
    width: 90%;
  }
  /* … */
}

.card {
    display: block;
    min-width: 300px;
    min-height: 380px;
    padding: 10px;
    background-color: #51aae5;
    opacity: 0.8;
    border-radius: 7px;
    margin: 5px;
    text-align: center;
    line-height: 27px;
    cursor: pointer;
    position: relative;
    color: #fff;
    font-weight: 600;
    font-size: 20px;
    -webkit-box-shadow: 9px 10px 22px -8px rgba(209,193,209,.5);
    -moz-box-shadow: 9px 10px 22px -8px rgba(209,193,209,.5);
    box-shadow: 9px 10px 22px -8px rgba(209,193,209,.5);
    will-change: transform;
    overflow: auto;
  }

/*   .v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
} */

  .v-enter-active {
    transition: all 1s ease;
  }
  
  .v-leave-active {
    display: none;
  }
  
  .v-enter-from, .v-leave-to {
    transform: rotateY(180deg);
    opacity: 0;
  
  }
    .l-enter-active {
    transition: all 1s ease;
  }
  
  .l-leave-active {
    display: none;
  }
  
  .l-enter-from, .l-leave-to {
    transform: rotateY(-180deg);
    opacity: 0;
  
  }
    
</style>