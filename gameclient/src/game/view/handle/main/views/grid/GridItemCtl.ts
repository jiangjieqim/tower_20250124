import { GeometryUtil } from "../../../../../../frame/util/GeometryUtil";
import { ui } from "../../../../../../ui/layaMaxUI";
import { SimpleEffect } from "../../../avatar/SimpleEffect";
import { IconUtils } from "../../model/IconUtils";
import { ItemProxy } from "../../proxy/ItemProxy";
import { GridItemVo } from "./GridItemVo";

export class GridItemCtl{
    private skin: ui.views.common.ui_slot_itemUI;
    private _vo:GridItemVo;
    private _isTip:boolean;
    private _isDrag:boolean;
    private _dragTime:number;
    private _eff:SimpleEffect;
    
    public get curVo():GridItemVo{
        return this._vo;
    }

    public setVisible(bo:boolean){
        this.skin.visible = bo;
    }

    public setQuaVis(bo:boolean){
        this.skin.quality.visible = bo;
    }

    constructor(skin:ui.views.common.ui_slot_itemUI) {
        this.skin = skin;
        this.skin.icon.y += 2;
        this.skin.on(Laya.Event.DISPLAY,this,this.onAdd);
        this.skin.on(Laya.Event.UNDISPLAY,this,this.onRemove);
    }

    private onAdd(){
        // MainModel.Ins.on(MainEvent.Open_Equip_switch_View,this,this.onOpen_Equip_switch_View);
    }

    private onRemove(){
        // MainModel.Ins.on(MainEvent.Open_Equip_switch_View,this,this.onOpen_Equip_switch_View);
        this.clearEff();
        this.clear();
    }

    private onOpen_Equip_switch_View(){
        this.clearDrag();
    }

    private onClick(){
        if(this._vo){
            switch(this._vo.itemCfg.f_sub_type){
                case 4:
                    // E.ViewMgr.Open(EViewType.CIFU_ITEMTIP,null,this._vo);
                    break;
                case 7:
                    // E.ViewMgr.Open(EViewType.CIFU_ITEMTIP1,null,this._vo);
                    break;
            }
        }
    }

    private _cheifId:number;
    public setBagData(vo:GridItemVo,isTip:boolean = false,isDrag:boolean = false,isLv:boolean = false,cheifId:number = 0){
        this.clear();
        this._cheifId = cheifId;
        this._vo = vo;
        if(vo){
           if(!vo.isNull){
                this.setEvent(isTip,isDrag);
                this.skin.icon.skin = vo.getIconSkin();
                if(vo.count > 1){
                    this.skin.tf1.text = "x" + vo.count;
                }
                if(isLv){
                    this.skin.tf1.text = "lv.1";// + //vo.stItem.level;
                }
                this.setEff(vo.itemCfg.f_qua);
           }else{
                this.clearEff();
           }
        }else{
            this.clearEff();
        }
    }

    // public setDataBySoulItemID(itemID:number,attrID:number,isTip:boolean = false,isDrag:boolean = false){
    //     this.clear();
    //     this.setEvent(isTip,isDrag);
    //     let cfg = HuYouIconProxy.Ins.getCfgByIdAndAttr(itemID,attrID);
    //     if(!cfg){
    //         LogSys.Error(`setDataBySoulItemID itemID attrID=====> ${itemID} ${attrID}`);
    //     }
    //     this.skin.icon.skin = `o/bless/${cfg.f_icon}`;
    //     let itemCfg = ItemProxy.Ins.getCfg(itemID);
    //     this.setEff(itemCfg.f_qua);
    // }

    public setDataByItemID(itemID:number,count:number = 1,isTip:boolean = false,isDrag:boolean = false){
        this.clear();
        this.setEvent(isTip,isDrag);
        let itemCfg = ItemProxy.Ins.getCfg(itemID);
        this.skin.icon.skin = IconUtils.getIcon(itemCfg.f_icon);
        if(count > 1){
            this.skin.tf1.text = "x" + count;
        }
        this.setEff(itemCfg.f_qua);
    }

