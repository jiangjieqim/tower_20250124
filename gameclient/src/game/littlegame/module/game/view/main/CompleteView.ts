import {BaseUIView} from "../../../../rb/BaseUIView";
import { SoundManger } from "../../../../rb/sound/SoundManager";
import { UIManager } from "../../../../rb/UIManager";
import { GameModel } from "../../model/GameModel";
import { myUI } from "./myUI";

export class CompleteView extends BaseUIView{

    constructor(){//map/01.jpg
        super();
        this._layer = UIManager.inst.popLayer;
        this.url = "game/SuccessView.json";
        this.preLoadRes = [
            { url: "game/result/comp.png", type: Laya.Loader.IMAGE },
            { url: "res/atlas/game/result.atlas", type: Laya.Loader.ATLAS }
        ];
        this.needBg = true;
        this.effType = 3;
        this.clickBgHide = false;
    }

    get skin():myUI.game.SuccessViewUI{
        return this._skin as myUI.game.SuccessViewUI;
    }

    init() {
        super.init();
        
        this.onEvt(this.skin.confirmBtn,Laya.Event.CLICK,this,this.onClickConfirmBtn);
    }

   

    open(param?: any): void {
        super.open(param);
        SoundManger.playSound("win");
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


    onClickConfirmBtn(){
        this.close();
        let model:GameModel = this.model;
        model.view.mainView.onClickQuit();
    }

    


}