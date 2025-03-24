import { ui } from "../../../../../ui/layaMaxUI";
import { stCommonRank } from "../../../../network/protocols/BaseProto";
import { ChengHaoCtl } from "../../common/ChengHaoCtl";
import { HeadCtl } from "../../common/HeadCtl";
import { MainModel } from "../../main/model/MainModel";
import { RankModel } from "../model/RankModel";

export class RankItem extends ui.views.rank.ui_rankItem1UI{
    
    private _ctl:HeadCtl;
    private _chCtl:ChengHaoCtl;

    constructor(){
        super();
        this._ctl = new HeadCtl(this.view);
        this._chCtl = new ChengHaoCtl(this.view_ch);
        this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick(){
        if(!this._data)return;
        RankModel.Ins.watchPlayer(this._data.accountId);
    }

    private _data: stCommonRank;
    public setData(value: stCommonRank) {
        if (!value) return;
        this._data = value;
        this.lab_name.text = value.nickName;
        let headUrl = MainModel.Ins.convertHead(value.headUrl);
        this._ctl.setData(headUrl,value.HeadFrame);
        this._chCtl.setData(value.titleId);
        this.lab1.text = value.ranking + "";
        this.lab.text = value.trophy + "";
        this.lab2.text = value.trophy + "";
        this.lab3.text = value.trophy + "波";
        this.lab_f.text = value.serverName;
        this.sp.visible = this.sp1.visible = this.sp2.visible = false;
        if (RankModel.Ins.rankFlag == 0) {
            this.sp.visible = true;
        } else if (RankModel.Ins.rankFlag == 1) {
            this.sp2.visible = true;
        } else if (RankModel.Ins.rankFlag == 2) {
            this.sp1.visible = true;
            this.sp1.skin = `remote/rank/bottom_hh${value.mode}.png`;
            if (value.mode == 0) {
                this.lab11.text = "普通";
                this.lab11.color = "#ffcf72";
                this.lab11.strokeColor = "#7f3300";
            } else if (value.mode == 1) {
                this.lab11.text = "困难";
                this.lab11.color = "#c574ff";
                this.lab11.strokeColor = "#3c095f";
            }
        }
    }
}