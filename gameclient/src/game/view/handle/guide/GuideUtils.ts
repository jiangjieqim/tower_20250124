import { ScrollPanelControl } from "../../../../frame/view/ScrollPanelControl";
import { E } from "../../../G";
// import { ComposeDragGrid } from "../compose/views/ComposeDragGrid";
import { IFightMainView } from "../compose/vos/IFightMainView";

/**新手引导工具类 */
export class GuideUtils {
    // static gridItemList:ComposeDragGrid[];
    static guidestart:Laya.Handler;
    static shopEnoughHandler:Laya.Handler;

    static addMoney:Laya.Handler;

    static fight:IFightMainView;
    static _checkCount:number = 0;
    // static sellmenu:ComposeTips;
    private static convert(list1,type:number,arr:string[],__index:number){
        // let list1 = ui[arr[__index]];
        let skinNode;
        if(list1 instanceof Laya.Panel){
            //panel1-0-tiaozhanBtn
            let panel:Laya.Panel = list1;
            if(panel.dataSource instanceof ScrollPanelControl){
                let sc:ScrollPanelControl = panel.dataSource;
                let index = parseInt(arr[__index+1]);
                let skin = sc.getRowCol(index,0);
                if(skin){
                    skinNode = skin[arr[__index+2]];
                }
            }
        }else if(list1 instanceof Laya.List){
            //list-0-sel ------------>  (list)Laya.List的0号索引中的对象sel
            let item = list1.getCell(parseInt(arr[__index+1]));
            if(item){
                skinNode = item[arr[__index+2]];
            }
            if(skinNode){
                return skinNode;
            }
        }
        else if(arr.length == 4 && list1 instanceof Laya.View){
            let __index:number = 1;
            skinNode = this.convert(list1[arr[__index]],type,arr,__index);
            return skinNode;
        } 
        else {
            let key1 = arr[__index];
            let key2 = arr[__index + 1];
            
            let ui = E.ViewMgr.Get(type).UI;
            if(ui && ui[key1] && ui[key1][key2]){
                skinNode = ui[key1][key2];
            }
        }

        let ui = E.ViewMgr.Get(type).UI;
        if(ui){
            this._checkCount = 0;
            let temp = this.getTemp(ui,arr);
            if(temp){
                return temp;
            }
        }
        return skinNode;
    }

    private static getTemp(ui:Laya.View,arr:string[]){
        this._checkCount++;
        // if(this._checkCount > 1){
        // LogSys.Error(`_checkCount is ${this._checkCount}`);
        // }
        let temp = ui;
        //  27-con1-child0-btn
        for(let i = 0;i < arr.length;i++){
            let curKey = arr[i];

            const child = "child";
            if(curKey.indexOf(child) == 0){
                let childIndex = curKey.substr(child.length,curKey.length - child.length);
                if(temp && typeof temp.getChildAt == "function"){
                    if(temp instanceof Laya.List){
                        temp = (temp as any).getChildAt(0) as Laya.Box as any;
                    }
                    else if(temp instanceof Laya.Panel){
                        //gm("test2 4-sp-child0-panel-child4-lab1");
                        let panel = temp as Laya.Panel;
                        if(panel.dataSource instanceof ScrollPanelControl){
                            let sc:ScrollPanelControl = panel.dataSource;
                            let skin = sc.getSkinIndex(parseInt(childIndex));
                            if(skin){
                                temp = skin;
                                continue;
                            }
                        }
                    }
                    if(temp){
                        temp = temp.getChildAt(parseInt(childIndex)) as any;
                    }
                }
            }
            else if (curKey == "griduid") {
                let uid = parseInt(arr[1]);
                if (this.fight && this.fight.gridItemList) {
                    let cell = this.fight.gridItemList.find(o => o.data.uid == uid);
                    return cell;
                }
            }
            else if(curKey == "guidemonster"){
                //指引到怪物
                return this.fight && this.fight.getMonsterCellView(arr);
            }
            else if(curKey == "guidedoor"){
                return this.fight && this.fight.guideDoor(arr);
            }
            else if(curKey == "guidestart"){
                // FightGuide.Ins.start();
                if(this.guidestart){
                    this.guidestart.run();
                }
                return;
            }
            else{
                if(temp){
                    temp = temp[curKey];
                }else{
                    //return this.getTemp(ui,arr);
                    // LogSys.Warn(`convert找不到key:${curKey}!`);
                }
            }
        }
        return temp;
    }


    /**
     * 使用方法
     * let node = GuideUtils.getUIByKey(this.ViewType,"list1-0-bg1");
     * @param type
     * @param key 
     */
    private static getUIByKey(type: number, key: string) {
        // let type = parseInt(typesstr);
        let skinNode: Laya.Sprite;
        // if(this.IsOpen(type)){
        // LogSys.Log("type " + type + " is Open!");
        let arr = key.split("-");
        if (arr.length <= 1) {

            let iv = E.ViewMgr.Get(type);
            if (iv) {
                let ui = iv.UI;
                if (ui) {
                    skinNode = ui[key];
                }
            }
            if(skinNode){
                return skinNode;
            }
        }  
        if(!skinNode){
            let iv = E.ViewMgr.Get(type);
            if(iv){
                let ui = iv.UI;
                if (ui) {
                    let __index: number = 0;
                    skinNode = this.convert(ui[arr[__index]], type, arr, __index);
                }
            }
        }
        return skinNode;
    }
     public static getUIByKeySt(str:string){
        //  str = `4-sp-child0-boxList-child0-lab1`;
        let arr = str.split("-");
        let a = arr[0];
        let index:number = str.indexOf("-");
        let skin = this.getUIByKey(parseInt(a),str.substr(index+1,str.length-index-1));
        
        // if(skin && skin instanceof Laya.Image && skin.gray){
        //     LogSys.Warn(`your getUIByKeySt is Image ,is gray!`);
        //     return;
        // }
        return skin;
    }
}