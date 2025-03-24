import { EViewType } from "../../../common/defines/EnumDefine";
import { E } from "../../../G";
import { stTimer } from "../../../network/protocols/BaseProto";
import { ActivityModel } from "../activity/ActivityModel";
import { ISmallTips } from "../main/interface/Interface";
import { EFuncDef } from "../main/model/EFuncDef";
import { MainModel } from "../main/model/MainModel";
import { t_Platform } from "../main/proxy/t_Platform";
import { EButtonStyle, FuncSmallIcon } from "../main/views/icon/FuncSmallIcon";
import { ItemVo } from "../main/vos/ItemVo";
import { TowerMainEvent } from "../towertmain/model/TowerMainEvent";
import { FuncProxy } from "./proxy/FunctionProxy";

export interface IRedNameKey{
    name:string;
    func_id:number;
}

export class FunctionModel extends Laya.EventDispatcher{
    private static _ins: FunctionModel;

    public funList:number[];
    public redList: number[];
    public stTimerList: stTimer[];

    public static get Ins() {
        if (!this._ins) {
            this._ins = new FunctionModel();
        }
        return this._ins;
    }

    constructor(){
        super();
        this.redList = [];
        this.funList = [];
        this.stTimerList = [];
    }

    /**
    * 功能是否开启
    */
    public isOpenByFuncId(funid: number, flag: boolean = true) {
        if(initConfig.enable_func){
            return true;
        }
        let index = this.funList.findIndex(ele => ele === funid);
        let cfg = FuncProxy.Ins.getCfgByFuncId(funid);
        
        if(!cfg){
            LogSys.Warn(`funid:${funid}配置未找到...`);
            return false;
        }
        
        if(index == -1){
            if(flag){
                if(cfg.f_trophy && cfg.f_level){
                    E.ViewMgr.ShowMidError(E.LangMgr.getLang("funcopentip3",cfg.f_trophy,cfg.f_level));
                }else if(cfg.f_trophy){
                    E.ViewMgr.ShowMidError(E.LangMgr.getLang("funcopentip1",cfg.f_trophy));
                }else if(cfg.f_level){
                    E.ViewMgr.ShowMidError(E.LangMgr.getLang("funcopentip2",cfg.f_level));
                }
            }
            return false;
        }

        if(cfg.f_close){
            return false;
        }

        if(cfg.f_activity_id){
            let data = ActivityModel.Ins.getActivityStatusData(cfg.f_activity_id);
            if(data && data.status == 0){
                return false;
            }
        }

        if(t_Platform.Ins.isClose(funid)){
            return false;
        }
        
        if(MainModel.Ins.isVerify(cfg)){
            return false;
        }

        if (cfg.t_tab_func != "") {
            if (!this.isTabOpen(cfg.t_tab_func)) {
                return false;
            }
        }

        return true;
    }

    private isTabOpen(st:string){
        let arr = st.split("-");
        for(let i:number=0;i<arr.length;i++){
            if(FunctionModel.Ins.isOpenByFuncId(parseInt(arr[i]),false)){
                return true;
            }
        }
        return false;
    }

    /**子功能是否都开放了 */
    public isSubOpen(cfg: Configs.t_MainIcon_dat){
        /*
        if(cfg.f_ui_id){
            let _checkSubFuncList = MainIconProxy.Ins.getFuncListByF_ui_id(cfg.f_ui_id);
            if(_checkSubFuncList.length){
                let isOpen:boolean = false;
                for(let i = 0;i< _checkSubFuncList.length;i++){
                    let funid = _checkSubFuncList[i];
                    if(this.isOpenByFuncId(funid.toString())){
                        isOpen = true;
                        break;
                    }
                }
                return isOpen;
            }
        }
        return true;
        */
        return false;
    }

