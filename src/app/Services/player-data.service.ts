import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Howl } from 'howler';
import { pathToFileURL } from 'url';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PlayerDataService {

  player: Howl = null;

  playerData = new BehaviorSubject<any>('');

  activeTrack = new BehaviorSubject<any>('');
  progress = new BehaviorSubject<any>(0);
  isPlaying = new BehaviorSubject<any>(false);
  durationStart = new BehaviorSubject<any>(0);
  durationEnd = new BehaviorSubject<any>(0);
  displayPlayer = new BehaviorSubject<any>(false);

  tracks = [];
  trackIndex;
  timer;

  constructor() { }

  SetTracks(t:any) {

    this.tracks = t;
  }

  SetPlayerData(t:any) {

    this.playerData.next(t);
  }

  SetDisplayPlayer(t:boolean) {
    this.displayPlayer.next(t);
  }

  SetActiveTrack(t) {

    this.activeTrack.next(t);
  }

  GetPlayerData() {

    return this.playerData.getValue();
  }

  GetActiveTrack() {

    return this.activeTrack.getValue();
  }

  GetactiveTrackObservable(): Observable<any>  {

    return this.activeTrack.asObservable();
  }

  GetprogressObservable(): Observable<any>  {

    return this.progress.asObservable();
  }

  GetisPlayingObservable(): Observable<any>  {

    return this.isPlaying.asObservable();
  }
  GetdurationStartObservable(): Observable<any>  {

    return this.durationStart.asObservable();
  }
  GetdurationEndObservable(): Observable<any>  {

    return this.durationEnd.asObservable();
  }

  GetPlayerDataObservable(): Observable<any>  {

    return this.playerData.asObservable();
  }

  GetdisplayPlayerObservable(): Observable<any>  {

    return this.displayPlayer.asObservable();
  }

  start(track, playAll = false) {

    var pathToFile = ''; 

    if (track) {

      this.trackIndex = this.tracks.indexOf(track);

      if (track.singer == 0) 
      {
        pathToFile = 'Devi%2F';  
      }
      else
      {
        pathToFile = 'Swami%2F';  
      }

      if (this.player)
      {
        clearTimeout(this.timer);
        this.player.stop();
        this.player.unload();
      }
  
      this.player = new Howl({

        html5: true,
        src: [environment.AudioUrlPath+ pathToFile + track.audio_name + '.mp3?alt=media'],

        onplay: () => {
  
          console.log('play');

          this.isPlaying.next(true);
          this.updateProgress();
          this.activeTrack.next(track);
        },

        onload: () => {

          console.log('onload');

          this.durationEnd.next(this.player.duration());
        },

        onend: () => {

          console.log('onend');

          this.isPlaying.next(false);

          if (playAll)
          {
            this.next(true);
          }
        }
        
      });
 
      this.player.play();
    }

  }

  togglePlayer(pause) {

    this.isPlaying.next(!pause);

    if (pause)
    {
     this.player.pause();
    }
    else
    {
    this.player.play();
    }
  }

  next(playAll = false) {

    if (this.player)
    {
      this.player.stop();
    }

    if (this.trackIndex != (this.tracks.length - 1))
    {
      console.log('next');
      this.start(this.tracks[this.trackIndex + 1], playAll);
    }

  }

  prev() {

    if (this.trackIndex > 0)
    {
      this.start(this.tracks[this.trackIndex - 1]);
    }

  }

  seek(rangeValue) {

    let newVaue = +rangeValue;
    let duration = this.player.duration();

    this.player.seek(duration * (newVaue/100));
  }

  updateProgress() {

    let duration = this.player.seek();
    this.durationStart.next(duration);

    this.progress.next((duration/this.player.duration()) * 100 || 0);

     this.timer = setTimeout(() => {
      if (this.isPlaying.value) {
        this.updateProgress();
      }
    }, 1000)
    
  }


}