    private setEff(qua:number){
        if(qua > 4){
            if(!this._eff){
                this._eff = new SimpleEffect(this.skin,`o/spine/fuyuan/fuyuan`);
                this._eff.once(Laya.Event.COMPLETE,this,()=>{
                    let w = 100 - this._eff.anim.container.width;
                    let h = 100 - this._eff.anim.container.height;
                    this._eff.anim.container.x = w * 0.5 - 1;
                    this._eff.anim.container.y = h * 0.5;
                    this._eff.play(0,true);
                });
            }
        }else{
            this.clearEff();
        }
    }

    private setEvent(isTip:boolean,isDrag:boolean){
        this._isTip = isTip;
        this._isDrag = isDrag;
        if(this._isDrag){
            this.skin.on(Laya.Event.MOUSE_DOWN,this,this.onDown);
        }else{
            this.skin.off(Laya.Event.MOUSE_DOWN,this,this.onDown);
        }
        if(this._isTip){
            this.skin.on(Laya.Event.CLICK,this,this.onClick);
        }else{
            this.skin.off(Laya.Event.CLICK,this,this.onClick);
        }
    }

    private _img:Laya.Image;
    private onDown(e:Laya.Event){
        /*
        if(HuYouModel.Ins.isAuto){
            E.ViewMgr.ShowMidError("正在祈福中");
            return;
        }
        if(this._vo && this._vo.itemCfg.f_sub_type == 4){
            e.stopPropagation();
            this._img = new Laya.Image();
            this._img.skin = this._vo.getIconSkin();
            this._img.x = Laya.stage.mouseX - this._img.width * 0.5;
            this._img.y = Laya.stage.mouseY - this._img.height * 0.5;
            this._img.on(Laya.Event.MOUSE_UP,this,this.onUp);
            LayerMgr.Ins.noteLayer.addChild(this._img);
            this._img.startDrag();
            this._dragTime = Laya.timer.currTimer;
            let view;
            if (this._cheifId == 0) {
                view = E.ViewMgr.Get(EViewType.CIFU).UI as ui.views.fuyou.ui_cifuUI;
            } else {
                let vw = E.ViewMgr.Get(EViewType.FuJiang).UI as ui.views.fujiang.ui_fujiangViewUI;
                view = vw["view5"];
            }

            view.txt_dragdec.visible = true;
            let attrID = HuYouModel.Ins.getAttr(this._vo.uid).id;
            let pos = HuYouModel.Ins.getEquipSameSoulPos(attrID,this._cheifId);
            if(pos != -1){
                view["img_liang" + pos].visible = true;
            }else{
                let soltNum:number;
                if(this._cheifId == 0){
                    soltNum = HuYouSlotProxy.Ins.getSlotNum();
                }else{
                    soltNum = FuJiangFYSlotProxy.Ins.getSlotNum(this._cheifId);
                }
                
                for(let i:number = 1;i<9;i++){
                    if(soltNum >= i){
                        view["img_liang" + i].visible = true;
                    }
                }
            }
         }
         */
     }

