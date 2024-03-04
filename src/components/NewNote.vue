<template>
  <ion-modal ref="modal" trigger="new-note">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons>
          <ion-button @click="cancel()" fill="clear">
            <ion-icon slot="icon-only" :icon="chevronBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="sendNote" :disabled="saveButtonDisabled">
            <ion-spinner name="dots" v-if="sending"></ion-spinner>
            <span v-else>Сохранить</span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="flex">
        <select class="custom-select" v-model="selected">
          <option value="js">JS</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
          <option value="text">text</option>
          <option value="image">image</option>
        </select>
        <ion-button
          @click="currentTag = tag"
          :fill="currentTag === tag ? 'solid' : 'outline'"
          v-for="tag in props.tags"
          :key="tag"
          color="dark"
        >
          #{{ tag }}
        </ion-button>
        <IonButton
          @click="addNewTag"
          :fill="addingTag ? 'solid' : 'outline'"
          color="dark"
        >
          +
        </IonButton>
        <ion-input
          placeholder="#"
          v-maskito="tagOptions"
          color="dark"
          v-if="addingTag"
          fill="outline"
          style="width: 100px"
          v-model="newTag"
        ></ion-input>
      </div>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-input
              placeholder="я узнала про..."
              fill="outline"
              v-model="about"
              clear-input
            ></ion-input>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-textarea
              v-if="selected === 'image'"
              placeholder="..."
              fill="outline"
              auto-grow
              @click.prevent="chooseImage"
            ></ion-textarea>
            <ion-textarea
              v-else
              placeholder="..."
              fill="outline"
              auto-grow
              v-model="text"
            ></ion-textarea>
            <div>{{ test }}</div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
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
  IonFab,
  IonFabButton,
  IonIcon,
  IonInput,
  IonRow,
  IonCol,
  IonGrid,
  IonTextarea,
  IonLoading,
} from '@ionic/vue';
import {emitter} from '@/mitt';
import {addOutline, chevronBackOutline, cog} from 'ionicons/icons';
import {ref, computed, watchEffect} from 'vue';
import {maskito as vMaskito} from '@maskito/vue';
import http from '@/http';
import {Camera, CameraResultType} from '@capacitor/camera';

const emit = defineEmits(['send']);
const props = defineProps(['tags']);

const modal = ref(null);
const showAddButton = ref(true);
const selected = ref('js');
const currentTag = ref(null);
const addingTag = ref(false);
const newTag = ref(null);
const about = ref('');
const text = ref('');
const sending = ref(false);
const test = ref('test')

emitter.on('flip', () => {
  showAddButton.value = false;
});
emitter.on('unflip', () => {
  showAddButton.value = true;
});

const tagOptions = {
  mask: ['#', ...Array(20).fill(/./)],
  elementPredicate: (el) => {
    return new Promise((resolve) => {
      requestAnimationFrame(async () => {
        const input = await el.getInputElement();
        resolve(input);
      });
    });
  },
};

const cancel = () => modal.value.$el.dismiss();

const saveButtonDisabled = computed(() => {
  return !text.value || !about.value || (!currentTag.value && !newTag.value);
});

const addNewTag = () => {
  addingTag.value = true;
  currentTag.value = null;
};

const chooseImage = async () => {
  const images = await Camera.pickImages();
  test.value = JSON.stringify(images)
};

watchEffect(() => {
  if (currentTag.value && addingTag.value) {
    addingTag.value = false;
    newTag.value = null;
  }
});

const noteToSend = computed(() => {
  let localText = null;
  let localCode = null;
  let localAbout = about.value;
  let localImage = null;
  let tag = currentTag.value || newTag.value?.slice(1);

  switch (selected.value) {
    case 'js':
      localCode = {
        lang: 'js',
        code: text.value,
      };
      break;
    case 'css':
      localCode = {
        lang: 'css',
        code: text.value,
      };
      break;
    case 'html':
      localCode = {
        lang: 'html',
        code: text.value,
      };
    case 'text':
      localText = text.value;

    default:
      break;
  }

  return {
    about: localAbout,
    text: localText,
    code: localCode,
    image: localImage,
    tag,
  };
});

const clearNote = () => {
  about.value = '';
  text.value = '';
  newTag.value = null;
  addingTag.value = null;
  currentTag.value = null;
  selected.value = 'js';
};
const sendNote = async () => {
  sending.value = true;

  try {
    await http.sendNote(noteToSend.value);
    emit('send');
  } catch (e) {
    console.log(e);
  } finally {
    clearNote();
    sending.value = false;
    modal.value.$el.dismiss();
  }
};
</script>

<style lang="css">
.flex {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
ion-button {
  --border-radius: 3px;
}
.custom-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 47px;
  padding: 10px 38px 10px 16px;
  background: #fff url('select-arrows.svg') no-repeat right 16px center;
  background-size: 10px;
  transition: border-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
  border: 1px solid #ddd;
  margin-right: 20px;
  border-radius: 3px;
}
.custom-select:hover {
  border: 1px solid #999;
}
.custom-select:focus {
  border: 1px solid #999;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2);
  outline: none;
}
/* remove default arrow in IE */
select::-ms-expand {
  display: none;
}
</style>
