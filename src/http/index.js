import axios from "axios";
import { storedUser } from "@/auth";
import { storage } from "@/firebase"
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

export default {
  async sendNote(note) {
    const token = await storedUser.getToken()
    const id = await storedUser.getId()
    let imagePath = null;
    let image = null;
    const sendImage = async (image) => {
      try {
        const imageRef = ref(storage, `${id}/${v4()}.jpg`);
        const res = await uploadBytes(imageRef, image);
        return res.metadata.fullPath;
      } catch (err) {
        throw new Error(
          `could not send image. http status is ${err.status}, message is ${err.message}`
        );
      }
    };

    if (note.image) {
      imagePath = await sendImage(note.image.file);
      delete note.image.file;
      image = { ...note.image, path: imagePath };
    }

    let date = new Date().toISOString();

    await axios.post(
      `https://learn-diary-412a6-default-rtdb.firebaseio.com/${id}.json?auth=${token}`,
      { ...note, image, date }
    );
  },

  async getNotes() {
    const token = await storedUser.getToken()
    const id = await storedUser.getId()
    const { data } = await axios.get(
      `https://learn-diary-412a6-default-rtdb.firebaseio.com/${id}.json?auth=${token}`
    );
    return data;
  },

};
