import { ui } from "../../../../../ui/layaMaxUI";
import { SocketMgr } from "../../../../network/SocketMgr";
import { SpringFestivalZan_req, stSpringFestivalRank } from "../../../../network/protocols/BaseProto";
import { HeadCtl } from "../../common/HeadCtl";
import { MainModel } from "../../main/model/MainModel";
import { RankModel } from "../../rank/model/RankModel";

export class NewYearItem extends ui.views.newyear.ui_newyearItem2UI{
    
    private _ctl:HeadCtl;
    private _ctl1:HeadCtl;

    constructor(){
        super();
        this._ctl = new HeadCtl(this.view);
        this._ctl1 = new HeadCtl(this.view1);
        this.view.on(Laya.Event.CLICK,this,this.onClick);
        this.view1.on(Laya.Event.CLICK,this,this.onClick1);
        ButtonCtl.Create(this.btn,new Laya.Handler(this,this.onBtnClick));
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

    private _data: stSpringFestivalRank;
    public setData(value: stSpringFestivalRank) {
        if (!value) return;
        this._data = value;
        this.lab.text = value.rank + "";
        let headUrl = MainModel.Ins.convertHead(value.playeres[0].HeadUrl);
        let headUrl1 = MainModel.Ins.convertHead(value.playeres[1].HeadUrl);
        this._ctl.setData(headUrl,value.playeres[0].HeadFrame);
        this._ctl1.setData(headUrl1,value.playeres[1].HeadFrame);
        this.lab1.text = value.playeres[0].nickName;
        this.lab2.text = value.playeres[1].nickName;
        this.lab3.text = value.damage + "";
        this.lab4.text = value.zan + "";
        if(value.zanExist){
            this.btn.disabled = true;
        }else{
            this.btn.disabled = false;
        }
    }
}