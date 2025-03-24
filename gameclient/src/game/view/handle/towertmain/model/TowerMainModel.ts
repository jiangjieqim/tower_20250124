import { EViewType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { stCellValue, ValChanel_revc } from "../../../../network/protocols/BaseProto";
import { EBuyType, IShopBuyItem } from "../../common/ShopBuyView";
import { ComposeModel } from "../../compose/ComposeModel";
import { GuideModel } from "../../guide/GuideModel";
import { MainModel } from "../../main/model/MainModel";
import { ItemProxy } from "../../main/proxy/ItemProxy";
import { ItemVo } from "../../main/vos/ItemVo";
import { TowerMainEvent } from "./TowerMainEvent";
import { TowerMainFightModel } from "./TowerMainFightModel";

export class TowerMainModel extends Laya.EventDispatcher{
    private static _ins: TowerMainModel;
    
    public static get Ins() {
        if (!this._ins) {
            this._ins = new TowerMainModel();
        }
        return this._ins;
    } 

    constructor(){
        super();
        TowerMainFightModel.Ins.isItemEnoughSt = this.isItemEnoughSt;
        GuideModel.Ins.towerModel = this;
    }

    public ValChanel(data:ValChanel_revc){
        let _cellList:stCellValue[] = data.itemList;
        for(let i = 0;i < _cellList.length;i++){
            let cell:stCellValue = _cellList[i];

            // if(cell.id == ECellType.FIGHT_STONE){
            //     LogSys.Log(`------>ValChanel${cell.id} ---> ${cell.count}`);
            // }

            MainModel.Ins.mRoleData.setAttr(cell.id,cell.count);
            this.event(TowerMainEvent.ValChangeCell,cell.id);
        }
        this.event(TowerMainEvent.ValChange);
    }

    public isItemEnough(itemid:number,count:number,tips:boolean=false){
        let have = MainModel.Ins.mRoleData.getVal(itemid);
        let _status:boolean = false;
        if(have >= count){
            _status = true;
        }
        if(!_status && tips){
            let itemCfg:Configs.t_Item_dat = ItemProxy.Ins.getCfg(itemid);
            E.ViewMgr.ShowMidError(`${itemCfg.f_name}`+E.getLang("NotEnough"));
        }
        return _status;
    }

    /**
     * 
     * @param st "23-3"
     * @param tips 
     */
    public isItemEnoughSt(st:string,tips:boolean=false){
        // let itemid = parseInt(st.split("-")[0]);
        // let count = parseInt(st.split("-")[1]);
        // let have = MainModel.Ins.mRoleData.getVal(itemid);
        // let _status:boolean = false;
        // if(have >= count){
        //     _status = true;
        // }
        // if(!_status && tips){
        //     let itemCfg:Configs.t_Item_dat = ItemProxy.Ins.getCfg(itemid);
        //     let str:string = E.getLang("itemnotenough",itemCfg.f_name);
        //     E.ViewMgr.ShowMidError(str);
        // }
        // return _status;
        return ComposeModel.Ins.curAdapter.isItemEnoughSt(st,tips);
    }

    public isItemEnoughStArr(st:string,tips:boolean=false){
        let arr = st.split("|");
        for(let i:number=0;i<arr.length;i++){
            if(!this.isItemEnoughSt(arr[i],tips)){
                return false;
            }
        }
        return true;
    }

    public sortList(list:any[]){
        let arr = [];
        let arr1 = [];
        let arr2 = [];
        for(let i:number=0;i<list.length;i++){
            if(list[i].status == 1){
                arr.push(list[i]);
            }else if(list[i].status == 0){
                arr1.push(list[i]);
            }else if(list[i].status == 2){
                arr2.push(list[i]);
            }
        }
        return arr.concat(arr1).concat(arr2);
    }

    /**
    * 通用的购买界面
    * @param needItemId 需要的物品id
    * @param needCount 需要的数量
    * @param targetId 获得的物品id
    * @param targetCount 获得的数量
    * @param okHandler 确认回调
    * @param notClose true 购买完成之后不关闭该界面
    */
    private buy(needItemId: number, needCount: number, targetId: number, targetCount: number, okHandler: Laya.Handler, type: EBuyType = EBuyType.Item, notClose: boolean = false, param?, maxCheckHandler?: Laya.Handler) {
        let cell = {} as IShopBuyItem;
        // cell.ok = okHandler;
        cell.needCount = needCount;
        cell.needItemId = needItemId;
        cell.targetId = targetId;
        cell.targetCount = targetCount;
        cell.ok = okHandler;
        cell.type = type || EBuyType.Item;
        cell.buyEndNotClose = notClose;
        cell.param = param;
        cell.maxCheckHandler = maxCheckHandler;
        E.ViewMgr.Open(EViewType.ShopBuy, null, cell);
    }

    public buyItem(inItem: ItemVo, outItem: ItemVo, okHandler: Laya.Handler, type: EBuyType = EBuyType.Item, notClose: boolean = false, param?, maxCheckHandler?: Laya.Handler) {
        this.buy(inItem.cfgId, inItem.count, outItem.cfgId, outItem.count, okHandler, type, notClose, param, maxCheckHandler);
    }
}
