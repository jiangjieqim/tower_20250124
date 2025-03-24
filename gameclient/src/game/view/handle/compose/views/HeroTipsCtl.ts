// import { DebugUtil } from "../../../../../frame/util/DebugUtil";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { stCellValue, stElement, WatchHero_revc } from "../../../../network/protocols/BaseProto";
import { SkillListProxy } from "../../skill/proxy/SkillProxy";
import { SkillItem } from "../../skill/view/SkillItem";
import { TowertMainHeroModel } from "../../towertmainhero/model/TowertMainHeroModel";
import { ETowerAttr, HeroListLvProxy, HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { ComposeEvent } from "../ComposeEvent";
import { ComposeModel } from "../ComposeModel";
import { FightFactory } from "../FightFactory";
import { FightUIFactory } from "../FightUIFactory";
import { EFightUIColor } from "../vos/EFightEnum";
import { HeroWeight } from "../vos/HeroWeight";
import { HeroInfoDebugShow } from "./cells/HeroInfoDebugShow";
import { HeroAvatarView } from "./HeroAvatarView";
export interface IHeroTipsSkin extends Laya.View {
    typeTf: Laya.Label;
    nameTf: Laya.Label;
    // avatarCon: Laya.Sprite;
    skillList: Laya.List;
    // heroList:Laya.List;
    ht: Laya.HTMLDivElement;
    skillNametf: Laya.Label;
    icon1: Laya.Image;
    /**当前的攻击力 */
    lab_gj: Laya.Label;
    lab_sd: Laya.Label;
    lab_gj1: Laya.Label;
    lab_gj2: Laya.Label;
    // bg:Laya.Image;
    // bg2:Laya.Image;
}

class SkillItemTips extends SkillItem {
    ctl: HeroTipsCtl;
    protected onClick() {
        this.ctl.setSkillDesc(this.dataSource);
    }
}

/**英雄Cell */
class HeroViewCell extends ui.views.compose.ui_herotipcellUI {
    constructor(){
        super();
        // this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }
    // private onUnDisplay(){
    // Laya.Loader.clearTextureRes(this.icon.skin);
    // }
    refresh(self:boolean) {
        let heroId: number = this.dataSource;
        let imageId:number = 0;
        if(self){
            imageId = TowertMainHeroModel.Ins.getImageIdById(heroId);
        }else{
            imageId = TowertMainHeroModel.Ins.getDefImageIdById(heroId);
        }
        let _heroCfg = HeroListProxy.Ins.getCfgById(heroId);
        this.qua.skin = HeroListProxy.Ins.getSmallQuaSkin(_heroCfg.f_qua);
        this.icon.skin = HeroListProxy.Ins.getSmallIconSkin(imageId);
        this.tf.text = `${HeroWeight.calPercent(heroId)}%`;
    }
}
export class HeroTipsCtl {
    skin: IHeroTipsSkin;
    /**当前的英雄等级 */
    private lv:number = 1;
    private compHeroIds: number[];
    private heroId: number;
    private uid: number;
    private heroVo:stElement;
    private _heroAnim: HeroAvatarView;
    private model: ComposeModel;
    constructor() {
        this.model = ComposeModel.Ins;
    }

    private updateHeros(_heroCfg: Configs.t_Hero_dat) {
        let heroList: Laya.List = this.skin["heroList"];
        if (heroList && this.compHeroIds.length > 0) {
            heroList.itemRender = HeroViewCell;
            heroList.renderHandler = new Laya.Handler(this, this.onHeroViewCell);
            let _heroIds = this.compHeroIds;
            heroList.array = _heroIds;
            if (_heroIds.length) {
                heroList.width = _heroIds.length * 80;
            }
        }
    }
    setData(uid: number, heroIds: number[],offsetX:number,offsetY:number) {
        DebugUtil.draw(this.skin, "#ff0000");
        this.compHeroIds = heroIds;
        // let req:WatchHero_req = new WatchHero_req();
        let vo = this.model.getHeroVo(uid);
        this.heroVo = vo;
        this.heroId = vo.fid;
        this.uid = uid;
        FightUIFactory.bindHtml(this.skin.ht);

        let _heroCfg: Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(this.heroId);
        this.skin.typeTf.text = E.LangMgr.getLang("f_occupation_" + _heroCfg.f_occupation);
        this.skin.nameTf.text = _heroCfg.f_hero;

        this.disposeMonster();
        this._heroAnim = FightFactory.createByStElement(vo,this.skin,offsetX,offsetY);
        // FightFactory.createHeroAvatar(this.heroId, this.skin,offsetX,offsetY,0,undefined,undefined,undefined,undefined,undefined,4);
        
        this.skin.skillList.itemRender = SkillItemTips;
        this.skin.skillList.renderHandler = new Laya.Handler(this, this.onRenderHandler);
        this.skin.skillList.array = [];
        // this.updateSkill();

        this.updateHeros(_heroCfg);

        this.model.once(ComposeEvent.WatchHero, this, this.onWatchHero);
        this.model.curAdapter.watchHero(uid);

        // if(initConfig.enable_watch_hero){
        // FightGuideUtils.clientWatchHero(uid);
        // }
    }

    private updateSkill(){
        // let data = TowertMainHeroModel.Ins.getHeroById(this.heroId);
        // if(!data)return;
        
        // let cfg = HeroListLvProxy.Ins.getCfgByIdAndLv(data.id,data.level);
        let cfg = HeroListLvProxy.Ins.getCfgByIdAndLv(this.heroId,this.lv);
        if(cfg){
            let arr =  cfg.f_client_skill_des.split("|");
            this.skin.skillList.array = arr;
            this.skin.skillList.width = arr.length * 96;
            this.setSkillDesc(arr[0]);
        }
    }

    private onWatchHero(revc: WatchHero_revc) {
        let attrs: stCellValue[] = revc.datalist;
        if (this.uid != revc.uid) {
            return;
        }
        // console.log(attrs);
        let lv = revc.lv;//英雄等级
        this.lv = lv;

        if(debug){
            this.skin.addComponent(HeroInfoDebugShow).revc = revc;
        }

        //攻击力        
        let _cfg = HeroListLvProxy.Ins.getCfgByIdAndLv(this.heroId, lv);
        let cur: number = parseInt(_cfg.f_10002.split(":")[1]);
        let v0 = "";
        let _color1:string = EFightUIColor.Green;
        let atk = attrs.find(o => o.id == ETowerAttr.Atk);
        if (atk && atk.count > 0) {
            let sub = atk.count - cur;
            if (sub > 0) {
                v0 = `+${sub}`;
            }
            else if(sub < 0){
                v0 = "-" + Math.abs(sub);
                _color1 = EFightUIColor.Red;
            }
        }
        this.skin.lab_gj.text = `${cur}`;
        this.skin.lab_gj1.text = v0;
        this.skin.lab_gj1.color = _color1;
        //================================================================================
        let _heroCfg: Configs.t_Hero_dat = HeroListProxy.Ins.getCfgById(this.heroId);
        //t_hero Math.floor((1000/_heroCfg.f_base_attack_time).toFixed(1)) + ""
        let ms = HeroListProxy.Ins.getAttrVal(_heroCfg,ETowerAttr.AtkGapMs);//攻击间隔
        let f_base_attack_time = 1000 / ms;
        let baseVal: number = parseFloat(f_base_attack_time.toFixed(1));
        // let speedAttr = attrs.find(o => o.id == ETowerAttrType.AtkSpeed);
        let v1 = "";
        // if (speedAttr && speedAttr.count > 0) {
        // v1 = `+${((speedAttr.count / 10000) * f_base_attack_time).toFixed(1)}`;//
        // }
        // 读10008，除以10
        let vo1 = attrs.find(o => o.id == ETowerAttr.AtkGapMs);
        let _color:string = EFightUIColor.Green;
        if(vo1 && vo1.count > 0){
            let _new = vo1.count/10 - baseVal;
            // v1 =  "+"+(vo1.count/10).toFixed(1);
            let sub = _new;

            if(sub > 0){
                v1 =  "+"+sub.toFixed(1);
            }else if(sub < 0){
                v1 = "-" + Math.abs(sub).toFixed(1);
                _color = EFightUIColor.Red;
            }
        }
        this.skin.lab_sd.text = `${baseVal}`;
        this.skin.lab_gj2.text = `${v1}`;
        this.skin.lab_gj2.color = _color;
        this.updateSkill();
    }

    private onHeroViewCell(cell: HeroViewCell) {
        cell.refresh(this.heroVo && this.model.ownerPlayer && this.heroVo.playerId == this.model.ownerPlayer.playerId);
    }

    setSkillDesc(value: string) {
        let arr = value.split("-");
        let _id = parseInt(arr[1]);
        let cfg = SkillListProxy.Ins.getCfgById(_id);
        if (cfg) { 
            this.skin.skillNametf.text = cfg.f_skill_name;
            this.skin.icon1.skin = SkillListProxy.Ins.getIconByType(cfg);
            // Laya.timer.once(1000,this,this.onHtCallter,[cfg.f_skill_dsc]);
            this.skin.ht.innerHTML = cfg.f_skill_dsc;
            this.skin.ht.width = 350;
        }
    }
    // private onHtCallter(desc:string){
    // this.skin.ht.innerHTML = desc;
    // }
    private onRenderHandler(item: SkillItemTips) {
        item.ctl = this;
        item.setData(item.dataSource, this.lv);
    }
    private disposeMonster() {
        if (this._heroAnim) {
            this._heroAnim.dispose();
            this._heroAnim = null;
        }
    }
    onExit() {
        this.model.off(ComposeEvent.WatchHero, this, this.onWatchHero);
        this.disposeMonster();
    }
}