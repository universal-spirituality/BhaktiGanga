import { Component, ViewChild } from '@angular/core';
import { IonRange, IonTabs } from '@ionic/angular';
import { PlayerDataService } from '../Services/player-data.service';
import { Router} from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})

export class TabsPage {
  
  @ViewChild(IonTabs) tabs:IonTabs;
  @ViewChild('range') range:IonRange;

  img = null;
  selected  = '';
  singer = '';
  playerData = '';
  activeTrack;
  progress = 0;
  isPlaying: boolean = false;
  durationStart = 0;
  durationEnd = 0;
  displayPlayer: boolean = false;

  constructor(private playerDataService:PlayerDataService, private router: Router) {

   this.img = environment.ImgUrlPath;
   this.playerDataService.GetPlayerDataObservable().subscribe(albumDataForTrack => {
   this.playerData = albumDataForTrack;
   });

   this.playerDataService.GetactiveTrackObservable().subscribe(res => {
   this.activeTrack = res;

   if (res.singer == 0)
   {
    this.singer = 'Smt. Devi';
   }
   else
   {
    this.singer = 'Shri Datta Swami';
   }

   });

   this.playerDataService.GetprogressObservable().subscribe(res => {
   this.progress = res;
   });

   this.playerDataService.GetisPlayingObservable().subscribe(res => {
   this.isPlaying = res;
   });

   this.playerDataService.GetdurationStartObservable().subscribe(res => {
   this.durationStart = res;
   });

   this.playerDataService.GetdurationEndObservable().subscribe(res => {
   this.durationEnd = res;
   });

   this.playerDataService.GetdisplayPlayerObservable().subscribe(res => {
   this.displayPlayer = res;
   });

  }

  isSongLoading() {
   return this.playerDataService.isSongLoading ;
  }

  setSelectedTab() {
    this.selected = this.tabs.getSelected();
  }

  seek() {
    
    this.playerDataService.seek(this.range.value);
  }

  togglePlayer(pause) {

    this.playerDataService.togglePlayer(pause);
  }

  track() {
    const titleEscaped = encodeURIComponent('hi');
    this.router.navigateByUrl(`/tabs/tab1/track/${titleEscaped}`);
  }

  // Helper function for image names
  dasherize(string) {
     return string.replace(/[A-Z]/g, function(char, index) {
       return (index !== 0 ? '-' : '') + char.toLowerCase();
    });
  };

}
