import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlbumPageRoutingModule } from './album-routing.module';

import { AlbumPage } from './album.page';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { SharedComponentsModule } from '../components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlbumPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [AlbumPage]
})
export class AlbumPageModule {}
