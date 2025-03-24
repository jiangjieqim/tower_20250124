// import { DebugUtil } from "../../../../../../frame/util/DebugUtil";
import { ui } from "../../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { E } from "../../../../../G";
import { stBattleBuff, stBattleStatistic, stPlayerInRoom } from "../../../../../network/protocols/BaseProto";
import { ISmallTips } from "../../../main/interface/Interface";
import { ItemViewFactory } from "../../../main/model/ItemViewFactory";
import { SmallTipsView } from "../../../main/views/SmallTipsView";
import { ComposeModel } from "../../ComposeModel";
import { EBufferValueType, FightPlayerAttrVo } from "../../vos/FightPlayerAttrVo";
/**统计内的buff */
class FightPossessAttrCell extends ui.views.compose.fightcell.ui_fight_possess_attr_cellUI {
    static CLS_NAME:string = `FightPossessAttrCell`
    private vo: FightPlayerAttrVo;
    constructor() {
        super();
        DebugUtil.draw(this);
        this.on(Laya.Event.CLICK, this, this.onClickHandler);
    }

    private onClickHandler(e:Laya.Event) {
        e.stopPropagation();
        let _smallTipsData: ISmallTips = {} as ISmallTips;
        _smallTipsData.target = this;
        _smallTipsData.param = this.vo;
        E.ViewMgr.Open(EViewType.PossessBuffTips, null, _smallTipsData);
    }

    setData(vo: FightPlayerAttrVo) {
        this.vo = vo;
        this.icon.skin = vo.icon;
        this.tf.text = vo.text;
    }

    free(){
        this.removeSelf();
    }
}

/**局内统计的buff控制器 */
export class FightPossessAttrPlayerCtl {
    private container: Laya.Sprite;
    // private player: stPlayerInRoom;
    private readonly cellH: number = 45;
    private readonly cellGap: number = 10;
    /**一行最多可以有几个buff icon */
    row: number = 5;
    private get model() {
        return ComposeModel.Ins;
    }
    constructor(container: Laya.Sprite) {
        this.container = container;
        // this.player = player;
    }

    /**合并属性 */
    private merge(ilist:stBattleBuff[]):stBattleBuff[]{
        let l = [];
        let attrMap = {};
        for(let i = 0;i < ilist.length;i++){
            let o = ilist[i];
            if(!attrMap[o.attrId]){
                attrMap[o.attrId] = 0;
            }
            let v:number = (o.operator == EBufferValueType.Small ? -1 : 1) * o.attrValue;
            attrMap[o.attrId]+= v;
        }

        for(let o in attrMap){
            let v:number = attrMap[o];
            let obj = new stBattleBuff();
            obj.attrId = o as any;
            obj.operator = v < 0 ? EBufferValueType.Small : EBufferValueType.Big;
            obj.attrValue = Math.abs(v);
            l.push(obj);
        }
        return l;
    }
    refreshList(bufflist:stBattleBuff[]){
        this.clear();
        let _l: FightPlayerAttrVo[] = [];
        let buffs = this.merge(bufflist);
        for (let i = 0; i <buffs.length; i++) {
            let obj = new FightPlayerAttrVo(buffs[i]);
            if (obj.cfg.f_buff_appear) {
                _l.push(obj);
            }
        }
        let cellW: number;
        for (let i = 0; i < _l.length; i++) {
            let cell = Laya.Pool.getItemByClass(FightPossessAttrCell.CLS_NAME,FightPossessAttrCell);//new FightPossessAttrCell();
            cell.icon.enableClearTex = false;
            cellW = cell.width;
            cell.setData(_l[i]);
            this.container.addChild(cell);
        }
        LayoutUtil.CenterLayout(this.container, cellW, this.cellGap, this.row);
    }

    refresh(battleStaticList: stBattleStatistic[], player: stPlayerInRoom) {
        // let battleStaticList = this.model.battleStaticList;
        if (player) {
            let vo = battleStaticList.find(o => o.playerId == player.playerId);
            if (vo) {
                this.refreshList(vo.bufflist);
            }
        }
    }

    get height() {
        return Math.ceil(this.container.numChildren / this.row) * (this.cellH + this.cellGap);
    }
    private clear(enableDispose:boolean = false) {
        while (this.container.numChildren) {
            let cell:FightPossessAttrCell = this.container.getChildAt(0) as FightPossessAttrCell;
            cell.icon.enableClearTex = enableDispose;
            Laya.Pool.recover(FightPossessAttrCell.CLS_NAME,cell);
            cell.free();
        }
    }

    dispose() {
        this.clear(true);
        Laya.Pool.clearBySign(FightPossessAttrCell.CLS_NAME);
        this.container = null;
    }
}
/**局内统计的小tips */
export class PossessBuffTips extends SmallTipsView {
    protected mShowUpdate: boolean = true;
    private skin: ui.views.compose.fightcell.ui_possess_tipsUI;
    protected initUI() {
        this.UI = this._ui = this.skin = new ui.views.compose.fightcell.ui_possess_tipsUI();
    }
    // private index:number = 0;

    protected updateContent() {
        let _data: ISmallTips = this.Data;
        let _vo: FightPlayerAttrVo = _data.param;
        this.skin.lb0.text = _vo.cfg.f_buff_text;
        // LogSys.Log(`${this.ViewType}---f_attributeid:${_vo.cfg.f_attributeid}`);
        
        // if(debug){
        //     this.index++;
        //     this.skin.lb0.text = this.index % 2 == 1?"你好哈你好哈你好哈":"你好哈你好哈你好哈好哈";
        // }
        this.skin.lb1.text = _vo.text;
        this.skin.lb1.color = _vo.color;    
        let gap:number = 14;
        this.skin.lb0.x = gap;
        this._ui.img.width = this.skin.lb0.textField.textWidth + gap * 2;
        this.skin.lb1.x = this.skin.lb0.x;
    }
}