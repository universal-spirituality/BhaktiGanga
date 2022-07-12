import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import albums from '../../assets/mockdata/albums';
import { PlayerDataService } from '../Services/player-data.service';
import { HttpClient } from '@angular/common/http';
import  {Http} from '@capacitor-community/http'
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
  tracksDevi = [];
  tracksSwami = [];
  tracksBoth = null;
  isLoading = false;
  customPopoverOptions: any = {
    header: 'Select Singer',
    triggerAction: 'click',
  };

  Singer = "Both";

  constructor(private activatedRoute: ActivatedRoute, 
              private playerDataService:PlayerDataService, 
             // public http: Http, 
              private api: ApiService,
              private router: Router,
              private toastController: ToastController) { 

    this.playerDataService.GetactiveTrackObservable().subscribe(at => {
      this.activeTrack = at;                
    });

    this.playerDataService.GetisPlayingObservable().subscribe(bt => {
      this.isPlaying = bt;               
    });

  }

  ngOnInit() {
    this.isLoading = true;
    const title = this.activatedRoute.snapshot.paramMap.get('title');
    const decodedTitle = decodeURIComponent(title);
    this.data = albums[decodedTitle];

    this.img = environment.ImgUrlPath;

    var url = environment.urlPath + '/GetAlbumData.php?album=' + title;
    
    this.api.getData(url, false).subscribe((album) => {
      album = album.data;

      this.data2 = {album: album.albums[0], tracks: album.tracks};
        this.playerDataService.SetTracks(this.data2.tracks);
        this.tracksBoth = album.tracks;

        for (var i = 0; i < album.tracks.length; i++) {

          if (album.tracks[i].singer == 0) this.tracksDevi.push(album.tracks[i]);
          else this.tracksSwami.push(album.tracks[i]);
        }     


    }); 
  }

  ionViewDidEnter(){
    this.isLoading = false;
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

  toggleTracks()
  {
    if (this.Singer == "Devi")
    {
      this.data2.tracks = this.tracksDevi;
    }
    else if (this.Singer == "Swami")
    {
      this.data2.tracks = this.tracksSwami;
    }
    else
    {
      this.data2.tracks = this.tracksBoth;
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Comming soon..',
      duration: 1000
    });
    toast.present();
  }
}
