// import { DebugUtil } from "../../../../../frame/util/DebugUtil";
import { RowMoveBaseNode, ScrollPanelControl } from "../../../../../frame/view/ScrollPanelControl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { E } from "../../../../G";
import { ComposeModel } from "../ComposeModel";
import { HistroyMsgVo } from "../vos/HistroyMsgVo";
import { CardCellMsgCtl, ICardCellSkin } from "./cells/CardCellMsgCtl";
/***/
//ui_fight_msghis_show_title_cell


/**弹幕历史标题 */
class FightMsgHisShowTitleCell extends RowMoveBaseNode {
    protected clsKey: string = "FightMsgHisShowTitleCell";
    protected createNode(index: any) {
        // throw new Error("Method not implemented.");
        let _skin: ui.views.compose.fightcell.ui_fight_poss_title_cellUI = Laya.Pool.getItemByClass(this.clsKey, ui.views.compose.fightcell.ui_fight_msghis_show_title_cellUI);
        DebugUtil.draw(_skin);
        let title: string = this.list[index];
        _skin.tf.text = title;
        _skin.x = index * _skin.width;
        _skin.y = this.y;
        return _skin;
    }
}

/**弹幕内容Cell*/
class FightCardHisCellMsg extends RowMoveBaseNode {
    protected clsKey: string = "";
    protected skinCtl:CardCellMsgCtl;
    protected createNode(index: any) {
        let _data: HistroyMsgVo = this.list[index];
        let _cls;
        if(_data.vo.isSelf){  
            _cls = ui.views.compose.fightcell.ui_card_cell_msg_blueUI;
            this.clsKey = "FightCardHisCellSelfMsg";
        }else{
            _cls = ui.views.compose.fightcell.ui_card_cell_msg_redUI;
            this.clsKey = "FightCardHisCellRedMsg";
        }
        let _skin: ICardCellSkin = Laya.Pool.getItemByClass(this.clsKey, _cls);
        if (!this.skinCtl) {
            this.skinCtl = new CardCellMsgCtl(_skin);
        }
        this.skinCtl.refresh(_data.vo);
        // if (_data.vo.isSelf) {
        // _skin.x = 0;//index * _skin.width;
        // } else {
        // _skin.x = 84;//this.panel.width - index * _skin.width;
        // }
        _skin.y = this.y;
        return _skin;
    }
}

/**弹幕历史 */
export class FightMsgHisShowView extends ViewBase{
    private model:ComposeModel;
    protected autoFree:boolean = true;
    protected mMask:boolean = true;
    private _ui:ui.views.compose.ui_fight_msghis_show_viewUI;
    private _panelCtl:ScrollPanelControl;
    protected onAddLoadRes(): void {
        // throw new Error("Method not implemented.");
    }

    protected onExit(): void {
        // throw new Error("Method not implemented.");
        this._panelCtl.clear();
    }

    protected onFirstInit(): void {
        // throw new Error("Method not implemented.");
        if(!this.UI){
            this.model = ComposeModel.Ins;
            this.UI = this._ui = new ui.views.compose.ui_fight_msghis_show_viewUI();
            this.bindClose(this._ui.closeBtn);
            this._panelCtl = new ScrollPanelControl();
            this._panelCtl.init(this._ui.panel1);    
        }
    }
    private getHisListByWave(l:HistroyMsgVo[],wave:number){
        let result:HistroyMsgVo[] = [];
        for(let i = 0;i < l.length;i++){
            let obj = l[i];
            if(obj.wave == wave){
                result.push(obj);
            }
        }
        return result;
    }
    protected onInit(): void {
        // throw new Error("Method not implemented.");

        let hislist = this.model.histroyMsgList;

        let _waveList:number[] = [];//波次列表
        for(let i = 0;i < hislist.length;i++){
            let obj = hislist[i];
            if(_waveList.indexOf(obj.wave) == - 1){
                _waveList.push(obj.wave);
            }
        }
        //============================================================
        this._panelCtl.clear();
        let gapH:number = 10;
        for(let i = _waveList.length - 1;i >= 0 ;i--){
            let  wave:number = _waveList[i];
            this._panelCtl.split([E.getLang(`waveCount`,wave)],FightMsgHisShowTitleCell,70,gapH);
            let _resultList = this.getHisListByWave(hislist,wave);
            this._panelCtl.split(_resultList,FightCardHisCellMsg,92,gapH);
        }
        this._panelCtl.end();
    }
}