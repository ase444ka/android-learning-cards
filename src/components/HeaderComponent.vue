<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="secondary">
        <ion-button>
          сначала новые
          <ion-icon slot="end" :icon="swapVerticalOutline"></ion-icon>
        </ion-button>
        <ion-button fill="clear" :id="props.calendarOpenerId">
          <ion-icon slot="icon-only" :icon="calendarOutline"></ion-icon>
        </ion-button>
        <ion-button fill="clear" :id="props.tagsOpenerId">
          <ion-icon slot="icon-only" :icon="pricetagsOutline"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title v-if="props.date">{{ props.date }}</ion-title>
      <ion-title v-else-if="props.tag">{{ props.tag }}</ion-title>
      <ion-title v-else>Все карточки</ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script setup>
import {ref, computed, watch, watchEffect} from 'vue';
import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/vue';
import {
  calendarOutline,
  pricetagsOutline,
  swapVerticalOutline,
} from 'ionicons/icons';
const emit = defineEmits(['']);
const props = defineProps(['selectedDate', 'calendarOpenerId', 'tagsOpenerId', 'date', 'tag']);
</script>
