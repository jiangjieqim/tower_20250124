import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { WatchCommonRankDetail_revc } from "../../../../network/protocols/BaseProto";
import { ChengHaoCtl } from "../../common/ChengHaoCtl";
import { HeadCtl } from "../../common/HeadCtl";
import { MainModel } from "../../main/model/MainModel";
import { t_Player_Exp } from "../../towertmain/proxy/t_Player_Exp";
import { t_Function_Card } from "../../towertmaincard/proxy/t_Function_Card";
import { HeroListProxy } from "../../towertmainhero/proxy/HeroProxy";
import { t_Treasure } from "../../towertmainlinbao/proxy/t_Treasure";

export class RankView1 extends ViewBase{
    private _ui:ui.views.rank.ui_rankView1UI;
    private _ctl:HeadCtl;
    private _chCtl:ChengHaoCtl;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;
    private _wid:number;

    protected onAddLoadRes(): void {
        this.addAtlas('roleinfo.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.rank.ui_rankView1UI();
            this.bindClose(this._ui.btn_close);

            this._wid = this._ui.pro.width;
            this._ctl = new HeadCtl(this._ui.view);
            this._chCtl = new ChengHaoCtl(this._ui.view_ch);
        }
    }

    protected onInit(): void {
        this.updateRole();
    }

    protected onExit(): void {

    }
    
    private updateRole(){
        let data:WatchCommonRankDetail_revc = this.Data;
        let headUrl = MainModel.Ins.convertHead(data.playerData.HeadUrl);
        this._ctl.setData(headUrl,data.playerData.HeadFrame);
        this._chCtl.setData(data.titleId);
        this._ui.lab.text = data.playerData.trophy + "";
        this._ui.lab1.text = data.playerData.NickName;
        this._ui.lab2.text = "lv:" + data.playerData.level;
        let cfg = t_Player_Exp.Ins.getCfgByLv(data.playerData.level);
        if(cfg){
            this._ui.pro.width = data.playerData.curLevelExp / cfg.f_ExpValue * this._wid;
            this._ui.lab3.text = data.playerData.curLevelExp + "/" + cfg.f_ExpValue;
        }

        let arr = data.career;
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].flag == 1){
                this._ui.lab8.text = arr[i].times + "";
            }else if(arr[i].flag == 2){
                this._ui.lab9.text = arr[i].times + "";
            }else if(arr[i].flag == 3){
                this._ui.lab10.text = arr[i].times + "";
            }
        }

        arr = data.careerPve;
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].flag == 1){
                this._ui.lab11.text = arr[i].times + "";
            }else if(arr[i].flag == 2){
                this._ui.lab12.text = arr[i].times + "";
            }else if(arr[i].flag == 3){
                this._ui.lab13.text = arr[i].times + "";
            }
        }

        arr = data.collect;
        for(let i:number=0;i<arr.length;i++){
            if(arr[i].flag == 1){
                this._ui.lab5.text = arr[i].times + "/" + HeroListProxy.Ins.getList().length;
            }else if(arr[i].flag == 2){
                this._ui.lab6.text = arr[i].times + "/" + t_Treasure.Ins.List.length;
            }else if(arr[i].flag == 3){
                this._ui.lab7.text = arr[i].times + "/" + t_Function_Card.Ins.getList().length;
            }
        }
    }
}