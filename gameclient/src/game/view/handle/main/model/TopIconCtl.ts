import { FunctionModel } from "../../funs/FunctionModel";
import { MainIconProxy } from "../../funs/proxy/FunctionProxy";
import { TopMainIcon } from "../views/icon/TopMainIcon";
import { EFuncDef } from "./EFuncDef";
import { ItemViewFactory } from "./ItemViewFactory";
import { MainModel } from "./MainModel";
class TopIconBind{
    clsKey:string;
    cls;
    funcid:EFuncDef;
}

export class TopIconCtl{
    public btnlist:Laya.Sprite;
    private itemList:TopMainIcon[] = [];
    private _gap:number;
    private _defList:TopIconBind[];
    private get model(){
        return MainModel.Ins;
    }

    private initSkinDef(){
        if(!this._defList){
            this._defList = [];
            // this.regSkin(EFuncDef.PopWin,"TopPopWinSmallIcon",TopPopWinSmallIcon);//弹出小按钮注册     
            // this.regSkin(EFuncDef.ZhuHouBuji,"TopTickTimeIcon",TopTickTimeIcon);//有倒计时的小按钮
        }
    }

    private regSkin(funcid:EFuncDef,clsKey:string,cls){
        let cell = new TopIconBind();
        cell.cls = cls;
        cell.clsKey = clsKey;
        cell.funcid = funcid;
        this._defList.push(cell);
    }

    private sortTopList(a:Configs.t_MainIcon_dat,b:Configs.t_MainIcon_dat){
        if(a.f_sort < b.f_sort){
            return 1;
        }
        else if(a.f_sort > b.f_sort){
            return -1;
        }
        return 0;
    }
    public refreshView(){
        this.initSkinDef();
        let btnlist = this.btnlist;

        if(this._gap == undefined){
            this._gap = ItemViewFactory.gapAndClear(btnlist);
        }

        while(this.itemList.length > 0){
            let cell:TopMainIcon = this.itemList.pop();
            Laya.Pool.recover(this.getPoolKey(cell.cfg),cell);
            // cell.dispose();
            cell.skin.removeSelf();
        }

        let l = MainIconProxy.Ins.List;
        let _bottomMaxPos:number = MainIconProxy.Ins.bottomMaxPos;
        let cfgList = [];
        for(let i = 0;i < l.length;i++){
            let cfg:Configs.t_MainIcon_dat = l[i];
            if(cfg.f_pos > _bottomMaxPos && FunctionModel.Ins.isOpenByFuncId(cfg.f_funid)){
                cfgList.push(cfg);
                // let cell:TopMainIcon = Laya.Pool.getItemByClass(this.itemKey,TopMainIcon) as TopMainIcon;
                // cell.initCfg(cfg);
            }
        }
        cfgList = cfgList.sort(this.sortTopList);
        let cellWidth:number = 0;
        for(let i = 0;i < cfgList.length;i++){
            let cfg:Configs.t_MainIcon_dat = cfgList[i];
            let cell:TopMainIcon = this.createObj(cfg);// Laya.Pool.getItemByClass(this.itemKey,TopMainIcon) as TopMainIcon;
            cell.initCfg(cfg);
            cellWidth = (cell.skin.width + this._gap);
            cell.setpos(i * cellWidth,0);
            btnlist.addChild(cell.skin);
            this.itemList.push(cell);
        }
        btnlist.x = (btnlist.parent as Laya.Sprite).width - cfgList.length * cellWidth;
    }

    private getPoolKey(cfg: Configs.t_MainIcon_dat) {
        let cell = this._defList.find(item => item.funcid == cfg.f_funid);
        return cell ? cell.clsKey : "TopMainIcon";
    }

    private getCls(cfg: Configs.t_MainIcon_dat) {
        let cell = this._defList.find(item => item.funcid == cfg.f_funid);
        return cell ? cell.cls : TopMainIcon;
    }

    private createObj(cfg: Configs.t_MainIcon_dat):TopMainIcon{
        let cls = this.getCls(cfg);
        let cell:TopMainIcon = Laya.Pool.getItemByClass(this.getPoolKey(cfg),cls) as TopMainIcon;
        return cell;
    }
}