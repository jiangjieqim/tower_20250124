import { BaseModel } from "../../../../../frame/util/ctl/BaseModel";
import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { ActivityAction_req, ActivityExchange_req, CoverBigGooseBigPrize_revc, CoverBigGooseChange_revc, CoverBigGooseInit_revc, CoverBigGooseTask_revc, stCoverBigGooseTask } from "../../../../network/protocols/BaseProto";
import { SERVER_MSGID } from "../../../../network/protocols/ProtoDef";
import { SocketMgr } from "../../../../network/SocketMgr";
import { EActivityID } from "../../activity/ActivityEnum";
import { ActivityModel } from "../../activity/ActivityModel";
import { IShopBuyItem } from "../../common/ShopBuyView";
import { FightFactory } from "../../compose/FightFactory";
import { FunctionModel } from "../../funs/FunctionModel";
import { System_RefreshTimeProxy } from "../../main/ctl/System_RefreshTimeProxy";
import { EFuncDef } from "../../main/model/EFuncDef";
import { GameEvent } from "../../main/model/GameEvent";
import { ItemViewFactory } from "../../main/model/ItemViewFactory";
import { ItemProxy } from "../../main/proxy/ItemProxy";
import { ItemVo } from "../../main/vos/ItemVo";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { TaoDaeMainView } from "../view/TaoDaeMainView";
import { TaoDaePackageView } from "../view/TaoDaePackageView";
import { TaoDaeSelReward } from "../view/TaoDaeSelReward";
import { TaoDaeView } from "../view/TaoDaeView";
import { EGooseType, GooseConfig } from "./GooseConfig";
import { TaodaeEvent } from "./TaodaeEvent";
import { ETaodaeLingQu } from "./TaodaeFactory";
import { t_Cover_Big_Goose_config } from "./t_Cover_Big_Goose_config";
import { t_Cover_Big_Goose_Pack } from "./t_Cover_Big_Goose_Pack";
import { t_Cover_Big_Goose_reward } from "./t_Cover_Big_Goose_reward";

export class TaoDaeModel extends BaseModel{
    private _data:CoverBigGooseInit_revc;
    get bigPrize(){
        if(this._data){
            return this._data.bigPrize;
        }
        return 0;
    }
    get data(){
        return this._data;
    }
    oneNeedItem:ItemVo;
    tenNeedItem:ItemVo;
    public initMsg(): void {
        this.Reg(new TaoDaeMainView(EViewType.TaoDae));
        this.Reg(new TaoDaeView(EViewType.TaoDaeView));
        this.Reg(new TaoDaePackageView(EViewType.TaoDaePackageView));
        this.Reg(new TaoDaeSelReward(EViewType.TaoDaeSelReward));

        E.MsgMgr.AddMsg(SERVER_MSGID.CoverBigGooseInit,this.onCoverBigGooseInit,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.CoverBigGooseTask,this.onCoverBigGooseTask,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.CoverBigGooseBigPrize,this.onCoverBigGooseBigPrize,this);
        E.MsgMgr.AddMsg(SERVER_MSGID.CoverBigGooseChange,this.onCoverBigGooseChange,this);
    
        E.EventMgr.on(GameEvent.ActivityRedUpdate,this,this.onActivityRedUpdate);
    }

    private onActivityRedUpdate(){
        this.setRedTip();
    }
    private onCoverBigGooseChange(revc:CoverBigGooseChange_revc){    
        if(this._data){
            if(revc.type == 1){
                // this._data.datalist = revc.datalist;//重置
            }else{
                for(let i = 0; i< revc.datalist.length;i++){
                    let vo = revc.datalist[i];
                    let cellIndex = this._data.datalist.findIndex(o=>o.pos == vo.pos);
                    if(cellIndex!=-1){
                        this._data.datalist[cellIndex] = vo;
                    }else{
                        this._data.datalist.push(vo);
                    }
                }
                let needReset:boolean = false;
                for(let i = 0;i < revc.datalist.length;i++){
                    let vo = revc.datalist[i];
                    let tb:t_Cover_Big_Goose_config = E.tableMgr.getTable(t_Cover_Big_Goose_config.NAME);
                    let cfg = tb.getByPos(vo.pos);
                    if(cfg && cfg.f_goose_type == EGooseType.Gold){
                        //reset
                        needReset = true;
                    }
                    this.event(TaodaeEvent.PlayOneAnim,[vo]);
                }
                if(needReset){
                    this._data.datalist = [];
                    this.event(TaodaeEvent.Reset);
                }
            }
        }
        // this.event(TaodaeEvent.BigGooseChange);
    }
    get activityId(){
        return EActivityID.TaoDae;
    }

