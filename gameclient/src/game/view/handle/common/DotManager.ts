import { MainModel } from "../main/model/MainModel";
import { FunctionModel } from "../funs/FunctionModel";
interface IDotButton {
    dot: Laya.Image;
}
export class DotManager {
    public static addDot(sp: Laya.Sprite, x: number = 0, y: number = 0) {
        let imgS = sp.getChildByName("dot");
        if (imgS) {
            return;
        }
        var img = Laya.Pool.getItemByClass("DotManager", Laya.Image);
        img.skin = "remote/base/reddot.png";
        img.name = "dot";
        img.x = sp.width + x - 35;
        img.y = y;
        sp.addChild(img);
    }

    public static removeDot(sp: Laya.Sprite) {
        let img = sp.getChildByName("dot");
        if (img) {
            img.removeSelf();
        }
    }

    private static setRed(str:string,v:boolean){
        let len = 4;
        let funcid:number = 0;

        if(str.substr(0,len) == "icon"){
            /*
            // 中间按钮 t_MainIcon f_mid_pos
            let id = parseInt(str.substr(len,str.length-len));
            // console.log(id);
            let l:Configs.t_MainIcon_dat[] =  MainIconProxy.Ins.List;
            // let cfg = l.find(cell => cell.f_mid_pos != 0 && cell.f_mid_pos - 1 == id);
            let cfg = l.find(cell=>cell.f_mid_name == str);
            if(cfg){
                funcid = parseInt(cfg.f_funid);
            }
            */
        }else{
            let s = MainModel.Ins.redNameKeyList.find(o=>o.name == str);
            if(s){
                funcid = s.func_id;
            }
        }
        if(funcid){
            FunctionModel.Ins.funcSetRed(funcid,v);
        }else{
            LogSys.Warn("not find:" + str);
        }
    }

    public static addMainDot(str: string, x: number = 0, y: number = 0) {
        this.setRed(str,true);


/*
        let key = EViewType.Main + "-" + str;
        let sp: IDotButton = E.ViewMgr.getUIByKeySt(key) as any;
        if (sp) {
            
            // let cell = MainModel.Ins.isFromDc(key)
            // if (cell) {
            //     cell.visible = true;
            // } else {
            //     // this.addDot(sp,x + 20,y + 10);
            //     LogSys.Warn("key not reg!!!" + str);
            // }
            
            if (typeof sp.dot == "object") {
                sp.dot.visible = true;
            }
        }
*/
    }

    public static remMainDot(str: string) {
        this.setRed(str,false);

        /*
        let key = EViewType.Main + "-" + str;

        let sp: IDotButton = E.ViewMgr.getUIByKeySt(key) as any;;
        if (sp) {
            
            // let cell = MainModel.Ins.isFromDc(key)
            // if(cell){
            //     cell.visible = false;
            // }else{
            //     this.removeDot(sp);
            // }
            
            if (typeof sp.dot == "object") {
                sp.dot.visible = false;
            }
        }

        */
    }
}