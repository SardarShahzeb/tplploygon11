import { openDB } from 'idb';

const dbName = 'dop-wallet';
const storeName = 'wallet-collection';

export const initDB = async () => {
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    },
  });

  return db;
};

export const saveData = async (key, value) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  store.put(value, key);
  await tx.complete;
};

export const getData = async (key) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  return store.get(key);
};
