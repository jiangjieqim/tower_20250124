import { getPosSize } from "../../../sdk/ISdk";
import { ISdkBaseButton, SdkButtonMgr } from "../../../sdk/SdkButtonMgr";
/**抖音客服控制器 */
export class DouYinClientCtl{
    private douyinBtn:ISdkBaseButton;
    private skin:Laya.Sprite;
    updateLogicVis(skin:Laya.Sprite,v:boolean){
        // console.log("updateLogicVis:",v,this.douyinBtn);
        this.skin = skin;
        if(this.douyinBtn){
            // this.douyinBtn.destroy();
            // this.douyinBtn = null;
            this.douyinBtn.hide();
        }
        if(v){
            if(this.douyinBtn){
                this.douyinBtn.show();
            }else{
                Laya.timer.frameLoop(1,this,this.checkSkin);
            }
        }
    }

    private checkSkin(){
        if(this.skin.parent){
            Laya.timer.clear(this,this.checkSkin);
            let o = getPosSize(this.skin);
            if(!this.douyinBtn){
                this.douyinBtn = SdkButtonMgr.createClientButton(o);
                LogSys.Log(`createClientButton for douyinClient!`);
            }
            this.douyinBtn.show();
        }else{
            // console.log("run..................");
            // LogSys.Warn("RUN checkSkin");
        }
    }
}