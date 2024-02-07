import axios from 'axios';
import {Storage} from '@ionic/storage';

const storage = new Storage();
storage.create();
// eslint-disable-next-line
let tokenTimer = null;
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {applicationId} from '../firebase';

const auth = getAuth();

export const storedUser = {
  async getToken() {
    const token = await storage.get('token');
    return token;
  },
  async setToken(token) {
    await storage.set('token', token);
  },
  async getRefreshToken() {
    const refresh = await storage.get('refresh');
    return refresh;
  },
  async setRefreshToken(token) {
    await storage.set('refresh', token);
  },
  async getId() {
    const id = await storage.get('userId');
    return id;
  },
  async setUserData(id, token, refresh) {
    await storage.set('userId', id);
    await this.setToken(token);
    await this.setRefreshToken(refresh);
  },
  async clearData() {
    await storage.remove('userId');
    await storage.remove('token');
    await storage.remove('refresh');
  },
};

const refreshTokenByTimeout = () => {
  tokenTimer = setTimeout(() => {
    refreshToken();
  }, 3600000);
};

export const refreshToken = async () => {
  try {
    const refreshToken = await storedUser.getRefreshToken();
    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${applicationId}`,
      {refreshToken, grantType: 'refresh_token'}
    );
    await storedUser.setToken(response.data['id_token']);
    await storedUser.setRefreshToken(response.data['refresh_token']);
    refreshTokenByTimeout();
  } catch (err) {
    console.log(err.message);
    throw new Error(err.message, {code: err.code});
  }
};

export const registerUser = async (email, password) => {
  try {
    const userCredential = createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await storedUser.setUserData(
      userCredential.user.uid,
      userCredential.user.accessToken,
      userCredential.user.refreshToken
    );
    refreshTokenByTimeout();
  } catch (error) {
    throw new Error(error.message, {code: error.code});
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await storedUser.setUserData(
      userCredential.user.uid,
      userCredential.user.accessToken,
      userCredential.user.refreshToken
    );
    refreshTokenByTimeout();

    return userCredential.user.accessToken;
  } catch (err) {
    console.error('oops :(', err.message);
    throw new Error(err.message, {code: err.code});
  }
};

export const signOutUser = async () => {
  await signOut(auth);
  await storedUser.clearData();
  tokenTimer = null;
};
