import { Component, Injectable, ViewChild } from '@angular/core';
import { IonRange, IonTabs } from '@ionic/angular';
import { PlayerDataService } from '../Services/player-data.service';
import { Router,  RouterEvent, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Howl } from 'howler';
import { Pipe, PipeTransform } from '@angular/core';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})

export class TabsPage {
  
  @ViewChild(IonTabs) tabs:IonTabs;
  @ViewChild('range') range:IonRange;

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

   this.playerDataService.GetPlayerDataObservable().subscribe(albumDataForTrack => {console.log('DataForTrack', albumDataForTrack)
   this.playerData = albumDataForTrack;
   });

   this.playerDataService.GetactiveTrackObservable().subscribe(res => {console.log('activeTrack', res)
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

   this.playerDataService.GetprogressObservable().subscribe(res => {console.log('progress', res)
   this.progress = res;
   });

   this.playerDataService.GetisPlayingObservable().subscribe(res => {console.log('isPlaying', res)
   this.isPlaying = res;
   });

   this.playerDataService.GetdurationStartObservable().subscribe(res => {console.log('durationStart', res)
   this.durationStart = res;
   });

   this.playerDataService.GetdurationEndObservable().subscribe(res => {console.log('durationEnd', res)
   this.durationEnd = res;
   });

   this.playerDataService.GetdisplayPlayerObservable().subscribe(res => {console.log('displayPlayer', res)
   this.displayPlayer = res;
   });

  }

  setSelectedTab() {
    console.log('called');
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
