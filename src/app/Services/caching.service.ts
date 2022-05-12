import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import cordovaSQLiteDriver, { key } from 'localforage-cordovasqlitedriver';

const TTL = 15 * 60;
const CACHE_KEY = '_mycached_';

@Injectable({
  providedIn: 'root'
})


export class CachingService {

  constructor(private storage: Storage) { }

  async initStorage() {

    await this.storage.defineDriver(cordovaSQLiteDriver);
    await this.storage.create();
  }

  cacheRequests(url, data) {

    var now  = new Date();
    now.setDate(now.getDate()+1)
    now.setHours(6,0,0,0);

    const validUntill = now.getTime();
    url = `${CACHE_KEY}${url}`;

    return this.storage.set(url, {validUntill, data})
  }

  async getCachedRequest(url) {

    const currentTime = new Date().getTime();
    url = `${CACHE_KEY}${url}`;
    const storedValue = await this.storage.get(url);

    if(!storedValue) 
    {
      return null;
    }
    else if (storedValue.validUntill < currentTime)
    {
      await this.storage.remove(url);
      return null;
    }
    else
    {
      return storedValue.data;
    }
  }

  async clearCachedData() {
    const keys = await this.storage.keys();

    keys.map(async key => {
      if (key.startsWith(CACHE_KEY) ) {
        await this.storage.remove(key);
      }
    });
  }

  async invalidateCacheEntry(url) 
  {
    url = `${CACHE_KEY}${url}`;
    await this.storage.remove(url);
  }
}