    /**设置红点 */
    public funcSetRed(fid: number, v: boolean) {
        let cfg = FuncProxy.Ins.getCfgByFuncId(fid)
        if (!cfg) {
            LogSys.Error(`not find funId:${fid}`);
            return;
        }
        if (v && cfg.f_close) {
            v = false;
        }

        let status: boolean = false;

        if (v) {
            let index: number = this.redList.indexOf(fid);
            if (index == -1) {
                this.redList.push(fid);
                status = true;
            }
        } else {
            let index: number = this.redList.indexOf(fid);
            if (index != -1) {
                this.delRed(fid);
                status = true;
            }
        }
        this.event(TowerMainEvent.FuncSmallIconUpdate);
    }

    private delRed(fid:number){
        for(let i = 0;i < this.redList.length;i++){
            let cell = this.redList[i];
            if(fid == cell){
                this.redList.splice(i,1);
                i--;
            }
        }
    }

    public getHasRed(funcId: number) {
        if (!this.isOpenByFuncId(funcId, false)) {
            return false;
        }

        let cfg = FuncProxy.Ins.getCfgByFuncId(funcId);
        if (cfg.t_tab_func != "") {
            return this.isTabRed(cfg.t_tab_func);
        } else {
            return this.redList.indexOf(funcId) != -1;
        }
    }

    private isTabRed(st:string){
        let arr = st.split("-");
        for(let i:number=0;i<arr.length;i++){
            if(FunctionModel.Ins.getHasRed(parseInt(arr[i]))){
                return true;
            }
        }
        return false;
    }

    /**显示tip */
    public showSmallTips(title: string, content: string, target, algin?: string) {
        let _smallTipsData: ISmallTips = {} as ISmallTips;
        _smallTipsData.content = content;
        _smallTipsData.title = title
        _smallTipsData.target = target;
        _smallTipsData.algin = algin;
        E.ViewMgr.Open(EViewType.SmallTips, null, _smallTipsData);

        // let _viewType = EViewType.SmallTips;
        // if (E.ViewMgr.isOpenReg(_viewType)) {
        // let view: TxtTipsView = E.ViewMgr.Get(_viewType) as TxtTipsView;
        // view.setData(_smallTipsData)
        // } else {
        // }
    }

    /**显示tip */
    public showItemTip(data: ItemVo, target) {
        let obj: any = {};
        obj.data = data;
        obj.target = target;
        E.ViewMgr.Close(EViewType.ItemTip);
        Laya.timer.callLater(this,()=>{
            E.ViewMgr.Open(EViewType.ItemTip, null, obj);
        });
    }

    /**显示tip */
    public showRewardTip(data: string, target, offX:number = 0 , offY:number = 0,algin?: string) {
        let obj: any = {};
        obj.data = data;
        obj.target = target;
        obj.offX = offX;
        obj.offY = offY;
        E.ViewMgr.Close(EViewType.RewardTip);
        Laya.timer.callLater(this,()=>{
            E.ViewMgr.Open(EViewType.RewardTip, null, obj);
        });
    }

    public showBoxTip(id: number, target, offX:number = 0 , offY:number = 0,algin?: string) {
        let obj: any = {};
        obj.id = id;
        obj.target = target;
        obj.offX = offX;
        obj.offY = offY;
        E.ViewMgr.Close(EViewType.BoxTip);
        Laya.timer.callLater(this,()=>{
            E.ViewMgr.Open(EViewType.BoxTip, null, obj);
        });
    }

    public createFuncIcon(name: string, funcId: EFuncDef, btnStyle: EButtonStyle): FuncSmallIcon {
        let o = MainModel.Ins.redNameKeyList.find(cell => cell.func_id == funcId);
        if (!o) {
            let obj: IRedNameKey = {} as IRedNameKey;
            obj.func_id = funcId;
            obj.name = name;
            MainModel.Ins.redNameKeyList.push(obj);
        }
        let icon = new FuncSmallIcon();
        icon.refresh(name, funcId, btnStyle);
        return icon;
    }
}