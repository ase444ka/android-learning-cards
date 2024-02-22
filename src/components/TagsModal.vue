<template>
  <SimpleModal
    title="выбор метки"
    :trigger="props.trigger"
    @confirm="confirm"
    @cancel="cancel"
    :selectedValue="selectedTag"
  >
    <ion-buttons>
      <ion-button
        v-for="tag in props.tags"
        :key="props.tag"
        :fill="selectedTag === tag ? 'solid' : 'clear'"
        @click="() => (selectedTag = tag)"
      >
        {{ tag }}
      </ion-button>
    </ion-buttons>
  </SimpleModal>
</template>

<script setup>
import {ref} from 'vue';
import SimpleModal from '@/components/SimpleModal.vue';
import {IonButtons, IonButton} from '@ionic/vue';
const emit = defineEmits(['confirm', 'cancel']);
const props = defineProps(['trigger', 'tags']);

const selectedTag = ref(null);


const cancel = () => {
  emit('cancel');
  selectedTag.value = null
};

const confirm = () => {
  emit('confirm', selectedTag.value);
  selectedTag.value = null
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
