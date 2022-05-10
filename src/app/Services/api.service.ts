import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { CachingService } from './caching.service';
import { delay, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  ForceRefresh = null;
  constructor(private http: HttpClient, private cachingService: CachingService) { 

  }
  
  public getData(url, forceRefresh): Observable<any> {

    if (forceRefresh || this.GetForceRefresh()) 
    {
      return this.callAndCache(url);
    }
    else
    {
      const storedValue = from(this.cachingService.getCachedRequest(url, false));  
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

  private GetForceRefresh() : Observable<boolean>
  {
    var url = environment.urlPath + '/GetConfig.php';
    const storedValue = from(this.cachingService.getCachedRequest(url, true));  

    return storedValue.pipe (
       switchMap(result => {
        if(!result) 
        {
          this.callAndCache(url);
          return of(true);
        }
        else
        {
          var resp = this.callAndCache(url);
          return of(result !== resp);
        }
      })
    )
  }
  
  private callAndCache(url): Observable<any> {
    return this.http.get(url).pipe(
      tap(res => {
        this.cachingService.cacheRequests(url, res);
      })

    )
  }
}
