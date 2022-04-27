import { Directive, HostListener, Input, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appImageFade]'
})
export class ImageFadeDirective {

  @Input('appImageFade') cover: any;

  constructor(private rederer: Renderer2, private domCtrl: DomController) { }

  @HostListener('ionScroll', ['$event']) onContentScroll($event: any) {

    const scrollTop: number = $event.detail.scrollTop;

    let newOpacity = Math.max(100 - (scrollTop/3), 0);
    let newPadding = 15 + (scrollTop/25);

    if (newPadding > 100) { newPadding = 100; }

    this.domCtrl.write(() => {

      this.rederer.setStyle(this.cover, 'opacity', `${newOpacity}%`);
      this.rederer.setStyle(this.cover, 'padding-left', `${newPadding}%`);
      this.rederer.setStyle(this.cover, 'padding-right', `${newPadding}%`);
    })
  }
}
