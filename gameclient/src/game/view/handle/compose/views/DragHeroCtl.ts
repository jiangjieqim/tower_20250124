import { ScreenAdapter } from "../../../../G";
import { MainModel } from "../../main/model/MainModel";
import { ComposeConfig } from "../ComposeConfig";
import { ComposeModel } from "../ComposeModel";
import { FightUtils } from "../FightUtils";
import { FightValueConfig } from "../vos/FightValueConfig";
/**
 * 拖拽控制器 
 * 以heroLayer层为碰撞的触发区域
*/
export class DragHeroCtl{
    private get TOP_V():number{
        return this.model.fightTypeAdaper.defaultOffsetY;
    }
    private _layer:Laya.Sprite;//交互点击层
    private model:ComposeModel;
    private curIsoX:number;
    private curIsoY:number;
    private curUID:number;
    /**绘制可交互区域 */
    // private readonly debugDRAW:boolean = false;
    setContainer(_layer:Laya.Sprite){
        this.model = ComposeModel.Ins;
        this._layer = _layer;
        _layer.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        this._layer.on(Laya.Event.DISPLAY,this,this.onDisplay);
        this._layer.on(Laya.Event.UNDISPLAY,this,this.onUnDisplay);
    }

    private onStageMouseUp(){
        // LogSys.Log("onStageMouseUp...");
        this.outSideUpdate();
    }

    private onUnDisplay(){
        Laya.stage.off(Laya.Event.MOUSE_UP,this,this.onStageMouseUp);
    }

    private onDisplay(){
        this.setHitRect();
    }

    private setHitRect(){
        Laya.stage.on(Laya.Event.MOUSE_UP,this,this.onStageMouseUp);
        let heroLayer = this._layer;
        let screenW:number = Laya.stage.width;
        let screenH:number = Laya.stage.height;
        let x:number = -ComposeConfig.cellW-FightValueConfig.fightViewX + ScreenAdapter.UIRefWidth/2 - screenW/2;
        let y:number = -ComposeConfig.cellH-FightValueConfig.fightViewY + ScreenAdapter.DefaultHeight/2 - screenH/2;
        let rect = new Laya.Rectangle(x, y, screenW, screenH);

        // rect = new Laya.Rectangle(0, 0, ComposeConfig.cellW * 6, ComposeConfig.cellH * 3);

        // if(Laya.Utils.getQueryString("debugDraw")){
        heroLayer.graphics.clear();
        let n:number = 1;
        heroLayer.graphics.drawRect(rect.x+n,rect.y+n,rect.width-n*2,rect.height-n*2,"#0000ff00","#ff000000",n);
        // }
        heroLayer.hitArea = rect;
        heroLayer.mouseThrough = true;
    }

    private clear(){
        this.curIsoX = 0;
        this.curIsoY = 0;
        this._layer.off(Laya.Event.MOUSE_UP,this,this.onMouseUp);
        this._layer.off(Laya.Event.MOUSE_MOVE,this,this.onMouseMove);
        if(this.model.fightView){
            // this.model.fightView.bottom_18_alphaGridLayer.removeSelf();
            this.model.fightView.removeBottomLayer();
        }
        // this.model.fightView.topDragLayer.clear(`DragHeroCtl.clear`);
    }
    private onMouseDown(e: Laya.Event) {
        // LogSys.Log(`DragHeroCtl onMouseDown...`);

        this._layer.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
        this._layer.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        this._layer.on(Laya.Event.MOUSE_OUT, this, this.onMouseOut);
        // this.clear();
        let _notFind:boolean = false;
        let cur = this.getIsoPos();
        const topv: number = this.TOP_V;// - this.model.fightTypeAdaper.offsetIsoY;
        if (cur.y >= topv) {
            //对方坐标 转换
            cur.y = (ComposeConfig.mapH - 1) - (cur.y - topv);
            // console.log(cur);
            let _player = this.model.refreshList.find(o => o.playerId != MainModel.Ins.mRoleData.AccountId && o.x == cur.x && o.y == cur.y);
            if (_player) {
                this.openHeroTips(_player.uid);
                this.clear();
            } else {
                //未找到
                _notFind = true;
            }
        } else {
            let vo = this.getVoByPos(cur);
            if (!vo) {//未找到
                this.clear();
                _notFind = true;
            } else {
                if(this.model.fightView){
                    this.model.fightView.closeCirleYellow();
                }
                this.curUID = vo.uid;
                this.curIsoX = cur.x;
                this.curIsoY = cur.y;
            }
        }
        if(_notFind){
            if(this.model.fightView){
                this.model.fightView.closeCirleYellow();
            }
            this.model.closeComposeTips();
            this.clear();
        }
    }
    private getIsoPos(){
        let pos: Laya.Point = (this._layer.parent as Laya.Sprite).localToGlobal(new Laya.Point(this._layer.x, this._layer.y));
        let offsetX = Laya.stage.mouseX - pos.x;
        let offsetY = Laya.stage.mouseY - pos.y;
        let isoX = Math.floor(offsetX / ComposeConfig.cellW);
        let isoY = ComposeConfig.mapH - Math.floor(offsetY/ComposeConfig.cellH) - 1;// + this.model.fightTypeAdaper.offsetIsoY;
        
        if(isoY >= this.TOP_V - 1){
            // isoY += Math.floor(this.model.fightTypeAdaper.offset_ISO_Y);
            offsetY = Laya.stage.mouseY - (pos.y - this.model.fightTypeAdaper.cfg.f_top * ComposeConfig.cellH);
            isoY = (ComposeConfig.mapH - Math.floor(offsetY / ComposeConfig.cellH) - 1) + this.TOP_V;
        }

        return new Laya.Point(isoX,isoY);
    }

