<template>
  <ion-page>
    <ion-header class="my-header">
      <ion-toolbar>
        <ion-buttons slot="secondary">
          <ion-button>
            сначала новые
            <ion-icon slot="end" :icon="swapVerticalOutline"></ion-icon>
          </ion-button>
          <ion-button fill="clear" id="open-calendar">
            <ion-icon slot="icon-only" :icon="calendarOutline"></ion-icon>
          </ion-button>
          <ion-button fill="clear">
            <ion-icon slot="icon-only" :icon="pricetagsOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title v-if="selectedDate">{{selectedDate}}</ion-title>
        <ion-title v-else>Все карточки</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-modal
          ref="calendar"
          trigger="open-calendar"
        >
          <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-button @click="cancel()">Cancel</ion-button>
              </ion-buttons>
              <ion-title>Welcome</ion-title>
              <ion-buttons slot="end">
                <ion-button :strong="true" @click="confirm()"
                  >Confirm</ion-button
                >
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <ion-item>
              <ion-datetime
                locale="ru"
                presentation="date"
                :is-date-enabled="checkDate"
                @ionChange="selectDate"
              ></ion-datetime>
            </ion-item>
          </ion-content>
        </ion-modal>

        <div class="skeleton" v-if="loading">
          <ion-skeleton-text :animated="true"></ion-skeleton-text>
        </div>
        <div class="swiper">
          <!-- Additional required wrapper -->
          <div class="swiper-wrapper">
            <!-- Slides -->
            <div class="swiper-slide" v-for="note in filteredNotes" :key="note.id">
              <FlippingCard :note="note" />
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonLoading,
  IonSkeletonText,
  IonModal,
  IonDatetime,
  IonItem,
} from '@ionic/vue';
import {ref, onMounted, defineComponent, computed} from 'vue';
import FlippingCard from '@/components/FlippingCard.vue';
import {
  calendarOutline,
  pricetagsOutline,
  swapVerticalOutline,
} from 'ionicons/icons';
import config from '@/firebase';
import http from '@/http';
import {signIn} from '@/auth';
// import Swiper JS
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';

const notes = ref([]);
const loading = ref(true);
const calendar = ref();
const selectedDate = ref(null);

const presentedDates = computed(() => {
  return notes.value.map((note) => note.day);
});
const checkDate = (date) => {
  const dateObj = new Date(date);
  const dateString = dateObj.toLocaleDateString();
  return presentedDates.value.includes(dateString);
};

const selectDate = (event) => {
  const date = new Date(event.detail.value);
  selectedDate.value = date.toLocaleDateString()
};
const cancel = () => {
  selectDate.value = null
  calendar.value.$el.dismiss();
}

const confirm = () => {
    calendar.value.$el.dismiss();
};

const filteredNotes = computed(() => {
  if (selectedDate.value) {
    return notes.value.filter(note => note.day === selectedDate.value)
  } else {
    return notes.value
  }
})



onMounted(async () => {
  await signIn('istomina.asia@yandex.ru', '777777');
  const receivedNotes = await http.getNotes();

  notes.value = Object.entries(receivedNotes).map((entry) => ({
    id: entry[0],
    ...entry[1],
    day: new Date(entry[1].date).toLocaleDateString()
  }));
  const swiper = new Swiper('.swiper', {});
  loading.value = false;
});
</script>

<style scoped>
.skeleton {
  margin: auto;
  width: 300px;
  height: 300px;
}
@media (max-width: 900px) {
  .my-header {
    opacity: 0;
  }
  .my-header:hover {
    opacity: 1;
  }
}

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
