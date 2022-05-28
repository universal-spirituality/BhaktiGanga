import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@ionic/storage-angular';
import cordovaSQLiteDriver, { key } from 'localforage-cordovasqlitedriver';

const CACHE_KEY = '_mycached_';
const IMG_CACHE = 'IMG_CACHE_VALIDITY';


@Injectable({
  providedIn: 'root'
})


export class CachingService {

  constructor(private storage: Storage) {}

  async initStorage() {

    await this.storage.defineDriver(cordovaSQLiteDriver);
    await this.storage.create();

   /* const storedValue = await this.storage.get(IMG_CACHE);

    console.log(storedValue);
    if (storedValue)
    {
      const currentTime = new Date().getTime();

      if (storedValue <  currentTime)
      {
        await this.clearImgCache();

        var now  = new Date();
        now.setDate(now.getDate()+1)
        now.setHours(6,0,0,0);
        const validUntill = now.getTime();
        this.storage.set(IMG_CACHE, validUntill);
      }
    }
    else
    {
      var now  = new Date();
      now.setDate(now.getDate()+1)
      now.setHours(6,0,0,0);
      const validUntill = now.getTime();
      this.storage.set(IMG_CACHE, validUntill);
    }
    */

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

  async clearImgCache() {
    const fileEntries = await Filesystem.readdir({
      directory: Directory.Cache,
      path: 'CACHED-IMG'
    })

    fileEntries.files.map(async f => {

      await Filesystem.deleteFile({
        directory: Directory.Cache,
        path: `CACHED-IMG/${f}`
      });

    })
  }
}
