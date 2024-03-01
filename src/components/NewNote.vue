<template>
  <ion-modal ref="modal" trigger="new-note">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancel()">Отмена</ion-button>
        </ion-buttons>
        <ion-title>Welcome</ion-title>
        <ion-buttons slot="end">
          <ion-button :strong="true" @click="confirm()">Подтвердить</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding"> hellooo </ion-content>
  </ion-modal>
  <ion-fab slot="fixed" vertical="bottom" horizontal="center">
    <ion-fab-button id="new-note" v-show="showAddButton">
      <ion-icon :icon="addOutline"></ion-icon>
    </ion-fab-button>
  </ion-fab>
</template>

<script setup>
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/vue';
import {emitter} from '@/mitt';
import {addOutline} from 'ionicons/icons';import {ref, computed, watch, watchEffect} from 'vue';
const emit = defineEmits(['']);
const props = defineProps(['']);

const modal = ref(null)
const showAddButton = ref(true)

emitter.on('flip', () => {showAddButton.value = false})
emitter.on('unflip', () => {showAddButton.value = true})

const cancel = () => modal.value.$el.dismiss();

  const confirm = () => {
    modal.value.$el.dismiss();
  };
</script>

<style lang="css"></style>
