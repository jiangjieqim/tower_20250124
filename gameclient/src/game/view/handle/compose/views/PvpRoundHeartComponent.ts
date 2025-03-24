import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { HeartComponent } from "./HeartComponent";
/**PVP回合制心组件 */
export class PvpRoundHeartComponent extends HeartComponent{
    playerId:number;
    private btn:ButtonCtl;
    private get model(){
        return ComposeModel.Ins;
    }
    constructor(){
        super();
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onClick(){

    }
    private onDisplay(){
        this.btn = ButtonCtl.CreateBtn(this,this,this.onClick,false);
        this.model.on(ComposeEvent.PvpRoundHpUpdate,this,this.onHp);
        this.onHp();
    }
    private onHp(){
        let curVo = this.model.hpList.find(o=>o.playerId == this.playerId);
        let maxVo = this.model.maxHpList.find(o=>o.playerId == this.playerId);
        if(maxVo){
            this.maxHp = maxVo.hp;
        }
        if(curVo){
            this.value = curVo.hp;
        }
    }
    private onUnDisplay(){
        this.model.off(ComposeEvent.PvpRoundHpUpdate,this,this.onHp);
        if(this.btn){
            this.btn.dispose();
            this.btn = null;
        }
    }
}