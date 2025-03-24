import { ui } from "../../../../../ui/layaMaxUI";
import { stCoverBigGoose } from "../../../../network/protocols/BaseProto";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { EAvatarAnim } from "../../avatar/vos/EAvatarAnim";
import { EResKey, FightFactory } from "../../compose/FightFactory";
import { t_Monster_Template } from "../../compose/t_Monster_Template";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { ItemVo } from "../../main/vos/ItemVo";
import { GooseConfig } from "../model/GooseConfig";
import { TaodaeEvent } from "../model/TaodaeEvent";
import { TaoDaeModel } from "../model/TaoDaeModel";
/**套大鹅子对象 */
export class TaoDaeItem extends ui.views.taodae.ui_taodaeItemUI{
    private avatar:HeroAvatarView;
    cfg: Configs.t_Cover_Big_Goose_config_dat;
    private get useTimeMS():number{
        return GooseConfig.UseTimeMS;
    }
    constructor(){
        super();
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
    }
    private onPlayAnim(vo:stCoverBigGoose){
        // let vo = dataList[0];
        if(vo.pos == this.cfg.f_pos){
            if(this.useTimeMS > 0){
                this.playAnim();
                Laya.timer.once(this.useTimeMS,this,this.playAvatar);
            }else{
                this.refresh();
            }
        }
    }

    private playAvatar(){
        if(this.avatar){
            this.avatar.playAtk(EAvatarAnim.TowerAtk);
        }
        Laya.timer.once(this.useTimeMS,this,this.refresh);
    }

    private get model(){
        return TaoDaeModel.Ins;
    }
    private onUnDisplay(){
        this.model.off(TaodaeEvent.PlayOneAnim,this,this.onPlayAnim);
        this.model.off(TaodaeEvent.BigGooseChange,this,this.onBigGooseChange);
        this.model.off(TaodaeEvent.Reset,this,this.onReset);
        this.disposeAvatar();
    }
    private onDisplay(){
        this.model.on(TaodaeEvent.BigGooseChange,this,this.onBigGooseChange);
        this.model.on(TaodaeEvent.PlayOneAnim,this,this.onPlayAnim);
        this.model.on(TaodaeEvent.Reset,this,this.onReset);
    }
    private onReset(){
        this.refresh();
    }
    private onBigGooseChange(){
        this.refresh();
    }
    private disposeAvatar(){
        if(this.avatar){
            this.avatar.dispose();
            this.avatar = null;
        }
    }

    refresh() {
        this.cfg = this.dataSource;
        this.icon.skin = ``;
        this.lab.text = "";

        let _needAdd = true;
        let _data = this.model.data
        if(_data){
            let vo = _data.datalist.find(o=>o.pos == this.cfg.f_pos);
            if(vo && vo.reward){  
                _needAdd = false;
                let item = new ItemVo();
                item.cfgId = vo.reward.id;
                item.count = vo.reward.count;
                this.icon.skin = item.getIcon();
                this.lab.text = `x${item.count}`;
            }
        }

        if(_needAdd){
            this.addAvatar();
        }else{
            this.disposeAvatar();
        }
    }

    private addAvatar(){
        let tempCfg = t_Monster_Template.Ins.getMonsterTemplate(this.cfg.f_tempid);
        if(this.avatar && this.avatar.resId == tempCfg.f_imageid){

        }else{     
            this.disposeAvatar();
            if (tempCfg) {
                this.avatar = FightFactory.createByImageId(tempCfg.f_imageid, this.sp,0,0,1.0,EResKey.Fight);
            }
        }
    }
    private playAnim(){
        SpineEffectMgr.playOnce(`o/spine/succeed/rengquan/rengquan`,this,this.width/2,this.height/2);
    }
}