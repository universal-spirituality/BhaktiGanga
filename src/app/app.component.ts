import { Component } from '@angular/core';
import { CachingService } from './Services/caching.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private cachingServices: CachingService) {
    this.cachingServices.initStorage();
  }
}
