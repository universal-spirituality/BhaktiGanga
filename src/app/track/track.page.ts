import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayerDataService } from '../Services/player-data.service';
import { IonRange} from '@ionic/angular';
import { Router} from '@angular/router';

@Component({
  selector: 'app-track',
  templateUrl: './track.page.html',
  styleUrls: ['./track.page.scss'],
})
export class TrackPage implements OnInit {

  @ViewChild('range') range:IonRange;

  playerData = null;
  trackTitle = '';
  activeTrack;
  singer;
  progress;
  isPlaying;
  durationStart;
  durationEnd;

  constructor(private activatedRoute: ActivatedRoute, private playerDataService:PlayerDataService, private router: Router) { 

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

    this.playerDataService.GetactiveTrackObservable().subscribe(res => {console.log('durationEnd', res)
    this.trackTitle = res.track_name;
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

  }

  ngOnInit() {
    const title = this.activatedRoute.snapshot.paramMap.get('title');
    const decodedTitle = decodeURIComponent(title);
    console.log('this: ', this.trackTitle);
    this.playerData = this.playerDataService.GetPlayerData();

    this.trackTitle = this.playerDataService.GetActiveTrack().track_name;

    if (this.playerDataService.GetActiveTrack().singer == 0)
    {
      this.singer = 'Smt. Devi';
    }
    else
    {
      this.singer = 'Shri Datta Swami';
    }

    this.playerDataService.SetDisplayPlayer(false);
  }

  next()
  {
    this.playerDataService.next();
  }

  prev()
  {
    this.playerDataService.prev();
  }

  seek() {
    
    this.playerDataService.seek(this.range.value);
  }

  togglePlayer(pause) {

    this.playerDataService.togglePlayer(pause);
  }

    // Helper function for image names
    dasherize(string) {
      return string.replace(/[A-Z]/g, function(char, index) {
        return (index !== 0 ? '-' : '') + char.toLowerCase();
     });
   };

   ngOnDestroy() {

    this.playerDataService.SetDisplayPlayer(true);

   }

}
