<template>
  <ion-page>
    <HeaderComponent
      :calendarOpenerId="CALENDAR_OPENER_ID"
      :tagsOpenerId="TAGS_OPENER_ID"
      :date="selectedDate"
      :tag="selectedTag"
    />

    <ion-content :fullscreen="true">
      <div id="container">
        <CalendarModal
          :trigger="CALENDAR_OPENER_ID"
          :presentedDates="presentedDates"
          @confirm="
            (payload) => {
              selectedTag = null;
              selectedDate = payload;
            }
          "
        />
        <TagsModal
          :trigger="TAGS_OPENER_ID"
          @confirm="
            (payload) => {
              selectedDate = null;
              selectedTag = payload;
            }
          "
          :tags="tags"
        />

        <div class="skeleton" v-if="loading">
          <ion-skeleton-text :animated="true"></ion-skeleton-text>
        </div>
        <CardsSlider :notes="filteredNotes" :updateKey="updateKey" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {IonContent, IonPage, IonSkeletonText} from '@ionic/vue';
import {ref, onMounted, defineComponent, computed, watchEffect} from 'vue';
import CalendarModal from '@/components/CalendarModal.vue';
import TagsModal from '@/components/TagsModal.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import CardsSlider from '@/components/CardsSlider.vue';
import config from '@/firebase';
import http from '@/http';
import {signIn} from '@/auth';

const notes = ref([]);
const loading = ref(true);
const selectedDate = ref(null);
const selectedTag = ref(null);
const updateKey = ref(1);

const CALENDAR_OPENER_ID = 'calendar_opener';
const TAGS_OPENER_ID = 'tags_opener';

const presentedDates = computed(() => {
  return notes.value.map((note) => note.day);
});

const filteredNotes = computed(() => {
  if (selectedDate.value) {
    return notes.value.filter((note) => note.day === selectedDate.value);
  } else if (selectedTag.value) {
    return notes.value.filter((note) => note.tag === selectedTag.value);
  } else {
    return notes.value;
  }
});

const tags = computed(() => {
  return new Set(notes.value.map((note) => note.tag));
});

onMounted(async () => {
  await signIn('istomina.asia@yandex.ru', '777777');
  const receivedNotes = await http.getNotes();

  notes.value = Object.entries(receivedNotes).map((entry) => ({
    id: entry[0],
    ...entry[1],
    day: new Date(entry[1].date).toLocaleDateString(),
  }));

  loading.value = false;
});

watchEffect(() => {
  updateKey.value = filteredNotes.value.length;
});
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