    private onUp(e:Laya.Event){
        if(!this._img){
            return;
        }
        let imgX:number = this._img.x;
        let imgY:number = this._img.y;
        let imgW:number = this._img.width;
        let imgH:number = this._img.height;
        this.clearDrag();
        let view;
        if(this._cheifId == 0){
            // view = E.ViewMgr.Get(EViewType.CIFU).UI as ui.views.fuyou.ui_cifuUI;
        }else{
            // let vw = E.ViewMgr.Get(EViewType.FuJiang).UI as ui.views.fujiang.ui_fujiangViewUI;
            // view = vw["view5"];
        }
        for(let i:number = 1;i<9;i++){
            view["img_liang" + i].visible = false;
        }
        view.txt_dragdec.visible = false;
        if(Laya.timer.currTimer - this._dragTime <= 200){
            // this.clearDrag();
            // E.ViewMgr.Open(EViewType.CIFU_ITEMTIP,null,this._vo);
            return;
        }
        let p:Laya.Point = new Laya.Point(imgX + imgW*0.5,imgY + imgH*0.5);
        let bagX:number = (view.img_dragBg.parent as Laya.Sprite).localToGlobal(new Laya.Point(view.img_dragBg.x,view.img_dragBg.y)).x;
        let bagY:number = (view.img_dragBg.parent as Laya.Sprite).localToGlobal(new Laya.Point(view.img_dragBg.x,view.img_dragBg.y)).y;

        let p1:Laya.Point = new Laya.Point(bagX,bagY + view.img_dragBg.height);//左下顶点
        let p2:Laya.Point = new Laya.Point(bagX,bagY);//左上顶点
        let p3:Laya.Point = new Laya.Point(bagX + view.img_dragBg.width,bagY);//右上顶点
        let p4:Laya.Point = new Laya.Point(bagX + view.img_dragBg.width , bagY + view.img_dragBg.height);//右下顶点
        let bo = GeometryUtil.isPointInRect(p1,p2,p3,p4,p);
        // console.log("booobooobooo>>>>>>>>>>>>>>", bo);
        if(bo){
            /*
            if(this._vo.stItem.type != HuYouModel.BagEnmu.noSort_FY){
                let req:BlessingWear_req = new BlessingWear_req();
                req.type = HuYouModel.BagEnmu.noSort_FY;
                req.pos = 0;
                req.uid = this._vo.uid;
                req.cheifId = this._cheifId;
                SocketMgr.Ins.SendMessageBin(req);
            }
            */
            // this.clearDrag();
            return;
        }

        let index:number=0;
        for(let i:number=1;i<9;i++){
            let img = view["drag_img" + i];
            let xx = img.parent.localToGlobal(new Laya.Point(img.x,img.y)).x;
            let yy = img.parent.localToGlobal(new Laya.Point(img.x,img.y)).y;
            let x = xx - imgX;
            let y = yy - imgY;
            let len = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
            // console.log("viewdrag_img>>>>>>>>>>>>>>", i);
            // console.log("len>>>>>>>>>>>>>>", len);
            if(len <= 40){
                index = i;
            }
        }
        if(index > 0){
            /*
            let soltNum:number;
            if (this._cheifId == 0) {
                soltNum = HuYouSlotProxy.Ins.getSlotNum();
            } else {
                soltNum = FuJiangFYSlotProxy.Ins.getSlotNum(this._cheifId);
            }
            if(index <= soltNum){//已解锁
                let req:BlessingWear_req = new BlessingWear_req();
                req.type = HuYouModel.BagEnmu.sort_FY;
                req.pos = index;
                req.uid = this._vo.uid;
                req.cheifId = this._cheifId;
                SocketMgr.Ins.SendMessageBin(req);
            }else{//未解锁
                // E.ViewMgr.ShowMidError(`${itemCfg.f_name}`+E.getLang("NotEnough"));
            }
            */
        }
        // this.clearDrag();
    }

    private clearDrag(){
        if(this._img){
            this._img.off(Laya.Event.MOUSE_UP,this,this.onUp);
            this._img.stopDrag();
            this._img.removeSelf();
            this._img = null;
        }
    }

    private clearEff(){
        if(this._eff){
            this._eff.dispose();
            this._eff = null;
        }
    }

    private clear(){
        this._isTip = false;
        this._isDrag = false;
        this.skin.icon.skin = "";
        this.skin.tf1.text = "";
        this.clearDrag();
        this.skin.off(Laya.Event.CLICK,this,this.onClick);
        this.skin.off(Laya.Event.MOUSE_DOWN,this,this.onDown);
    }
}