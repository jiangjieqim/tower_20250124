import { ui } from "../../../../../../ui/layaMaxUI";
import { stCommonRank } from "../../../../../network/protocols/BaseProto";
import { ChengHaoCtl } from "../../../common/ChengHaoCtl";
import { HeadCtl } from "../../../common/HeadCtl";
import { MainModel } from "../../../main/model/MainModel";
import { RankModel } from "../../../rank/model/RankModel";

export class SSRankCtl{
    protected _ui:ui.views.shengshou.ui_rankItemUI;

    private _ctl:HeadCtl;
    private _chCtl:ChengHaoCtl;

    constructor(skin:ui.views.shengshou.ui_rankItemUI){
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
        this._ui.img.skin = "remote/base/img_" + value.ranking + ".png";
        let headUrl = MainModel.Ins.convertHead(value.headUrl);
        this._ctl.setData(headUrl,value.HeadFrame);
        this._chCtl.setData(value.titleId);
        this._ui.lab_name.text = value.nickName;
        this._ui.lab.text = value.trophy + "";
    }
}