import { ViewBase } from "../../../../../frame/view/ViewBase";
import { ui } from "../../../../../ui/layaMaxUI";
import { t_Trophy_Rank_Reward } from "../model/t_Trophy_Rank_Reward";
import { RankRewItem } from "./RankRewItem";

export class RankRewView extends ViewBase{
    private _ui:ui.views.rank.ui_rankRewViewUI;

    protected mMask = true; 
    protected mMainSnapshot = true;
    protected autoFree:boolean = true;

    protected onAddLoadRes(): void {
        this.addAtlas('rank.atlas');
    }

    protected onFirstInit(): void {
        if (!this.UI) {
            this.UI = this._ui = new ui.views.rank.ui_rankRewViewUI();
            this.bindClose(this._ui.btn_close);

            this._ui.list.itemRender = RankRewItem;
            this._ui.list.renderHandler = new Laya.Handler(this,this.onRenderHandler);
        }
    }

    private onRenderHandler(item:RankRewItem){
        item.setData(item.dataSource);
    }

    protected onInit(): void {
        this._ui.list.array = t_Trophy_Rank_Reward.Ins.List;
    }

    protected onExit(): void {
        
    }
}