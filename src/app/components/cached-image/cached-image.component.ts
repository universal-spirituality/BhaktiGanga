import { Component, Input } from '@angular/core';
import {Filesystem, Directory, FilesystemDirectory} from '@capacitor/filesystem';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

const CACHE_FOLDER = 'CACHED-IMG';

var UrlStore = [];

@Component({
  selector: 'app-cached-image',
  templateUrl: './cached-image.component.html',
  styleUrls: ['./cached-image.component.scss'],
})

export class CachedImageComponent {

  _src:SafeResourceUrl = '';
  img_url = '';
  constructor(private sanitizer: DomSanitizer) {
  }
  
  @Input()
  height = "";
  @Input()
  position = "";
  @Input()
  zindex = null;
  @Input()
  opacity = null;
  @Input()
  maxheight = "";

  @Input()
  spinner = false;

  @Input()
  set src(imageUrl: string) {

    const imageName = imageUrl.split('/').pop();
    const fileType = imageName.split('.').pop();
    this.img_url = imageUrl;
    
    Filesystem.readFile({
      directory: Directory.Cache,
      path: `${CACHE_FOLDER}/${imageName}`
    }).then(readFile => {
      // set to source.
      this._src = `data:image/${fileType};base64,${readFile.data}`;
      UrlStore[this.img_url] = this._src;

    }).catch(async (e) => {

      if(!UrlStore.hasOwnProperty(this.img_url))
      {
        UrlStore[this.img_url] = '';
        await this.storeImage(imageUrl, imageName);
  
        Filesystem.readFile({
          directory: Directory.Cache,
          path: `${CACHE_FOLDER}/${imageName}`
        }).then(readFile => {
          // set to source.
          this._src = `data:image/${fileType};base64,${readFile.data}`;
          UrlStore[this.img_url] = this._src;
  
        })
      }
    });
  }

  getSrc()
  {
    return UrlStore[this.img_url];
  }

  async storeImage(url, imageName)
  {
    const res = await fetch(url, {cache: "force-cache"});

    const blob = await res.blob();
    const base64Data = await this.convertBlobToBase64(blob) as string;

    console.log("text");
    const savedFile = await Filesystem.writeFile({
      path: `${CACHE_FOLDER}/${imageName}`,
      data: base64Data,
      directory: Directory.Cache,
      recursive: true
    });

    return savedFile;
  }

  convertBlobToBase64(blob: Blob)
  {
    return new Promise((resolve, reject) => {
      const reader  = new FileReader();
      reader.onerror = reject;
      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(blob);
    })
  }

  isUrlReady()
  {
    return (UrlStore[this.img_url] != '');
  }

}
