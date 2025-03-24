import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { LayerMgr } from "../../../../layer/LayerMgr";
import { ComposeModel } from "../ComposeModel";
import { FightFactory } from "../FightFactory";
// import { t_Monster } from "../t_Monster_Template";
import { BaseAdmissionShow } from "./BaseAdmissionShow";
import { FrameMonster } from "./FrameAvatar";
/**Boss来袭横幅 */
export class BossBannerShow extends BaseAdmissionShow{
    monsterId:number;
    wave:number = 1;
    private skin:ui.views.compose.banner1.ui_boss_bannerUI;
    private monster:FrameMonster;
    constructor(){
        super();
        this.skin = new ui.views.compose.banner1.ui_boss_bannerUI();
    }
    private get model(){
        return ComposeModel.Ins;
    }
    protected onCompleteHander() {
        // super.onCompleteHander();
        LayerMgr.Ins.screenEffectLayer.addChild(this.skin);
        this.skin.pos((Laya.stage.width - this.skin.width) / 2, Laya.stage.height / 2);
        if(this.skel.skeleton){
            this.skin.addChildAt(this.skel.skeleton,0);
            this.skel.skeleton.pos(375,120);
        }
        this.monster = FightFactory.createFrameMonster(this.monsterId,this,this.onLoadComplete,3.0);
    }
    load(){
        super.load();
        this.skin.tf.text = E.getLang("wave",this.wave);
        let tempCfg = this.model.fightTypeAdaper.monsterCfg.getTempCfg(this.monsterId);
        this.skin.monsterName.text = `【`+tempCfg.f_monster_name+`】`;
        this.skin.monsterName.x = this.skin.tf.x + this.skin.tf.textField.textWidth;
        this.skin.timetf.text= `${ComposeModel.Ins.curAdapter.getDisappearTime(this.monsterId)}s`;
    }
    private onLoadComplete(){
        // if(this.monster && this.monster.skeleton){
        //     this.monster.skeleton.pos(564,0)
        //     this.skin.addChildAt(this.monster.skeleton,1);
        // }else{
        // }
        
        let monsterSkel:Laya.Sprite = this.monster.skeleton;
        monsterSkel.pos(564,0);
        this.skin.addChildAt(monsterSkel,1);

        // if (this.monster && this.monster.skeleton) {
        //     this.monster.skeleton.pos(564, 0)
        //     this.skin.addChildAt(this.monster.skeleton, 1);
        // }
    }
    dispose(){
        super.dispose();
        if(this.skin.parent){
            this.skin.removeSelf();
        }
        if(this.monster){
            this.monster.dispose();
            this.monster = null;
        }
    }
}