export interface IProgressCtlSkin{
    bg:Laya.Image;
}
export class ProgressCtl{
    private skin:IProgressCtlSkin;
    private initW:number;
    constructor(skin:IProgressCtlSkin){
        this.skin = skin;
        this.initW = this.skin.bg.width;
    }

    /**
     * v :0-1
     */
    public set value(v:number){
        if(v< 0){
            this.skin.bg.visible = false;
        }else{
            this.skin.bg.visible = true;
            if(v > 1){
                this.skin.bg.width = this.initW;
            }else{
                this.skin.bg.width = v * this.initW;
            }
        }
    }

    dispose(){
        this.skin.bg = null;
    }
}