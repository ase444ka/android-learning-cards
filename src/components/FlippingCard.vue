<template>
  <div @click="handleClick" class="flipper" ref="card">
    <Transition name="l">
      <div class="card" v-if="!flipped">
        <h1>{{ props.note.about }}</h1>
      </div>
    </Transition>

    <Transition>
      <div class="card flipped" v-if="flipped">
        <CodeBlock
          v-if="props.note.code"
          :code="props.note.code.code"
          :lang="props.note.code.lang"
        />

        <div v-if="imageSrc">
          <div class="skeleton" :style="imageSizes" v-if="imageLoading">
            <ion-skeleton-text :animated="true"></ion-skeleton-text>
          </div>

                <img :src="imageSrc" @load="imageLoading = false" @click="showFull = true" />
        </div>

        <div v-if="props.note.text">
          {{ props.note.text }}
        </div>
      </div>
    </Transition>
    <FullImage :src="imageSrc" v-if="showFull" @back="showFull = false"/>
  </div>
</template>
<script setup>


import {ref, watchEffect, computed} from 'vue';
import {storage} from '@/firebase.js';
import {ref as storageRef, getDownloadURL} from 'firebase/storage';
import CodeBlock from '@/components/CodeBlock.vue';
import FullImage from '@/components/FullImage.vue'
import {IonSkeletonText} from '@ionic/vue';
import {emitter} from '@/mitt.js';

const card = ref(null);
const showFull = ref(false)

emitter.on('slideChange', () => {
  if (!flipped.value) return;
  flipped.value = false;
});

const flipped = ref(false);
const trololo = ref('trololo');
const props = defineProps(['note']);

const imageSrc = ref(null);
const imageLoading = ref(true);

const imageSizes = computed(() => {
  return {
    width: `${props.note.image.sizeX}px`,
    height: `${props.note.image.sizeY}px`,
  };
});



const handleClick = () => {
  if (flipped.value && imageSrc.value) {
    return;
  } else {
    flipped.value = !flipped.value;
  }
};

watchEffect(async () => {
  if (!flipped.value || !imageLoading.value || !props.note.image) {
    return;
  }
  let imgRef;
  try {
    imgRef = storageRef(storage, props.note.image.path);
  } catch (e) {
    console.log('errorr ', e.message);
  }
  try {
    imageSrc.value = await getDownloadURL(imgRef);
  } catch (e) {
    console.log('OOPSSS - ', e.message);
  }
});

watchEffect(() => {
  if (flipped.value) {
    emitter.emit('flip');
  } else {
    emitter.emit('unflip');
  }
});
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
  -webkit-box-shadow: 9px 10px 22px -8px rgba(209, 193, 209, 0.5);
  -moz-box-shadow: 9px 10px 22px -8px rgba(209, 193, 209, 0.5);
  box-shadow: 9px 10px 22px -8px rgba(209, 193, 209, 0.5);
  will-change: transform;
  overflow: auto;
}
.card.flipped {
  text-align: start;
}
@media (max-width: 900px) {
  .card {
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

.v-enter-from,
.v-leave-to {
  transform: rotateY(180deg);
  opacity: 0;
}
.l-enter-active {
  transition: all 1s ease;
}

.l-leave-active {
  display: none;
}

.l-enter-from,
.l-leave-to {
  transform: rotateY(-180deg);
  opacity: 0;
}
</style>
