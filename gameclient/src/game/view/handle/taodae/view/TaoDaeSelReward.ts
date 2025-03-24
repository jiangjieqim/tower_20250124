import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { CoverBigGooseBigPrize_req } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { FightFactory } from "../../compose/FightFactory";
import { HeroAvatarView } from "../../compose/views/HeroAvatarView";
import { ItemProxy } from "../../main/proxy/ItemProxy";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { TaoDaeModel } from "../model/TaoDaeModel";
import { t_Cover_Big_Goose_reward } from "../model/t_Cover_Big_Goose_reward";

class TaodaeRewardItem extends ui.views.taodae.ui_taodae_reward_itemUI{
    cfg:Configs.t_Cover_Big_Goose_reward_dat;
    private _hero:HeroAvatarView;
    constructor(){
        super();
        this.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
        this.selected = false;
    }

    set selected(v:boolean){
        this.img.visible = v;
    }

    get selected(){
        return this.img.visible;
    }

    private onDisplay(){

    }
    private onUnDisplay(){
        this.disposeHero();
    }
    private disposeHero(){
        if(this._hero){
            this._hero.dispose();
            this._hero = null;
        }
    }
    refresh(){
        this.cfg = this.dataSource;
        let arr = this.cfg.f_reward.split("-")
        let itemCfg = ItemProxy.Ins.getCfg(parseInt(arr[0]));
        let heroCfg = HeroListProxy.Ins.getCfgById(parseInt(itemCfg.f_p1));
        this.namelb.text = heroCfg.f_hero;
        if(this._hero && this._hero.resId == heroCfg.f_heroid){
            //...
        }else{
            this.disposeHero();
            this._hero = FightFactory.createBigHeroAvatar(heroCfg.f_heroid, this.con);
        }
    }
}

export class TaoDaeSelReward extends ViewBase{
    protected autoFree:boolean = true;
    protected mMask:boolean = true;
    private _ui:ui.views.taodae.ui_taodae_sel_rewardUI;
    private canel_btn:ButtonCtl;
    private ok_btn:ButtonCtl;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }
    protected onExit(): void {
        // throw new Error("Method not implemented.");
        if(this.canel_btn){
            this.canel_btn.dispose();
            this.canel_btn = null;
        }
        if(this.ok_btn){
            this.ok_btn.dispose();
            this.ok_btn = null;
        }
    }
    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.UI = this._ui = new ui.views.taodae.ui_taodae_sel_rewardUI();
            this.bindClose(this._ui.close_btn);
            this.canel_btn = ButtonCtl.CreateBtn(this._ui.canel_btn,this,this.Close);
            this.ok_btn = ButtonCtl.CreateBtn(this._ui.ok_btn,this,this.onOkHandler);
            this._ui.list1.itemRender = TaodaeRewardItem;
            this._ui.list1.renderHandler = new Laya.Handler(this,this.onItemRender);
            this._ui.list1.selectEnable = true;
            this._ui.list1.selectHandler = new Laya.Handler(this,this.onSelectHandler);
        }
    }

    private onSelectHandler(index:number){
        for(let i = 0;i < this._ui.list1.length;i++){
            let cell:TaodaeRewardItem = this._ui.list1.getCell(i) as any;
            if(i == index){
                cell.selected = true;
            }else{
                cell.selected = false;
            }
        }
    }

    private onItemRender(item:TaodaeRewardItem){
        item.refresh();
    }

    /**确定 */
    private onOkHandler(){
        let cfg:Configs.t_Cover_Big_Goose_reward_dat;
        for(let i = 0;i < this._ui.list1.length;i++){
            let cell:TaodaeRewardItem = this._ui.list1.getCell(i) as any;
            if(cell.selected){
                cfg = cell.cfg;
                break;
            }
        }
        if(cfg && TaoDaeModel.Ins.bigPrize!=cfg.f_id){
            let req = new CoverBigGooseBigPrize_req();
            req.id = cfg.f_id;
            SocketMgr.Ins.SendMessageBin(req);
        }
        this.Close();
    }

    protected onInit(): void {
        // throw new Error("Method not implemented.");
        let list = (E.tableMgr.getTable(t_Cover_Big_Goose_reward.NAME) as t_Cover_Big_Goose_reward).getSelfList();
        this._ui.list1.array = list;
        this.selectbigPrize(list);
    }

    private selectbigPrize(list:Configs.t_Cover_Big_Goose_reward_dat[]){
        let id = TaoDaeModel.Ins.bigPrize;
        if(id){
            for(let i = 0;i < list.length;i++){
                let cfg = list[i];
                if(cfg.f_id == id){
                    this._ui.list1.selectedIndex = i;
                }
            }
        }
    }
    
}