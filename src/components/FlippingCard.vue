<template>
    <div @click="() => flipped = !flipped" class="flipper" ref="card">
        <Transition name="l">
          <p class="card" v-if="!flipped">
            <h1>{{props.note.about}}</h1>
          </p>
        </Transition>

        <Transition>
          <p class="card" v-if="flipped">
            <CodeBlock
              v-if="props.note.code"
              :code="props.note.code.code"
              :lang="props.note.code.lang"
            />

            <div v-if="imageSrc">
              <div class="skeleton" :style="imageSizes" v-if="imageLoading">
                <ion-skeleton-text :animated="true"></ion-skeleton-text>
              </div>
              <img :src="imageSrc" @load="() => (imageLoading = false)" />
            </div>

            <div v-if="props.note.text">
              {{props.note.text}}
            </div>
          </p>
        </Transition>
      </div>
</template>
<script setup>

import { ref,  watchEffect, computed  } from 'vue'
import { storage } from "@/firebase.js";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import CodeBlock from "@/components/CodeBlock.vue";
import {IonSkeletonText} from '@ionic/vue'
import {emitter} from '@/mitt.js'

const card = ref(null)

emitter.on('slideChange', () => {

  if (!flipped.value) return
  flipped.value = false
})



const flipped = ref(false)
const trololo = ref('trololo')
const props = defineProps(["note"]);

const imageSrc = ref(null);
const imageLoading=ref(true)

const imageSizes = computed(() => {
  return {
            width: `${props.note.image.sizeX}px`,
            height: `${props.note.image.sizeY}px`,
          }
})



watchEffect(async() => {
  if (!flipped.value || !imageLoading.value || !props.note.image) {
    return
  }
  let imgRef
  try {
    imgRef = storageRef(storage, props.note.image.path);

  } catch(e) {
    console.log('errorr ', e.message)
  }
  try {
    imageSrc.value = await getDownloadURL(imgRef);
    

    
  } catch(e) {
    console.log('OOPSSS - ',e.message)
  }
 
});

watchEffect(() => {
  if (flipped.value) {
    emitter.emit('flip')
  } else {
    emitter.emit('unflip')
  }
})

</script>
<style lang="css" scoped>

.flipper {
    padding: 10px;
    display: grid;
    place-items: center;
    align-items: start;
    height: 100%;
    min-width: 50%;
    margin: 0 auto;
    overflow: auto;
}
@media (max-width: 900px) {
  .flipper {
    width: 90%;
  }
}
.card {
    display: block;
    min-width: 300px;
    min-height: 300px;
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
  @media (max-width: 900px) {
  .card {
    height: 97vh;
    margin-top: 70px;
  }
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