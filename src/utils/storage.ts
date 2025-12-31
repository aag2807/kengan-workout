// IndexedDB wrapper for workout data storage
const DB_NAME = 'CosmoWorkoutDB';
const DB_VERSION = 1;
const STORES = {
  SESSIONS: 'workout-sessions',
  PROFILE: 'user-profile',
};

class WorkoutDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create sessions store
        if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
          const sessionsStore = db.createObjectStore(STORES.SESSIONS, { keyPath: 'id' });
          sessionsStore.createIndex('date', 'date', { unique: false });
          sessionsStore.createIndex('workoutType', 'workoutType', { unique: false });
        }

        // Create profile store
        if (!db.objectStoreNames.contains(STORES.PROFILE)) {
          db.createObjectStore(STORES.PROFILE, { keyPath: 'id' });
        }
      };
    });
  }

  async add<T extends { id: string }>(storeName: string, data: T): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async put<T extends { id: string }>(storeName: string, data: T): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: string, id: string): Promise<T | undefined> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton instance
export const workoutDB = new WorkoutDB();

// Storage abstraction layer with fallback to localStorage
export class StorageManager {
  private useIndexedDB = true;

  constructor() {
    // Check if IndexedDB is available
    if (typeof indexedDB === 'undefined') {
      this.useIndexedDB = false;
      console.warn('IndexedDB not available, falling back to localStorage');
    }
  }

  async init(): Promise<void> {
    if (this.useIndexedDB) {
      try {
        await workoutDB.init();
      } catch (error) {
        console.error('IndexedDB init failed, falling back to localStorage:', error);
        this.useIndexedDB = false;
      }
    }
  }

  async saveItem<T extends { id: string }>(storeName: string, data: T): Promise<boolean> {
    try {
      if (this.useIndexedDB) {
        await workoutDB.put(storeName, data);
      } else {
        const key = `${storeName}-${data.id}`;
        localStorage.setItem(key, JSON.stringify(data));
      }
      return true;
    } catch (error) {
      console.error('Failed to save item:', error);
      return false;
    }
  }

  async getItem<T>(storeName: string, id: string): Promise<T | null> {
    try {
      if (this.useIndexedDB) {
        const result = await workoutDB.get<T>(storeName, id);
        return result || null;
      } else {
        const key = `${storeName}-${id}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.error('Failed to get item:', error);
      return null;
    }
  }

  async getAllItems<T>(storeName: string): Promise<T[]> {
    try {
      if (this.useIndexedDB) {
        return await workoutDB.getAll<T>(storeName);
      } else {
        const items: T[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(storeName)) {
            const data = localStorage.getItem(key);
            if (data) items.push(JSON.parse(data));
          }
        }
        return items;
      }
    } catch (error) {
      console.error('Failed to get all items:', error);
      return [];
    }
  }

  async deleteItem(storeName: string, id: string): Promise<boolean> {
    try {
      if (this.useIndexedDB) {
        await workoutDB.delete(storeName, id);
      } else {
        const key = `${storeName}-${id}`;
        localStorage.removeItem(key);
      }
      return true;
    } catch (error) {
      console.error('Failed to delete item:', error);
      return false;
    }
  }

  async clearStore(storeName: string): Promise<boolean> {
    try {
      if (this.useIndexedDB) {
        await workoutDB.clear(storeName);
      } else {
        const keysToDelete: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(storeName)) {
            keysToDelete.push(key);
          }
        }
        keysToDelete.forEach(key => localStorage.removeItem(key));
      }
      return true;
    } catch (error) {
      console.error('Failed to clear store:', error);
      return false;
    }
  }
}

export const storageManager = new StorageManager();
export { STORES };
