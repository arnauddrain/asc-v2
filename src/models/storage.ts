import { Storage } from "@ionic/storage";

const store = new Storage();
const readyPromise = store.create();

export async function storageGet<T>(key: string): Promise<T | null> {
  await readyPromise;
  return store.get(key);
}

export async function storageSet(key: string, value: any) {
  await readyPromise;
  return store.set(key, value);
}
