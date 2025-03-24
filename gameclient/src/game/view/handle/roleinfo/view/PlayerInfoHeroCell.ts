import { RowMoveBaseNode } from "../../../../../frame/view/ScrollPanelControl";
import { ui } from "../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { stFCard, stHero, stTreasure } from "../../../../network/protocols/BaseProto";
import { ISimpleEffect } from "../../avatar/NoContainerSimpleEffect";
import { SpineEffectMgr } from "../../avatar/SpineEffectMgr";
import { FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { t_Hero_Skin } from "../../towertmainhero/proxy/t_Hero_Skin";
import { t_Treasure } from "../../towertmainlinbao/proxy/t_Treasure";
import { t_Treasure_Upgrade } from "../../towertmainlinbao/proxy/t_Treasure_Upgrade";
// import { IInfoCardId, IInfoHeroVo, IInfoSkinId, IInfoTreasure, IPlayerInfoCls } from ".";
export enum ERolePlayerInfo{
    /**英雄 */
    Hero = 0,
    /**皮肤 */
    Skin = 1,
    /**卡牌 */
    Card = 2,
    /**灵宝 */
    LingBao = 3,
}

/**皮肤接口 */
interface IPlayerInfoSkin{
    refresh(data);
    x:number;
    y:number;
    width:number;
}

/**基础Node*/
class PlayerInfoBaseCellNode extends RowMoveBaseNode {
    protected clsKey:string = "";
    protected get cls(){
        // return Laya.ClassUtils.getClass(this.clsKey);
        return null;
    }
    protected createSkin() {
        return Laya.Pool.getItemByClass(this.clsKey, this.cls);
    }
    protected createNode(index: any) {
        let vo = this.list[index];
        // this.clsKey = vo.clsName;
        let _skin:IPlayerInfoSkin = this.createSkin() as any;
        _skin.refresh(vo);
        _skin.x = index * _skin.width;
        _skin.y = this.y;
        return _skin;
    }
}
//=========================================================================================
/**神话英雄展示 */
class PlayerHeroCellSkin extends ui.views.rank.ui_player_hero_cellUI implements IPlayerInfoSkin{
    private avatar:HeroAvatarView;
    constructor() {
        super();
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }
    private onUnDisplay(){
        this.disposeHero();
    }
    private disposeHero(){
        if(this.avatar){
            this.avatar.dispose();
            this.avatar = null;
        }
    }
    refresh(data:stHero) {
        let _cfg = HeroListProxy.Ins.getCfgById(data.id);
        DebugUtil.drawTF(this,`${_cfg.f_qua} ${data.level} ${_cfg.f_rank}`);

        this.disposeHero();
        this.avatar = FightFactory.createBigHeroAvatar(data.id, this.heroCon);
        this.lvTf.text = `${E.getLang("LV")}${data.level}`;
        this.nameTf.text = HeroListProxy.Ins.getCfgById(data.id).f_hero;
    }
}

/**英雄皮肤 */
class PlayerHeroSkin extends ui.views.rank.ui_player_hero_skin_cellUI implements IPlayerInfoSkin{
    private skinId:number;
    private _spineEff:ISimpleEffect;
    constructor(){
        super();
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
        this.on(Laya.Event.CLICK,this,this.onClick)
    }
    private onClick(){
        E.ViewMgr.Open(EViewType.HeroSkinView,null,this.skinId);
    }
    private onUnDisplay(){
        this.disposeEffect();
    }
    private disposeEffect(){
        if(this._spineEff){
            this._spineEff.dispose();
            this._spineEff = null;
        }
    }
    refresh(skinId:number){
        this.disposeEffect();
        // if(Laya.Utils.getQueryString("skillId")){
        //     skinId = parseInt(Laya.Utils.getQueryString("skillId"));
        // }
        this.skinId = skinId;
        let cfg = t_Hero_Skin.Ins.getCfgById(skinId);
        this.img.skin = `o/heroskinicon/${cfg.f_picshow}.png`;
        if(!StringUtil.IsNullOrEmpty(cfg.f_qua_label)){
            
            let type = parseInt(cfg.f_qua_label.split("-")[0]);
            let url = cfg.f_qua_label.split("-")[1];
            let scale:number = parseInt(System_RefreshTimeProxy.Ins.getVal(117)) / 10000;
            if(type == 1){
                this.signImg.skin = `o/illustrationqua/${url}.png`;
                this.signImg.scaleX = this.signImg.scaleY = scale;
            }else if(type == 2){
                this.signImg.skin = "";
                this._spineEff = SpineEffectMgr.createIllustration(cfg,this.eff,scale);
            }
        }
        this.nameTf.text = cfg.f_skin_name;
    }
}
/**卡牌 */
class CardSkin extends ui.views.rank.ui_player_card_cellUI implements IPlayerInfoSkin{
    constructor(){
        super();
    }
    refresh(data:stFCard){
        let cfg = t_Function_Card.Ins.getCfgById(data.id);
        this.icon.cfg = cfg;
        this.nameTf.text = cfg.f_card_name;
    }
}
/**灵宝 */
class TreasureSkin extends ui.views.rank.ui_info_lingbao_cellUI implements IPlayerInfoSkin{
    refresh(data:stTreasure){
        let _updateCfg = t_Treasure_Upgrade.Ins.getCfgByIdAndLv(data.id,data.level);
        let _cfg:Configs.t_Treasure_dat = t_Treasure.Ins.getCfgById(data.id);
        this.lv_lab.text = E.getLang("LV") + _updateCfg.f_treasure_level;
        this.name_lab.text = _cfg.f_treasure_name;
        this.icon1.skin = t_Treasure.Ins.getIcon(_cfg.f_icon);
        this.img.skin = t_Treasure.Ins.getQuaSkin(_cfg.f_qua);
        DebugUtil.drawTF(this,`${_cfg.f_qua} ${data.level} ${_cfg.f_rank}`);
    }
}
//==========================================================================================
export class PlayerInfoHeroCellNode extends PlayerInfoBaseCellNode{
    protected clsKey:string = "PlayerHeroCellSkin";
    protected get cls(){
        return PlayerHeroCellSkin;
    }
}
export class PlayerHeroSkinNode extends PlayerInfoBaseCellNode{
    protected clsKey:string = "PlayerHeroSkin";
    protected get cls(){
        return PlayerHeroSkin;
    }
}
export class CardSkinNode extends PlayerInfoBaseCellNode{
    protected clsKey:string = "CardSkin";
    protected get cls(){
        return CardSkin;
    }
}
export class TreasureSkinNode extends PlayerInfoBaseCellNode{
    protected clsKey:string = "TreasureSkin";
    protected get cls(){
        return TreasureSkin;
    }
}
//==========================================================================================