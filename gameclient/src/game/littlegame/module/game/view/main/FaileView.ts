import {BaseUIView} from "../../../../rb/BaseUIView";
import { SoundManger } from "../../../../rb/sound/SoundManager";
import {UIManager} from "../../../../rb/UIManager";
import {GameModel} from "../../model/GameModel";
import { myUI } from "./myUI";

export class FaileView extends BaseUIView{

    constructor(){//map/01.jpg
        super();
        this._layer = UIManager.inst.popLayer;
        this.url = "game/FailedView.json";
        this.preLoadRes = [
            { url: "game/result/fail.png", type: Laya.Loader.IMAGE },
            { url: "res/atlas/game/result.atlas", type: Laya.Loader.ATLAS }
        ];
        this.effType = 3;
        this.clickBgHide = false;
        this.needBg = true;
       
      
    }

    get skin():myUI.game.FailedViewUI{
        return this._skin as myUI.game.FailedViewUI;
    }

    init() {
        super.init();
        this.onEvt(this.skin.restartBtn,Laya.Event.CLICK,this,this.onClickRestartBtn);
    }

   

    open(param?: any): void {
        super.open(param);
        SoundManger.playSound("fail");
        SoundManger.stopMusic();

        // this.startPlay();
        
    }

    updateUI(): void {
        console.log("777....");
        
    }

    destroy(){
        this.close();
        super.destroy();
    }


    onClickRestartBtn(){
        let need  = true;
        if(need){
            this.close();
            let model:GameModel = this.model;
            model.view.mainView.onClickRestartBtn();
        }
        
    }

    


}