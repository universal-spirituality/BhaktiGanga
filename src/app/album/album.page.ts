import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import albums from '../../assets/mockdata/albums';
import { PlayerDataService } from '../Services/player-data.service';
import { HttpClient } from '@angular/common/http';
import { Router} from '@angular/router';
import { environment } from '../../environments/environment';
import { ApiService } from '../Services/api.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-album',
  templateUrl: './album.page.html',
  styleUrls: ['./album.page.scss'],
})

export class AlbumPage implements OnInit {

  data = null;
  data2 = null;
  img = null;
  activeTrack = null;
  isPlaying = false;

  constructor(private activatedRoute: ActivatedRoute, 
              private playerDataService:PlayerDataService, 
              public http: HttpClient, 
              private api: ApiService,
              private router: Router,
              private toastController: ToastController) { 

    this.playerDataService.GetactiveTrackObservable().subscribe(at => {console.log('at', this.activeTrack)
      this.activeTrack = at;                
    });

    this.playerDataService.GetisPlayingObservable().subscribe(bt => {console.log('bt', this.isPlaying)
      this.isPlaying = bt;               
    });

  }

  ngOnInit() {
    const title = this.activatedRoute.snapshot.paramMap.get('title');
    const decodedTitle = decodeURIComponent(title);
    this.data = albums[decodedTitle];
    console.log('this: ', this.data);

    this.img = environment.ImgUrlPath;

    var url = environment.urlPath + '/GetAlbum.php?album=' + title;
    
    this.api.getData(url, false).subscribe((album) =>{

      var url1 = environment.urlPath + '/GetTracks.php?album=' + album[0].id;
      this.api.getData(url1, false).subscribe((data) => {

        this.data2 = {album: album[0], tracks: data};
        this.playerDataService.SetTracks(this.data2.tracks);
        console.log(this.data2);
      });
      
    });
/*
    this.http
    .get(url)
    .subscribe((album) => {

      var url1 = environment.urlPath + '/GetTracks.php?album=' + album[0].id;

      this.http
      .get(url1)
      .subscribe((data) => {

        this.data2 = {album: album[0], tracks: data};
        this.playerDataService.SetTracks(this.data2.tracks);
        console.log(this.data2);

      });

    });
  */  
  }

  playAll(t)
  {
    this.playerDataService.SetPlayerData(this.data2.album);
    this.playerDataService.start(t[0], true);
    this.playerDataService.SetDisplayPlayer(true);
  }
  
  playTrack(t) {

    this.playerDataService.SetPlayerData(this.data2.album);
  //  this.track();
    this.playerDataService.SetDisplayPlayer(true);
    this.playerDataService.start(t);
  }

  track() {
    const titleEscaped = encodeURIComponent('hi');
    this.router.navigateByUrl(`/tabs/tab1/track/${titleEscaped}`);
  }

  isFav(t)
  {
   // return this.userDataService.isFav(t.id);

   return false;
  }

  RemoveFav(t)
  {
   // this.userDataService.RemoveFav(t.id);
  }

  AddFav(t)
  {
   // this.userDataService.AddFav(t.id);
  }

  // Helper function for image names
  dasherize(string) {
    return string.replace(/[A-Z]/g, function(char, index) {
      return (index !== 0 ? '-' : '') + char.toLowerCase();
    });
  };

  async presentToast() {
    console.log("test");
    const toast = await this.toastController.create({
      message: 'Comming soon..',
      duration: 1000
    });
    toast.present();
  }
}
