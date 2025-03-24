import { ui } from "../../../../../../ui/layaMaxUI";
import { stCommonRank } from "../../../../../network/protocols/BaseProto";
import { ChengHaoCtl } from "../../../common/ChengHaoCtl";
import { HeadCtl } from "../../../common/HeadCtl";
import { MainModel } from "../../../main/model/MainModel";
import { RankModel } from "../../../rank/model/RankModel";

export class SSRankItem extends ui.views.shengshou.ui_rankItem1UI{
    
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
    }
}