    private getVoByPos(pos:Laya.Point){
        let vo = this.model.refreshList.find(o=>o.playerId == MainModel.Ins.mRoleData.AccountId && o.x == pos.x && o.y == pos.y);
        return vo;
    }

    // /**合成售卖小菜单 */
    // private showSellTips(uid:number){
    //     let vo = this.model.refreshList.find(o=>o.uid == uid);
    //     if(!vo){
    //         return;
    //     }
    //     let type = EViewType.CompSell;
    //     if(E.ViewMgr.isOpenReg(type)){
    //         (E.ViewMgr.Get(type) as ComposeTips).updateView(vo);
    //     }else{
    //         E.ViewMgr.Open(type,null,vo);
    //     }
    // }
    
    /**打开
     * 1英雄tips 
     * 2售卖
     * 3攻击区域
     * */
    private openHeroTips(uid:number){
        let fightView = this.model.fightView;
        if(fightView){
            // E.EventMgr.emit(EventID.ButtonCtlClick,fightView.gridItemList.find(o=>o.data.uid == uid));
            
            // this.showSellTips(uid);
            // //==============================================
            // E.ViewMgr.Open(EViewType.TopHeroTips,null,uid);  
            // fightView.clearTopDragLayer();
            // //==============================================
            // fightView.openCirleYellow(uid);
            fightView.openHeroTips(uid);
        }
    }

    private onMouseUp(e:Laya.Event){
 
        e.stopPropagation();
        this._layer.off(Laya.Event.MOUSE_UP,this,this.onMouseUp);
        let cur = this.getIsoPos();
        // this.clear();
        if(this.curIsoX == cur.x && this.curIsoY == cur.y){
            this.openHeroTips(this.curUID);//打开售卖小菜单
            this.clear();
            return;
        }
        this.clear();
        let vo = this.getVoByPos(cur);

        if(!this.model.curAdapter.mDrag || this.model.fightTypeAdaper.disableDrag){
            // LogSys.Log("禁用拖拽中onMouseUp");
            this.model.fightView.clearTopDragLayer();
            return;
        }
        if(vo){
            //this.model.reqCompose(this.curUID,vo.uid);//交换两个格子中的英雄
            let x1:number = 0;
            let y1:number = 0;
            let x2:number = 0;
            let y2:number = 0;

            if(!this.model.curAdapter.canSwitchHero){
                LogSys.Log(`canSwitchHero is disable...`);
                this.model.fightView.clearTopDragLayer();
                return;
            }

            if(this.model.curAdapter.isGuide){
                let _agrid = this.model.refreshList.find(o => o.uid == this.curUID);
                let _bgrid = this.model.refreshList.find(o => o.uid == vo.uid);
                if (_agrid && _bgrid) {
                    x1 = _bgrid.x;
                    y1 = _bgrid.y;
                    x2 = _agrid.x;
                    y2 = _agrid.y;
                    // this.model.curAdapter.clientHeroMove(this.model.fightView, uid1, x2, y2);
                    // this.model.curAdapter.clientHeroMove(this.model.fightView, uid2, x1, y1);
                    this.model.fightView.clearTopDragLayer();
                    return;
                }
            }

            if(this.model.curAdapter.switchHero(this.curUID,vo.uid,x1,y1,x2,y2)){
                return
            }

        } else {
            if (FightUtils.isOwnerCanMove(cur.x, cur.y)){
                // this.model.moveItemToMap(this.curUID, cur.x, cur.y);//后端处理之后 移动成功
                this.heroMove(cur.x, cur.y);
                return;
            }
        }

        //在操作区域外面
        this.outSideUpdate();
    }

    private outSideUpdate(){
        if(this.model.fightView){
            // let topLayer = this.model.fightView.topDragLayer;
            // if(topLayer && topLayer.isInStage){
            // this.heroMove(topLayer.endIsoX, topLayer.endIsoY);
            // }
            this.model.fightView.outSideUpdate(this.curUID);
        }
    }
    /**英雄移动 */
    private heroMove(isoX:number,isoY:number){
        // this.model.curAdapter.move(this.curUID, isoX, isoY);
        // this.model.fightView.clientHeroMove(this.curUID,isoX,isoY);
        // this.model.fightView.clearTopDragLayer();
        this.model.fightView.heroMove(this.curUID,isoX,isoY);
    }

    private onMouseMove(){
        if(!this.model.curAdapter.mDrag){
            // LogSys.Log("禁用拖拽中onMouseMove");
            return;
        }
        // LogSys.Log(`onMouseMove... ${Math.random()}`);
        // console.log(`${Math.random()}...`);
        this.model.closeComposeTips();
        this.model.fightView.addToBottomLayer()
        let target = this.getIsoPos();
        this.model.fightView.topDragLayer.onMove(this.curIsoX, this.curIsoY, target.x, target.y);
        // this.model.fightView.openCirleYellow(this.curUID);
    }
    /**移出了检测区域 */
    private onMouseOut(){
        // this.clear();
    }
    dispose(){
        this._layer.off(Laya.Event.MOUSE_OUT,this,this.onMouseOut);
        this._layer.off(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        this._layer.off(Laya.Event.MOUSE_UP,this,this.onMouseUp);
        this._layer.off(Laya.Event.MOUSE_MOVE,this,this.onMouseMove);
        this._layer = null;
    }
}