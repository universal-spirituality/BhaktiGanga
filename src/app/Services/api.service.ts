import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { CachingService } from './caching.service';
import { delay, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {Http} from '@capacitor-community/http' 

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  ForceRefresh = null;
  constructor(private cachingService: CachingService) { 

  }
  
  public getData(url, forceRefresh): Observable<any> {

    if (forceRefresh) 
    {
      return this.callAndCache(url);
    }
    else
    {
      const storedValue = from(this.cachingService.getCachedRequest(url));  
      return storedValue.pipe (
        switchMap(result => {
          if(!result) 
          {
            return this.callAndCache(url);
          }
          else
          {
            return of(result);
          }
        })
      )
    }
  }
  
  private callAndCache(url): Observable<any> {

    console.log('test');

    return from(Http.request({method: 'Get', url})).pipe(
      tap(res => {
        this.cachingService.cacheRequests(url, res);
      })
    )
  }
}
