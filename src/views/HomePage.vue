<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
      <div class="swiper">
  <!-- Additional required wrapper -->
  <div class="swiper-wrapper">
    <!-- Slides -->
    <div class="swiper-slide"  v-for="note in notes" :key="note.id" >
      <FlippingCard :note="note" />
    
    </div>

  </div>


</div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {ref, onMounted} from 'vue';
import FlippingCard from "@/components/FlippingCard.vue";
import config from "@/firebase";
import http from "@/http";
import { signIn } from "@/auth";
// import Swiper JS
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';

const notes = ref([]);

onMounted(async () => {
  await signIn("istomina.asia@yandex.ru", "777777");
  const receivedNotes = await http.getNotes();

  notes.value = Object.entries(receivedNotes)
    .map((entry) => ({
      id: entry[0],
      ...entry[1],
    }))
    const swiper = new Swiper('.swiper', {



});
console.log(swiper)
}

);
</script>

<style scoped>
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
