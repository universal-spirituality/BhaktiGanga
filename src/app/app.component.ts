import { Component } from '@angular/core';
import { CachingService } from './Services/caching.service';
import {Filesystem, Directory} from '@capacitor/filesystem';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private cachingServices: CachingService) {
    this.cachingServices.initStorage();
    this.createCacheFolder();
  }

  async createCacheFolder() {
    await Filesystem.mkdir({
      directory: Directory.Cache,
      path: `CACHED_IMG`,
      recursive: true
    });
  }
}
