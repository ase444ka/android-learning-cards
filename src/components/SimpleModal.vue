<template>
  <ion-modal ref="modal" :trigger="props.trigger">
    <ion-header>
      <ion-toolbar class="ion-text-uppercase">
        <ion-buttons slot="start">
          <ion-button @click="cancel">отмена</ion-button>
        </ion-buttons>
        <ion-title class="ion-text-center">{{ props.title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" @click="confirm" :disabled="!selectedValue"
            >подтвердить</ion-button
          >
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="modal-content">
        <slot></slot>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import {ref} from 'vue';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonModal,
  IonDatetime,
} from '@ionic/vue';

const props = defineProps(['title', 'confirmTitle', 'selectedValue']);
const emit = defineEmits(['confirm', 'cancel']);

const modal = ref();

const cancel = () => {
  modal.value.$el.dismiss();
  emit('cancel');
};

const confirm = () => {
  modal.value.$el.dismiss();
  emit('confirm');
};
</script>

<style lang="css">
.modal-content {
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
}
</style>
