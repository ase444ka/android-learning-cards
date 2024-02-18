<template>
  <ion-modal ref="calendar" :trigger="props.trigger">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancel">Cancel</ion-button>
        </ion-buttons>
        <ion-title>Welcome</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" @click="confirm">Confirm</ion-button>
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
</template>

<script setup>
import { ref, computed, watch, watchEffect } from "vue";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonModal,
  IonDatetime,
  IonItem,
} from "@ionic/vue";
const emit = defineEmits(["confirm", "cancel"]);
const props = defineProps(["trigger", "presentedDates"]);

const calendar = ref();
const selectedDate = ref(null);

const checkDate = (date) => {
  const dateObj = new Date(date);
  const dateString = dateObj.toLocaleDateString();
  return props.presentedDates.includes(dateString);
};

const selectDate = (event) => {
  const date = new Date(event.detail.value);
  selectedDate.value = date.toLocaleDateString();
};
const cancel = () => {
  selectDate.value = null;
  calendar.value.$el.dismiss();
  emit("cancel");
};

const confirm = () => {
  calendar.value.$el.dismiss();
  emit("confirm", selectedDate.value);
  selectDate.value = null;
};
</script>
