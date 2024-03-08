<template>
  <Teleport to="body">
    <ion-button @click="$emit('back')" class="back-icon">
      <ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon>
    </ion-button>
    <div class="full-image">
      <!-- zoomist-container -->
      <div class="zoomist-container">
        <!-- zoomist-wrapper is required -->
        <div class="zoomist-wrapper">
          <!-- zoomist-image is required -->
          <!-- you can add anything you want to zoom here. -->
          <div class="zoomist-image">
            <img :src="props.src" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import {IonButton, IonIcon} from '@ionic/vue';
import {chevronBackOutline} from 'ionicons/icons';
import {onMounted} from 'vue';
const emit = defineEmits(['back']);
const props = defineProps(['src']);
// import Zoomist styles
import 'zoomist/css';
// import Zoomist
import Zoomist from 'zoomist';

const initImage = () => {
  // initialize
  const zoomist = new Zoomist('.zoomist-container', {
    // Optional parameters
    maxScale: 8,
  });
};

onMounted(initImage);
</script>

<style lang="css">
.full-image {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}

.zoomist-container {
  height: 100%;
}
.zoomist-wrapper {
  display: grid;
  place-items: center;
}

.back-icon {
  z-index: 2000;
  position: fixed;
  left: 20px;
  top: 20px;
}
</style>
