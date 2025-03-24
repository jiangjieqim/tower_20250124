import { ui } from "../../../../../ui/layaMaxUI";
import { stCommonRank } from "../../../../network/protocols/BaseProto";
import { ChengHaoCtl } from "../../common/ChengHaoCtl";
import { HeadCtl } from "../../common/HeadCtl";
import { MainModel } from "../../main/model/MainModel";
import { RankModel } from "../model/RankModel";

export class RankCtl{
    protected _ui:ui.views.rank.ui_rankItemUI;

    private _ctl:HeadCtl;
    private _chCtl:ChengHaoCtl;

    constructor(skin:ui.views.rank.ui_rankItemUI){
        this._ui = skin;
        this._ctl = new HeadCtl(this._ui.view);
        this._chCtl = new ChengHaoCtl(this._ui.view_ch);
        this._ui.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        if(!this._data)return;
        RankModel.Ins.watchPlayer(this._data.accountId);
    }

    private _data:stCommonRank;
    public setData(value:stCommonRank){
        if(!value)return;
        this._data = value;
        this._ui.img.skin = "remote/rank/img_" + value.ranking + ".png";
        let headUrl = MainModel.Ins.convertHead(value.headUrl);
        this._ctl.setData(headUrl,value.HeadFrame);
        this._chCtl.setData(value.titleId);
        this._ui.lab_name.text = value.nickName;
        this._ui.lab.text = value.trophy + "";
        this._ui.lab1.text = value.trophy + "波";
        this._ui.lab2.text = value.trophy + "";
        this._ui.lab_f.text = value.serverName;
        this._ui.sp.visible = this._ui.sp1.visible = this._ui.sp2.visible = false;
        if (RankModel.Ins.rankFlag == 0) {
            this._ui.sp.visible = true;
        } else if (RankModel.Ins.rankFlag == 1) {
            this._ui.sp2.visible = true;
        } else if (RankModel.Ins.rankFlag == 2) {
            this._ui.sp1.visible = true;
            this._ui.sp1.skin = `remote/rank/bottom_hh${value.mode}.png`;
            if (value.mode == 0) {
                this._ui.lab11.text = "普通";
                this._ui.lab11.color = "#ffcf72";
                this._ui.lab11.strokeColor = "#7f3300";
            } else if (value.mode == 1) {
                this._ui.lab11.text = "困难";
                this._ui.lab11.color = "#c574ff";
                this._ui.lab11.strokeColor = "#3c095f";
            }
        }
    }
}