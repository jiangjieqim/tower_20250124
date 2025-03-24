import { E, IWeiXin } from "../../../../../G";
import { getPosSize } from "../../../sdk/ISdk";
import { SdkButtonMgr } from "../../../sdk/SdkButtonMgr";
import { System_RefreshTimeProxy } from "../../ctl/System_RefreshTimeProxy";
import { MainBotIconCtl } from "./MainBotIconCtl";
interface IWxBtn{
    show();
    hide();
}
export class WeiXinNormalStyle2 extends MainBotIconCtl{
    private _skin:Laya.Image;
    private btnCtl:WeiXinPyqCtl2;
    public setSkin(skin:Laya.Image){
        this._skin = skin;
        this.btnCtl = new WeiXinPyqCtl2();
        this.btnCtl.setSkin(this._skin);
    }

    public onVisible(v:boolean){
        this.btnCtl.onVisible(v);
    }
}
/**朋友圈按钮控制器 */
export class WeiXinPyqCtl2 extends MainBotIconCtl{
    private wxbtn:IWxBtn;
    private wx:IWeiXin;
    private _skin:Laya.Sprite;
    public setSkin(skin:Laya.Sprite){
        this._skin = skin;
        this.wx = E.wx;
        if(debug){
            this._skin.graphics.drawRect(0,0,this._skin.width,this._skin.height,null,0xff0000);
        }
        if(!this.wx){
            this._skin.on(Laya.Event.CLICK,this,this.onPyq);
        }
    }
    public onVisible(v:boolean){
        if(v){
            this.onDisplay();
        }else{
            this.onUnDisplay();
        }
    }
    private createWxBtn() {
        if (this.wx) {
            let o = getPosSize(this._skin);
            this.wxbtn = SdkButtonMgr.createGameClub(o);
        }
    }

    private onDisplay(){
        let wx = this.wx;
        if(wx){            
            if(!this.wxbtn){
                this.createWxBtn();
            }
            this.wxbtn.show();
        }
    }

    private onUnDisplay(){
        if(this.wxbtn){
            this.wxbtn.hide();
        }
    }

    private onPyq(e:Laya.Event){
        if(!this.wx){
            E.ViewMgr.ShowMidError("请切换到微信环境下");
        }
    }
}