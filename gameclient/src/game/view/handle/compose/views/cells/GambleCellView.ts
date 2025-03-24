// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../../ui/layaMaxUI";
import { E } from "../../../../../G";
import { SpineCoreSkel } from "../../../avatar/spine/SpineCoreSkel";
import { IconUtils } from "../../../main/model/IconUtils";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { TowerMainEvent } from "../../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../../towertmain/model/TowerMainModel";
import { TowertMainHeroModel } from "../../../towertmainhero/model/TowertMainHeroModel";
import { HeroListProxy } from "../../../towertmainhero/proxy/HeroProxy";
import { ComposeEvent } from "../../ComposeEvent";
import { ComposeModel } from "../../ComposeModel";
import { EInnerSoundType, t_Inner_Sound } from "../../t_Inner_Sound";
import { GambleCfgVo, IGambleResult } from "../../vos/GambleCfgVo";

class EGambleAnimType{
    static Stop:number = 0;
    static Fail:number = 1;
    static Succeed:number = 2;
}

/**赌博cell 
 * 
 * 播放成功失败动画
 * 
                let vo:IGambleResult = {} as IGambleResult;
                vo.succeed = parseInt(p2) == 1;
                vo.type = parseInt(p1);
                ComposeModel.Ins.event(ComposeEvent.GambleComplete,vo);
 * 
*/
export class GambleCellView extends ui.views.compose.fightcell.ui_gamble_ItemUI {
    private btnCtl: ButtonCtl;
    private clickImgCtl:ButtonCtl;
    private vo: GambleCfgVo;
    private skel: SpineCoreSkel;
    private model:ComposeModel;
    constructor() {
        super();
        this.model = ComposeModel.Ins;
        this.btnCtl = ButtonCtl.CreateBtn(this.btn, this, this.onGambleHandler);
        this.clickImgCtl = ButtonCtl.CreateBtn(this.clickImg,this,this.onClickImg);
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUndisplay);
    }
    private onClickImg(){
        
    }
    dispose(){
        this.vo = null;
        if(this.skel){
            this.skel.dispose();
            this.skel = null;
        }
        this.removeSelf();
    }
    private onDisplay(){
        this.model.on(ComposeEvent.GambleComplete,this,this.onGambleComplete);
        this.model.on(ComposeEvent.UpdateGambleProb,this,this.onUpdatePercent);
        TowerMainModel.Ins.on(TowerMainEvent.ValChangeCell, this, this.onUpdateLab);
    }

    init() {
        if (!this.skel) {
            this.skel = new SpineCoreSkel();
            // this.skel.setSlotSkin("Card_back",this._curURL,true);//Card_back Card_front
            this.skel.once(Laya.Event.COMPLETE, this, this.onCompleteHander);
            // let anim:number = EAvatarAnim.TowerIdle + (this.cfg.f_card_visualeffect - 1);
            this.skel.play(EGambleAnimType.Stop, this, this.onPlayEnd, undefined, false, false, true);
            let index = this.vo.type;
            this.skel.load(`o/spine/succeed/Prayers${index}/Prayers${index}.skel`);
        }
    }

    private onPlayEnd() {
        if( this.skel && this.skel.skeleton){
            this.addChildAt(this.skel.skeleton,0);
            this.skel.skeleton.pos(this.width/2,227);//177
        }
    }
    private onCompleteHander(){

    }
    private onGambleComplete(result:IGambleResult){
        if(this.skel && this.vo.type == result.type){ 
            // FightMoney.showGamble(this,result.succeed);
        
            if(result.succeed){
                // let _heroCfg: Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(result.heroId);
                let imageId = TowertMainHeroModel.Ins.getDefImageIdById(result.heroId);
                let url:string = HeroListProxy.Ins.getSmallIconSkin(imageId);
                this.skel.setSlotImg("hero",url);//设置英雄的插槽头像

                //Card_back Card_front
                
                this.skel.play(EGambleAnimType.Succeed, this, this.onPlayStop,null,true);
                t_Inner_Sound.Ins.play(EInnerSoundType.GambleSucceed);
            }else{
                this.skel.play(EGambleAnimType.Fail, this, this.onPlayStop,null,true);
                t_Inner_Sound.Ins.play(EInnerSoundType.GambleFail);
            }
        }
    }

    private onPlayStop(){
        if(this.skel){
            this.skel.play(EGambleAnimType.Stop,null,null,null,false,null,true);
        }
    }

    private onUndisplay(){
        this.model.off(ComposeEvent.GambleComplete,this,this.onGambleComplete);
        this.model.off(ComposeEvent.UpdateGambleProb,this,this.onUpdatePercent);
        TowerMainModel.Ins.off(TowerMainEvent.ValChangeCell, this, this.onUpdateLab);
        // if(this.skel){
        //     this.skel.dispose();
        //     this.skel = null;
        // }
    }

    private onUpdateLab(id:number){
        if(this.vo && this.vo.priceVo.cfgId == id){
            ItemViewFactory.setlb2(this.curTf,this.vo.priceVo.cfgId,this.vo.priceVo.count);
        }
    }
    private onGambleHandler() {
        this.model.curAdapter.gamble(this.vo.type,this.vo.priceVo.count);
    }
    updateView(){
        this.refresh(this.vo);
    }
    refresh(vo:GambleCfgVo) {
        // let vo: GambleCfgVo = this.dataSource;
        this.vo = vo;
        
        // this.curTf.text = vo.priceVo.count + "";
        this.onUpdateLab(vo.priceVo.cfgId);

        this.icon.skin = IconUtils.getIconByCfgId(vo.priceVo.cfgId);
        let arr = E.getLang("gamble").split("|");
        let colorArr: string[] = ["#93DDFF", "#F06EEF", "#FFED72"];
        // let imgArr: string[] = ["icon_xy", "icon_ss", "icon_cs"];
        let index = vo.type - 1;
        this.lab1.text = arr[index];
        this.lab1.color = colorArr[index];
        // this.img.skin = `remote/fight/${imgArr[index]}.png`;
        this.onUpdatePercent();

        //layout
        this.icon.x = (this.btn.width - (this.icon.width*this.icon.scaleX) - this.curTf.textField.textWidth)/2;
        this.curTf.x = this.icon.x + (this.icon.width*this.icon.scaleX);
    }

    private onUpdatePercent(){
        let vo = this.vo;
        if(!vo){
            return;
        }
        if (vo.bHasChange) {
            this.xlab0.visible = this.xlab1.visible = true;
            this.xlab0.text = `${this.toPercentStr(vo.percent)}%`;
            
            let changeVal:number = Math.abs(vo.real - vo.percent);
            if(vo.real - vo.percent > 0){
                this.xlab1.text = `+${this.toPercentStr(changeVal)}%`;
                this.xlab1.color = "#45FF7A";
            }else{
                this.xlab1.text = `-${this.toPercentStr(changeVal)}%`;
                this.xlab1.color = "#FF0000";
            }
            this.lab.visible = false;

            //layout
            this.xlab0.x = (this.width - (this.xlab0.textField.textWidth + this.xlab1.textField.textWidth))/2;
            this.xlab1.x = this.xlab0.x + this.xlab0.textField.textWidth;
        } 
        
        else {
            this.xlab0.visible = this.xlab1.visible = false;
            this.lab.visible = true;
            this.lab.text = `${this.toPercentStr(vo.percent)}%`;
        }

    }

    /**百分比 */
    private toPercentStr(percent:number) {
        let v = percent / 10000 * 100;
        if(v == Math.floor(v)){
            return v;
        }
        let s = v.toFixed(1);
        return s;
    }
}