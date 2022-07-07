import { Component, Input } from '@angular/core';
import {Filesystem, Directory, FilesystemDirectory} from '@capacitor/filesystem';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const CACHE_FOLDER = 'CACHED-IMG';

@Component({
  selector: 'app-cached-image',
  templateUrl: './cached-image.component.html',
  styleUrls: ['./cached-image.component.scss'],
})

export class CachedImageComponent {

  _src:SafeResourceUrl = '';
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
    
    if(imageName.search("default") != -1)
    {
      this._src = "/assets/images/default.jpeg";
    }
    else
    {
      Filesystem.readFile({
        directory: Directory.Cache,
        path: `${CACHE_FOLDER}/${imageName}`
      }).then(readFile => {
        // set to source.
        this._src = `data:image/${fileType};base64,${readFile.data}`;
  
      }).catch(async (e) => {
  
        await this.storeImage(imageUrl, imageName);
    
          Filesystem.readFile({
            directory: Directory.Cache,
            path: `${CACHE_FOLDER}/${imageName}`
          }).then(readFile => {
            // set to source.
            this._src = `data:image/${fileType};base64,${readFile.data}`;
    
          })
      
      });
    }
  }


  async storeImage(url, imageName)
  {
    const res = await fetch(url);

    const blob = await res.blob();
    const base64Data = await this.convertBlobToBase64(blob) as string;

     await Filesystem.writeFile({
      path: `${CACHE_FOLDER}/${imageName}`,
      data: base64Data,
      directory: Directory.Cache,
      recursive: true
    });
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

}
