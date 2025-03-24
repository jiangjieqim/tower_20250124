import { stCellValue } from "../../../../network/protocols/BaseProto";
import { MainModel } from "../model/MainModel";
import { ItemProxy } from "../proxy/ItemProxy";
import { EAttrType, ECellType } from "./ECellType";
import { ItemVo } from "./ItemVo";
import { MainBaseVo } from "./MainBaseVo";
import { PlayerVoFactory } from "./PlayerVoFactory";

/**
 * 属性转化
 */
// export function attrConvert(id:number,count:number){
//     let proxy:GameconfigProxy = GameconfigProxy.Ins;
//     let cfg:Configs.t_gameconfig_dat = proxy.GetDataById(id);
//     if(cfg){
//         if(cfg.f_per == 1){
//             return (count / 100).toFixed(2) + "%";
//         }
//         return count.toString();
//     }
//     return count.toString();
// }

/**
 * 主角数据
 */
export class MainRoleVo extends MainBaseVo{
    /**登录的天数 */
    login_count:number;

    /**进入次数 */
    enter_count:number;

    /**当前的用户头像 */
    public get headUrl(){
        let headUrl = MainModel.Ins.convertHead(this.mPlayer.HeadUrl);
        return headUrl
    }


    public getVal(type: ECellType|EAttrType) {
        return PlayerVoFactory.getVal(this.moneyInfo,type);
    }
    /**战斗力 */
    public get plus() {
        return this.getVal(ECellType.BATTLE);
    }


    /**铜钱 */
    public get copper(){
        return this.getVal(ECellType.JINBI);
    }

    /**钻石 元宝*/
    public get gold(){
        return this.getVal(ECellType.SHUIJING);
    }
    
    public get moneyInfo(){
        return this.mBaseInfo && this.mBaseInfo.moneyInfo;
    }

    /**
     * 设置玩家属性(改值或者添值)
     */
    public setAttr(type:EAttrType,val:number){
        let mBaseInfo = this.mBaseInfo;
        if(mBaseInfo){
            let moneyList: stCellValue[] = mBaseInfo.moneyInfo;
            if(moneyList){
                let b = false;
                for (let i = 0; i < moneyList.length; i++) {
                    let _cell = moneyList[i];
                    if (_cell.id == type) {
                        _cell.count = val;
                        b = true;
                        break;
                    }
                }
                if(!b){
                    let cellVo = new stCellValue()
                    cellVo.id = type;
                    cellVo.count = val;
                    moneyList.push(cellVo);
                }
            }
        }
    }

    /**
     * 战斗力
     */
    public getBattleValue(){
        return this.getVal(ECellType.BATTLE);
    }

    public getName() {
        if (this.mPlayer) {
            return StringUtil.convertName(this.NickName);
        }
        return "";
    }

    public getItemVoListBySubtype(subType:number):ItemVo[]{
        let l:ItemVo[] = [];
        let itemIdList:number[] = ItemProxy.Ins.getSubTypeList(subType);
        for(let i = 0;i < itemIdList.length;i++){
            let id = itemIdList[i];
            let count = this.getVal(id);
            if (count > 0) {
                let itemVo = new ItemVo();
                itemVo.cfgId = id;
                itemVo.count = count;
                l.push(itemVo);
            }
        }
        return l;
    }
}