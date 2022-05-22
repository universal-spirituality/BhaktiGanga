import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CachedImageComponent } from './cached-image/cached-image.component';
import { IonicModule } from '@ionic/angular';

@NgModule({

  declarations: [CachedImageComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [CachedImageComponent]
})
export class SharedComponentsModule { }
