import { stCellValue } from "../../../../network/protocols/BaseProto";
// import { GameconfigProxy } from "../model/EquipmentProxy";
import { EAttrType, ECellType } from "./ECellType";

export class PlayerVoFactory {

    public static getVal(moneyInfo: stCellValue[], type: ECellType | EAttrType) {
        if (moneyInfo) {
            let moneyList: stCellValue[] = moneyInfo;
            for (let i = 0; i < moneyList.length; i++) {
                let money = moneyList[i];
                if (money.id == type) {
                    return money.count;
                }
            }
        }
        return 0;
    }

    public static str2stCellValue(v:string){
        let arr = v.split("-");
        let vo = new stCellValue();
        vo.id = parseInt(arr[0]);
        vo.count = parseInt(arr[1]);
        return vo;
    }

    // public static initShowAttr():EAttrType[] {
    //     let showAttrType = [];
    //     let _list: Configs.t_gameconfig_dat[] = GameconfigProxy.Ins.List;
    //     for (let i = 0; i < _list.length; i++) {
    //         let _cfg = _list[i];
    //         if (_cfg.f_showattr) {
    //             showAttrType.push(_cfg.f_id);
    //         }
    //     }
    //     return showAttrType;
    // }

    /**根据类型获取属性值 */
    // public static getValString(moneyList: stCellValue[],type:number){
    //     if(moneyList){
    //         for (let i = 0; i < moneyList.length; i++) {
    //             let money = moneyList[i];
    //             if (money.id == type) {
    //                 return attrConvert(money.id,money.count);
    //             }
    //         }
    //     }
    //     let cfg:Configs.t_gameconfig_dat = GameconfigProxy.Ins.GetDataById(type);
    //     if(cfg.f_per == 1){
    //         return "0.00%"
    //     }
    //     return "0";
    // }

    /**合并属性 */
    public static mergeAttr(arr:string[]|string,sl:string = ":"){
        if(typeof arr == "string"){
            if (arr.length > 0 && arr.substr(arr.length - 1, 1) == "|") {
                arr = arr.substr(0,arr.length-1);
            }
            arr = [arr];
        }

        let _attrMaps = {};
        for (let i = 0; i < arr.length; i++) {
            let s = arr[i];
            if (s.length > 0) {
                let a = s.split("|");
                for (let n = 0; n < a.length; n++) {
                    let s1 = a[n].split(sl);
                    let id = parseInt(s1[0]);
                    let val = parseInt(s1[1]);
                    if (!_attrMaps[id]) {
                        _attrMaps[id] = 0;
                    }
                    _attrMaps[id] += val;
                }
            }
        }
        let str = "";
        for(let n in _attrMaps){
            str += n+sl+_attrMaps[n]+"|";
            delete _attrMaps[n];
        }
        if (str.length > 0) {
            str = str.substr(0, str.length - 1);
        }
        if(str.length > 0){
            return str.split("|");
        }
        return [];
    }
}

export class PlayerVoCtl {
    /*基础信息*/
    public moneyInfo: stCellValue[];

    public get plus() {
        return PlayerVoFactory.getVal(this.moneyInfo,ECellType.BATTLE);
    }
}