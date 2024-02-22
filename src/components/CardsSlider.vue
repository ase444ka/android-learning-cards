<template>
  <div v-if="props.notes.length === 1">
    <FlippingCard :note="props.notes[0]" />
  </div>
  <div class="swiper" v-else>
    <!-- Additional required wrapper -->
    <div class="swiper-wrapper">
      <!-- Slides -->
      <div class="swiper-slide" v-for="note in props.notes" :key="note.id">
        <FlippingCard :note="note" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, onUpdated} from 'vue';
import FlippingCard from '@/components/FlippingCard.vue';
// import Swiper JS
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';
let swiper;
let isSwiper = false;

const emit = defineEmits(['']);
const props = defineProps(['notes']);

const initSwiper = () => {
  if (isSwiper) {
    swiper.destroy();
    isSwiper = false;
  }
  if (props.notes.length === 1) {
    return;
  }
  swiper = new Swiper('.swiper', {loop: true});
  isSwiper = true
};

onMounted(initSwiper);
onUpdated(initSwiper);
</script>
