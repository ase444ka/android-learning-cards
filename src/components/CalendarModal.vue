<template>
  <SimpleModal
    title="выбор даты"
    :trigger="props.trigger"
    @confirm="confirm"
    @cancel="cancel"
    :selectedValue="selectedDate"
  >
    <ion-datetime
      locale="ru"
      presentation="date"
      :is-date-enabled="checkDate"
      @ionChange="selectDate"
    ></ion-datetime>
  </SimpleModal>
</template>

<script setup>
import {ref, computed, watch, watchEffect} from 'vue';
import SimpleModal from '@/components/SimpleModal.vue';
import {IonDatetime} from '@ionic/vue';
const emit = defineEmits(['confirm', 'cancel']);
const props = defineProps(['trigger', 'presentedDates']);

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
  selectedDate.value = null;
  emit('cancel');
};

const confirm = () => {
  emit('confirm', selectedDate.value);
  selectedDate.value = null;
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
