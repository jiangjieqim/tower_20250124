import { CheckBox2Ctl } from "../../../../../frame/util/ctl/CheckBox2Ctl";
// import { CheckBoxCtl } from "../../../../../frame/view/CheckBoxCtl";
import { RedDotDel_req, RedDotUpdate_req, stRedDot } from "../../../../network/protocols/BaseProto";
import { SocketMgr } from "../../../../network/SocketMgr";
import { SelectListCtl } from "../ctl/SelectListCtl";
import { ERedEnum } from "./ERedEnum";
import { MainModel } from "./MainModel";

export interface ISaveData{
    id:number;
    val:number;
}

export class RedUpdateUtils {
public static refreshByConfig(ck: CheckBoxCtl |CheckBox2Ctl| SelectListCtl|Laya.Handler, redType: ERedEnum, defaultSel) {
    let id: number = redType as number;
    let o = MainModel.Ins.red.getByID(id);
    if (ck instanceof CheckBoxCtl || ck instanceof CheckBox2Ctl) {
        if (o) {
            ck.selected = o.type == 1;
        } else {
            ck.selected = defaultSel;
        }
    }else if(ck instanceof SelectListCtl){
        if (o) {
            ck.selectIndex(o.type);
        }else{
            ck.selectIndex(defaultSel);
        }
    }else if(ck instanceof Laya.Handler){
        if (o) {
            ck.runWith(o.type);
        }else{
            ck.runWith(defaultSel);
        }
    }
}
public static push(l1: ISaveData[], id: ERedEnum, ctl: CheckBoxCtl|CheckBox2Ctl | SelectListCtl|number) {
    let obj;
    if(ctl instanceof CheckBoxCtl || ctl instanceof CheckBox2Ctl){
        obj = {id :id,val:ctl.selected ? 1: 0} as ISaveData
    }else if(ctl instanceof SelectListCtl){
        obj = {id :id,val:ctl.curIndex} as ISaveData;
    }else if(typeof ctl == "number"){
        obj = {id :id,val:ctl} as ISaveData;
    }
    l1.push(obj);
}
}

export class RedUpdateModel extends Laya.EventDispatcher{
    public static UPDATA:string = "UPDATA";
    /**占位,空位的值 */
    public static NULL:number = 65535;
    /**红点列表 */
    public redList:stRedDot[] = [];


    public clear(){
        this.redList = [];
    }

    // private static _ins: RedUpdateModel;
    // public static get Ins() {
    //     if (!this._ins) {
    //         this._ins = new RedUpdateModel();
    //     }
    //     return this._ins;
    // }

    private delById(id:number){
        let out = [];
        for(let i = 0;i < this.redList.length;i++){
            let cell = this.redList[i];
            if(cell.id !=id){
                out.push(cell);
            }
        }
        this.redList = out;
    }

    private send(id:number,val:number){
        let have:boolean = false;
        let o = this.redList.find(cell=>cell.id == id && cell.type == val);

        // let index = this.redList.indexOf(o);
        // if(index!=-1){
        //     this.redList = this.redList.splice(index, 1);
        // }

        this.delById(id);

        let _cell2:stRedDot = new stRedDot();
        _cell2.id = id;
        _cell2.type = val;
        this.redList.push(_cell2);
        
        if(o){
            have = true;
        }
        // if(id == RedEnum.JJC_FIGHT){
        //     if(have){
        //         let zero = TimeUtil.curZeroTime;
        //         if(val > zero){
        //             // 当天的不上传
        //         }
        //     }
        // }
        if(have){
            return;
        }
        let _cell:stRedDot = new stRedDot();
        _cell.id = id;
        _cell.type = val;
        this.mod([_cell]);
    }

    private mod(l:stRedDot[]){
        let req = new RedDotUpdate_req();
        // let req = new RedMod_req();
        req.datalist = l;
        SocketMgr.Ins.SendMessageBin(req);
        // console.log("=====================>")
        // for(let i = 0;i < l.length;i++){
        //     let o = l[i];
        //     console.log("mod:"+o.id + " = " + o.type);
        // }
        this.event(RedUpdateModel.UPDATA);
    }

    public saveArr(l: ISaveData[]) {
        for(let i = 0;i < l.length;i++){
            let o = l[i];
            this.send(o.id,o.val);
        }
    }

    /**提交 */
    public save(id:number,val:number = 1){
        this.send(id,val);
    }

    /**删除 */
    public del(id:number){
        let o = this.redList.find(cell=>cell.id == id);
        if(o){
            let index = this.redList.indexOf(o);
            this.redList.splice(index,1);
            this.protoDel([id]);
        }
    }

    private protoDel(arr){
        let req:RedDotDel_req = new RedDotDel_req();
        req.datalist = arr;
        SocketMgr.Ins.SendMessageBin(req);

        // console.log("del red============>"+arr);
        this.event(RedUpdateModel.UPDATA);
    }

    public delArr(arr:number[]){
        let idsArr:number[] = [];
        for(let i = 0;i < arr.length;i++){
            let cellId = arr[i];
            let o = this.redList.find(cell=>cell.id == cellId);
            if(o){
                let index = this.redList.indexOf(o);
                if(index!=0){
                    this.redList.splice(index,1);
                    idsArr.push(o.id);
                }               
            }
        }

        if (idsArr.length > 0) {
            // let req: RedDotDel_req = new RedDotDel_req();
            // req.datalist = idsArr;
            // SocketMgr.Ins.SendMessageBin(req);
            // this.event(RedUpdateModel.UPDATA);
            this.protoDel(idsArr);
        }
    }


    public getByID(id: number): stRedDot {
        return this.redList.find(cell => cell.id == id);
    }

    public getValByID(id: number):number {
        let o = this.redList.find(cell => cell.id == id);
        if(o){
            return o.type;
        }
        return;
    }

    // public addRedImg(con: Laya.Sprite, offsetX: number = -20, offsetY: number = -10) {
    //     let red = new Laya.Image();
    //     red.skin = `remote/main/main/reddot.png`;
    //     red.x = con.width + offsetX;
    //     red.y = offsetY;
    //     con.addChild(red);
    //     return red;
    // }
}