    /**购买确认 */
    private onOkBuyClick(value:IShopBuyItem,selCount:number){
        // LogSys.Log(cnt);
        let req = new ActivityExchange_req();
        req.activityId = this.activityId;
        req.cnt = selCount;
        SocketMgr.Ins.SendMessageBin(req);
    }

    useAction(cnt:number){
        // let s1 = System_RefreshTimeProxy.Ins.getVal(105);
        let _needVo = this.oneNeedItem;//ItemViewFactory.convertItem(s1);
        if(!TowerMainModel.Ins.isItemEnough(_needVo.cfgId,_needVo.count * cnt)){
            this.okBuy();
        }else{
            let req = new ActivityAction_req();
            req.activityId = this.activityId;
            req.extra = cnt.toString();
            SocketMgr.Ins.SendMessageBin(req);
        }
    }

    okBuy(){
        let _needVo = this.oneNeedItem;//ItemViewFactory.convertItem(s1);
        let vo = ItemViewFactory.convertItem(System_RefreshTimeProxy.Ins.getVal(110));
        TowerMainModel.Ins.buyItem(vo, _needVo, new Laya.Handler(this, this.onOkBuyClick));
    }

    public onInitCallBack(): void {
        // throw new Error("Method not implemented.");
        GooseConfig.mSkipAnim = false;
        let s1 = System_RefreshTimeProxy.Ins.getVal(105);
        this.oneNeedItem = ItemViewFactory.convertItem(s1);

        let vo = this.oneNeedItem.clone();
        vo.count *= 10;
        this.tenNeedItem = vo;
        //=============================================
        this._data = null;
        // this.bigPrize = 0;
    }
    private static _ins: TaoDaeModel;
    public static get Ins() {
        if (!this._ins) {
            this._ins = new TaoDaeModel();
        }
        return this._ins;
    }

    private onCoverBigGooseBigPrize(revc:CoverBigGooseBigPrize_revc){
        // this.bigPrize = revc.bigPrize;
        if(this._data){
            this._data.bigPrize = revc.bigPrize;
        }
        this.event(TaodaeEvent.UpdateBigPrize);
        this.setRedTip();
    }

    private onCoverBigGooseTask(revc:CoverBigGooseTask_revc){
        let tasks = this.tasks;
        let changeTasks = revc.tasks;
        for(let i = 0;i < changeTasks.length;i++){
            let cell = changeTasks[i];
            let vo = tasks.find(o=>o.id == cell.id );
            if(vo){
                vo.status = cell.status;
                vo.val = cell.val;
            }
        }
        this.event(TaodaeEvent.TaskChange);
        this.setRedTip();
    }

    private onCoverBigGooseInit(revc:CoverBigGooseInit_revc){
        this._data = revc;
        // this.bigPrize = this._data.bigPrize;
    }

    get tasks(){
        if(this._data){
            return this._data.tasks || [];
        }
        return [];
    }

    createHero(bigPrize:number,con:Laya.Sprite){
        let tb:t_Cover_Big_Goose_reward = E.tableMgr.getTable(t_Cover_Big_Goose_reward.NAME);
        let cfg:Configs.t_Cover_Big_Goose_reward_dat =  tb.GetDataById(bigPrize);
        let arr = cfg.f_reward.split("-")
        let itemCfg = ItemProxy.Ins.getCfg(parseInt(arr[0]));
        let heroCfg = HeroListProxy.Ins.getCfgById(parseInt(itemCfg.f_p1));
        let _hero = FightFactory.createBigHeroAvatar(heroCfg.f_heroid, con);
        return _hero;
    }
    /**
     * 
     * 套大鹅红点，
    1、任务完成能领奖励
    2、免费礼包
    3、大奖没选择
     * 
     */
    private setRedTip() {
        let b: boolean = false;
        if (!this.hasSelBigPrize) {
            b = true;
        }
        if (!b) {
            b = this.freeCanGet;
        }
        if (!b) {
            b = this.taskCanGet;
        }
        FunctionModel.Ins.funcSetRed(EFuncDef.Goose, b);
    }

