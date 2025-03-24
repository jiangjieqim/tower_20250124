import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { SpringFestivalZan_req, stSpringFestivalRank } from "../../../../network/protocols/BaseProto";
import { HeadCtl } from "../../common/HeadCtl";
import { MainModel } from "../../main/model/MainModel";
import { RankModel } from "../../rank/model/RankModel";

export class NRankCtl{
    protected _ui:ui.views.newyear.ui_newyearItem1UI;

    private _ctl:HeadCtl;
    private _ctl1:HeadCtl;

    constructor(skin:ui.views.newyear.ui_newyearItem1UI){
        this._ui = skin;
        this._ctl = new HeadCtl(this._ui.view);
        this._ctl1 = new HeadCtl(this._ui.view1);
        this._ui.view.on(Laya.Event.CLICK,this,this.onClick);
        this._ui.view1.on(Laya.Event.CLICK,this,this.onClick1);
        ButtonCtl.Create(this._ui.btn,new Laya.Handler(this,this.onBtnClick));
    }

    private onBtnClick(){
        if(!this._data)return;
        let req = new SpringFestivalZan_req;
        req.uqSign = this._data.uqSign;
        SocketMgr.Ins.SendMessageBin(req);
    }

    private onClick(){
        if(!this._data)return;
        RankModel.Ins.watchPlayer(this._data.playeres[0].playerId);
    }

    private onClick1(){
        if(!this._data)return;
        RankModel.Ins.watchPlayer(this._data.playeres[1].playerId);
    }

    private _data:stSpringFestivalRank;
    public setData(value:stSpringFestivalRank){
        if(!value)return;
        this._data = value;
        this._ui.bg.skin = `remote/newyear/bottom_phb_d${value.rank}.png`;
        let headUrl = MainModel.Ins.convertHead(value.playeres[0].HeadUrl);
        let headUrl1 = MainModel.Ins.convertHead(value.playeres[1].HeadUrl);
        this._ctl.setData(headUrl,value.playeres[0].HeadFrame);
        this._ctl1.setData(headUrl1,value.playeres[1].HeadFrame);
        this._ui.lab.text = value.playeres[0].nickName;
        this._ui.lab1.text = value.playeres[1].nickName;
        this._ui.lab2.text = value.damage + "";
        this._ui.lab3.text = value.zan + "";
        if(value.zanExist){
            this._ui.btn.disabled = true;
        }else{
            this._ui.btn.disabled = false;
        }
    }
}