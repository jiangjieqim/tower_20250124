// import { ButtonCtl } from "../../../../../frame/view/ButtonCtl";
import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { EPageType } from "../../../../common/defines/EnumDefine";
import { E } from "../../../../G";
import { ECellType } from "../../main/vos/ECellType";
import { TowerMainEvent } from "../../towertmain/model/TowerMainEvent";
import { TowerMainModel } from "../../towertmain/model/TowerMainModel";
import { ComposeModel } from "../ComposeModel";
import { FightUIFactory } from "../FightUIFactory";
import { CardMoneyCtl } from "./cells/CardMoneyCtl";
import { GambleCellView } from "./cells/GambleCellView";
/**赌博 */
export class GambleView extends ViewBase {
    public PageType: EPageType = EPageType.None;
    protected autoFree:boolean = true;
    private _ui: ui.views.compose.ui_gamble_viewUI;
    private model: ComposeModel;
    private jadeTfCtl:CardMoneyCtl;
    private gamblelist:GambleCellView[] = [];
    protected onAddLoadRes(): void {
    }
    protected onExit(): void {
        if(this.jadeTfCtl){
            this.jadeTfCtl.dispose();
            this.jadeTfCtl = null;
        }
        while(this.gamblelist.length){
            let cell = this.gamblelist.shift();
            cell.dispose();
        }
        this.model.fightTypeAdaper.gambleExit();
        TowerMainModel.Ins.off(TowerMainEvent.ValChangeCell, this, this.onUpdateMoney);
    }
    protected onFirstInit(): void {
        if (!this.UI) {
            this.model = ComposeModel.Ins;
            this.UI = this._ui = new ui.views.compose.ui_gamble_viewUI();
            this._ui.descTf.text = E.getLang("lucktips");
            
            // for(let i = 0;i < 3;i++){
            //     let cell = new GambleCellView();
            //     cell.x = 210 * i;
            //     // cell.refresh(dataList[i])
            //     // cell.init();
            //     this._ui.con1.addChild(cell);
            // }
            
            // this.bindClose(this._ui.btn_close);
            ButtonCtl.CreateBtn(this._ui.btn_close,this,this.onCloseHandler1);
        }
    }

    private onCloseHandler1(){
        Laya.timer.once(100,this,this.onCloseLater);
    }

    private onCloseLater(){
        E.ViewMgr.Close(this.ViewType);
    }

    protected onInit(): void {
        let dataList = this.model.fightTypeAdaper.gambleVoList;

        for(let i = 0;i < dataList.length;i++){
            let cell =  new GambleCellView();
            // this._ui.con1.getChildAt(i) as GambleCellView;
            cell.x = 210 * i;
            cell.refresh(dataList[i]);
            cell.init();
            this._ui.con1.addChild(cell);
            this.gamblelist.push(cell);
        }

        this.jadeTfCtl = FightUIFactory.createCardMoney(this._ui.lab1,null,ECellType.FIGHT_STONE);

        for(let i = 0;i < this._ui.con1.numChildren;i++){
            let cell:GambleCellView = this._ui.con1.getChildAt(i) as GambleCellView;
            cell.updateView();
        }
        TowerMainModel.Ins.on(TowerMainEvent.ValChangeCell, this, this.onUpdateMoney);
        this.jadeTfCtl.update();
        this.moneyLayout();
    }

    private onUpdateMoney(id: ECellType) {
        if (id == ECellType.FIGHT_STONE) {
            this.jadeTfCtl.play();
            this.moneyLayout();
        }
    }

    private moneyLayout(){
        this._ui.icon1.x = ((this._ui.icon1.parent as Laya.Sprite).width - (this._ui.icon1.width * this._ui.icon1.scaleX) - this._ui.lab1.textField.textWidth)/2;
        this._ui.lab1.x = this._ui.icon1.x + (this._ui.icon1.width * this._ui.icon1.scaleX);
    }

    protected SetCenter() {
        this.bottomLayout();
    }
}