    /**任务列表中是否有可领取的奖励 */
    get taskCanGet(){
        let _data = this._data;
        if(_data){
            let _tasks = _data.tasks;
            for(let i = 0;i < _tasks.length;i++){
                let vo = _tasks[i];
                if(vo.status == ETaodaeLingQu.CanGet){
                    return true;
                }
            }
        }
        return false;
    }

    /**有免费的可领取 */
    get freeCanGet(){
        let _cfgList:Configs.t_Cover_Big_Goose_Pack_dat[] = E.tableMgr.getTable(t_Cover_Big_Goose_Pack.NAME).List;
        for(let i = 0;i < _cfgList.length;i++){
            let cfg = _cfgList[i];
            if (cfg.f_recharge_id == 0) {
                //free
                let data = ActivityModel.Ins.getActivityData(this.activityId);
                let vo = data.datalist.find(o => o.id == cfg.f_id);
                let cnt: number = 0;
                if (vo) {
                    cnt = vo.param1;
                }
                if (cnt < cfg.f_limited_amount) {
                     return true;
                }
            }
            return false;
        }
    }

    /**是否有选择大奖 */
    get hasSelBigPrize(){
        return this.bigPrize !=0;
    }

    getBuyConunt(a:Configs.t_Cover_Big_Goose_Pack_dat){
        let activityId = this.activityId;
        let data = ActivityModel.Ins.getActivityData(activityId);

        let a1Count:number = 0;//已经购买的次数
        if(data){
            let vo = data.datalist.find(o=>o.id == a.f_id);
            if(vo){
                a1Count = vo.param1;
            }
        }
        return a1Count;
    }

    // 任务优先级
    // 1、已完成未领取
    // 2、未完成
    // 3、已完成已领取
    // 如果优先级相同，则id小的在上面
    onSortTask(a:Configs.t_Cover_Big_Goose_Task_dat,b:Configs.t_Cover_Big_Goose_Task_dat){
        let tasks = TaoDaeModel.Ins.tasks;
        let a1:stCoverBigGooseTask = tasks.find(o=>o.id == a.f_id);
        let b1:stCoverBigGooseTask = tasks.find(o=>o.id == b.f_id);

        //赋权==============================================
        let _priorityMap = {};
        _priorityMap[ETaodaeLingQu.CanGet] = 3;
        _priorityMap[ETaodaeLingQu.NotGet] = 2;
        _priorityMap[ETaodaeLingQu.IsGet] = 1;
        //==============================================

        if(_priorityMap[a1.status] > _priorityMap[b1.status]){
            return -1;
        }else if(_priorityMap[a1.status] < _priorityMap[b1.status]){
            return 1;
        }else{

            if(a1.id < b1.id){
                return -1;
            }
            else if(a1.id > b1.id){
                return 1;
            }
        }
        return 0;
    }

    /**
     * 礼包优先级
    1、购买次数未达上限
    2、购买次数已达上限
    如果优先级相同，则id小的在上面
     */
    onSortPackage(a:Configs.t_Cover_Big_Goose_Pack_dat,b:Configs.t_Cover_Big_Goose_Pack_dat){
        let a1count:number = TaoDaeModel.Ins.getBuyConunt(a);
        let b1count:number = TaoDaeModel.Ins.getBuyConunt(b);

        //设置a b的权重=========================================
        let aPriority = 0;
        let bPriority = 0;
        //=========================================

        if(a1count >= a.f_limited_amount){
            aPriority = 1;
        }

        if(b1count >= b.f_limited_amount){
            bPriority = 1;
        }

        if(aPriority > bPriority){
            return 1;
        }
        else if(aPriority < bPriority){
            return -1;
        }
        return 0;
    }
}