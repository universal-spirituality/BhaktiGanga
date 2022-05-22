import { AnimationController, Animation } from "@ionic/angular";

export const enterAnimation = (baseEl: HTMLElement, opts?: any): Animation => {
    
    const DURATION = 400;
    const animationCtrl = new AnimationController();

    if (opts.direction === 'forward')
    {
        return animationCtrl.create()
        .addElement(opts.enteringEl)
        .duration(DURATION)
        .easing('ease-in')
        //.fromTo('transform', 'translateX(0px)', 'translateX(100px)')
        //.fromTo('background', 'blue', 'var(--background)')
        //.fromTo('opacity', '0.01', 'var(--backdrop-opacity)')        
        //.fromTo('transform', 'rotate(0deg)', 'rotate(360deg)');
        .fromTo('opacity',0,1);
    }
    else
    {
        const rootAnimation =  animationCtrl.create()
        .addElement(opts.enteringEl)
        .duration(DURATION)      
        .easing('ease-in')
        .fromTo('opacity',0,1);

        const leavingAnimation =  animationCtrl.create()
        //return animationCtrl.create()
        .addElement(opts.leavingEl)
        .duration(DURATION)
        .easing('ease-in')
        .fromTo('opacity',1,0);
        return animationCtrl.create().addAnimation([rootAnimation, leavingAnimation ])
    }
    
}