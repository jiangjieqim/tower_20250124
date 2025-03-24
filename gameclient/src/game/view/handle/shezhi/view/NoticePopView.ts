import { RowMoveBaseNode, ScrollPanelControl } from "../../../../../frame/view/ScrollPanelControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { stNotice } from "../../../../network/protocols/BaseProto";
import { ERedEnum } from "../../main/model/ERedEnum";
import { MainModel } from "../../main/model/MainModel";
import { SheZhiModel } from "../model/SheZhiModel";
const mClsKey:string = "NoticeNodeView";

/**公告选择状态 */
export class NoticePopTipSelVo{
    
    /**是否打开过公告 */
    private hasNotOpen:boolean = false;
    private key:number = ERedEnum.NOTICE_SEL;

    /**进游戏自动打开公告 */
    public autoOpen(){
        if(!this.hasNotOpen){
            this.hasNotOpen = true;
            let localNoticeList = SheZhiModel.Ins.localNoticeList;
            if(localNoticeList.length >0){
                let cell = localNoticeList[0];
                /*弹出公告频率 1强弹（进入游戏时弹出）2不强弹（进入游戏时不弹出，用户点击公告按钮时弹出）*/
                if (cell.frequent == 1) {
                    SheZhiModel.Ins.openPopNotice(localNoticeList);
                }
            }
        }
    }
}

export class PopNoticeVo{
    dataList:stNotice[];
    noticeSel:NoticePopTipSelVo;
}

class NoticeNodeView extends RowMoveBaseNode{
    protected clsKey:string = mClsKey;
    protected createNode (index){
        let _skin:ui.views.shezhi.ui_notice_itemUI = Laya.Pool.getItemByClass(this.clsKey,ui.views.shezhi.ui_notice_itemUI);
        let vo:stNotice = this.list[index];
        _skin.titleTf.text = vo.title;
        _skin.descTf.text = vo.content;
        _skin.height = _skin.descTf.y + _skin.descTf.textField.height;
        _skin.y = this.y;
        return _skin;
    }

    public static getHeight(vo:stNotice){
        let _skin:ui.views.shezhi.ui_notice_itemUI = Laya.Pool.getItemByClass(mClsKey,ui.views.shezhi.ui_notice_itemUI);
        _skin.descTf.text = vo.content;
        return _skin.descTf.y + _skin.descTf.textField.height;
    }
}

/**大公告 */
export class NoticePopView extends ViewBase {
    protected mMask = true;
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    private curData:PopNoticeVo;
    private _ui:ui.views.shezhi.ui_pop_noticeUI;
    private _curList:stNotice[] = [];
    private _panelCtl: ScrollPanelControl;
    protected onAddLoadRes(): void { 
        this.addAtlas('shezhi.atlas');
    }
    protected onExit(): void { }
    
    protected onFirstInit(): void { 
        if(!this.UI){
            this.UI = this._ui = new ui.views.shezhi.ui_pop_noticeUI();
            this._panelCtl = new ScrollPanelControl();

            this._panelCtl.init(this._ui.panel);
            this.bindClose(this._ui.btn_close);
        }
    }

    protected onInit(): void {
        this.curData = this.Data;
        this._curList = this.curData.dataList;
        this._panelCtl.clear();
        for(let i = 0;i < this._curList.length;i++){
            let cell = this._curList[i];
            let h = NoticeNodeView.getHeight(cell);
            this._panelCtl.split([cell],NoticeNodeView,h,20);
        }
        this._panelCtl.end();
    }
}