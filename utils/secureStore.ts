import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// For web, use localStorage as a fallback
// In a real app, you might want to use a more secure solution for web
const webStorage = {
  getItem: (key: string): Promise<string | null> => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key: string, value: string): Promise<void> => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

export const getItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return webStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
};

export const setItem = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'web') {
    return webStorage.setItem(key, value);
  }
  return SecureStore.setItemAsync(key, value);
};

export const removeItem = async (key: string): Promise<void> => {
  if (Platform.OS === 'web') {
    return webStorage.removeItem(key);
  }
  return SecureStore.deleteItemAsync(key);
};