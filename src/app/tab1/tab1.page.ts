import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { PlayerDataService } from '../Services/player-data.service';
import { environment } from '../../environments/environment';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  SungByDevi:any = [];
  SungByDattaSwami:any = [];
  img = null;

  loading:boolean = true;
  Tracks = [];
  data2 =[];

  platForm;

  isDesktop = false;
  slidesPerView = null

  opts2 = {

    slidesPerView: 2.4,
    slideOffsetBefore: 20,
    spaceBetween:20,
    freeMode: true,
    zoom: false,
    
    breakpoints: {
      320: {slidesPerView: 2.4,},
      480: {slidesPerView: 3.4,},
      640: {slidesPerView: 4.4,},
      720: {slidesPerView: 5.4,},
    } 

  }

  constructor(private router: Router, public http: HttpClient, platform: Platform, private playerDataService:PlayerDataService,
    private api: ApiService) {

    this.img = environment.ImgUrlPath;
    platform.ready().then(() => {
      if (!environment.production) console.log('Width: ' + platform.width());
      if (!environment.production) console.log('Height: ' + platform.height());

      if (platform.is('android')) {
        this.platForm = 'android';
        if (!environment.production) console.log("running on Android device!");
      }
      if (platform.is('ios')) {

        this.platForm = 'ios';
        if (!environment.production) console.log("running on iOS device!");
      }
      if (platform.is('mobileweb')) {

        this.platForm = 'mobileweb';
        if (!environment.production) console.log("running in a browser on mobile!");
      }

      if (platform.is('desktop')) {

        this.platForm = 'desktop';
        if (!environment.production) console.log("running in a browser on mobile!");
      }

    });
  }

  ngOnInit() {

    this.api.getData(environment.urlPath + '/Tracks.php?test=1', false).subscribe((data) =>{

      data = data.data;
      this.data2[0] = { title: 'All Albums', albums: data[0]};

      this.Tracks[0] = { title: 'Sung By Shri Datta Swami', track: data[1]};
      this.Tracks[1] = { title: 'Sung By Smt. Devi', track: data[2]};
      this.Tracks[2] = { title: 'Sanskrit Bhajans', track: data[3]};
      this.Tracks[3] = { title: 'Telugu Bhajans', track: data[4]};

      this.loading = false;

    });
  }

  playTrack(t) {

    this.playerDataService.start(t);
    this.playerDataService.SetDisplayPlayer(true);
  }

  openAlbum(album) {
       
    const titleEscaped = encodeURIComponent(album.title);
    this.router.navigateByUrl(`/tabs/tab1/album/${titleEscaped}`);
  }
    // Helper function for image names
    dasherize(string) {
      return string.replace(/[A-Z]/g, function(char, index) {
        return (index !== 0 ? '-' : '') + char.toLowerCase();
      });
    };

}
