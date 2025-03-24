import { ui } from "../../../../../../ui/layaMaxUI";
import { DotManager } from "../../../common/DotManager";
import { ESystemRefreshTime } from "../../ctl/ESystemRefreshTime";
import { System_RefreshTimeProxy } from "../../ctl/System_RefreshTimeProxy";
import { MainEvent } from "../../model/MainEvent";
import { MainModel } from "../../model/MainModel";
import { MainIconProxy } from "../../../funs/proxy/FunctionProxy";
import { EButtonStyle, FuncSmallIcon } from "../icon/FuncSmallIcon";
import { MainIconListBase } from "./MainIconListBase";
import { FunctionModel } from "../../../funs/FunctionModel";
import { TowerMainEvent } from "../../../towertmain/model/TowerMainEvent";
// import { DebugUtil } from "../../../../../../frame/util/DebugUtil";
import { TowerMainModel } from "../../../towertmain/model/TowerMainModel";

/**顶部按钮 */
export class TopBtnList extends MainIconListBase {

    private arrowBtn: Laya.Sprite;
    protected cellGap: number = 40;
    /**一列最多几个按钮 */
    public minRow: number;
    /**按钮容器 */
    con: Laya.Sprite;
    type:number;
    private _iconCfgList: Configs.t_MainIcon_dat[] = [];
    /**缩放为0.9倍的小按钮 */
    private static FuncSmallIconKey09: string = "FuncSmallIcon09";
    private curIconList: FuncSmallIcon[];
    /**一行最小的按钮数量 */

    init() {
        this.curIconList = [];
        let l1 = MainIconProxy.Ins.List;
        for (let i = 0; i < l1.length; i++) {
            let cfg: Configs.t_MainIcon_dat = l1[i];
            if (cfg.f_pos == this.type) {
                this._iconCfgList.push(cfg);
            }
        }
        this._iconCfgList.sort(this.f_sortSortHandler);
        MainModel.Ins.on(TowerMainEvent.FuncSmallIconUpdate, this, this.onRedUpdate);
        TowerMainModel.Ins.on(TowerMainEvent.FunctionChange, this, this.onRedUpdate);
    }

    private onRedUpdate() {
        this.refresh();
    }

    /**最多的按钮数量 */
    get maxCount() {
        return parseInt(System_RefreshTimeProxy.Ins.getVal(ESystemRefreshTime.RightMaxBtnCount));
    }

    bindBtn(btn: Laya.Image) {
        this.arrowBtn = btn;
        btn.on(Laya.Event.CLICK, this, this.onRightClick);
        DebugUtil.draw(btn);
    }

    /**小箭头的按钮点击事件 */
    private onRightClick() {
        this.btnDir = -1 * this.btnDir;
        this.refresh();
    }

    private _dir: number = 1;
    /**设置按钮的方向 */
    private set btnDir(v: number) {
        this._dir = v;
        (this.arrowBtn as Laya.Image).skin = v == 1 ? `remote/towerMain/yc.png` : `remote/towerMain/yc.png`;
    }

    /**-1缩着 1展开着 */
    private get btnDir() {
        return this._dir;
    }

    /**刷新 */
    refresh() {
        Laya.timer.callLater(this, this.onUpdate);
    }

    // private _timeCtl:MainTimeCtl;
    private onUpdate() {
        while (this.curIconList.length) {
            let cell = this.curIconList.pop();
            Laya.Pool.recover(TopBtnList.FuncSmallIconKey09, cell);
            cell.dispose();
        }

        let sx = 0;
        let sy = 0;
        let row: number = 0;
        let cellWidth: number;
        let openCount: number = 0;
        let maxH: number = 0;
        for (let i = 0; i < this._iconCfgList.length; i++) {
            let cfg = this._iconCfgList[i];
            if (openCount >= this.maxCount && this.btnDir == -1) {

            } else if (this.isOpen(cfg)) {
                openCount++;
                if (row >= this.minRow) {
                    row = 0;
                    if(this.type == 1){
                        sx += cellWidth;
                        sy = 0;
                    }else if(this.type == 2){
                        sx -= cellWidth;
                        sy = 0;
                    }
                }
                let item = Laya.Pool.getItemByClass(TopBtnList.FuncSmallIconKey09, FuncSmallIcon);
                this.curIconList.push(item);
                item.initSkin(ui.views.main.ui_tower_main_iconUI);//ui.views.main.ui_main_icon_09UI
                cellWidth = item.skin.width + this.cellGap - 5;
                item.refresh(item.skin as any, cfg.f_funid, EButtonStyle.Pos, sx, sy);
                item.skin["timeCtl"].visible = false;
                // if (item.skin["timeCtl"]) {
                //     if (cfg.f_funid == EFuncDef.xianshilibao) {
                //         item.skin["timeCtl"].visible = true;
                //         if(!this._timeCtl){
                //             this._timeCtl = new MainTimeCtl(item.skin["timeCtl"]);
                //         }
                //         this._timeCtl.setTime();
                //     } else {
                //         item.skin["timeCtl"].visible = false;
                //     }
                // }
                this.con.addChild(item.skin);
                sy += item.skin.height + this.cellGap;
                row++;
                if (sy >= maxH) {
                    maxH = sy;
                }
            }
        }

        DebugUtil.draw(this.con, "#ff0000", cellWidth, maxH);
        this.arrowBtn.visible = false;
        // if(this._iconCfgList.length > this.minRow){
        //     this.arrowBtn.visible = true;

        //     let fid = this.updateArrowBtnRed();
        //     if (fid) {
        //         DotManager.addDot(this.arrowBtn);
        //     } else {
        //         DotManager.removeDot(this.arrowBtn);
        //     }
        //     DebugUtil.drawTF(this.arrowBtn, fid, "#00ff00");
        // }else{
        //     this.arrowBtn.visible = false;
        // }
    }

    /**功能是否开启了 */
    private isOpen(cfg: Configs.t_MainIcon_dat) {
        return cfg && FunctionModel.Ins.isOpenByFuncId(cfg.f_funid,false);// && FunctionModel.Ins.isSubOpen(cfg);
    }

    private updateArrowBtnRed() {
        let l = [];
        for (let i = 0; i < this._iconCfgList.length; i++) {
            let cfg: Configs.t_MainIcon_dat = this._iconCfgList[i];
            if (this.isOpen(cfg)) {
                l.push(cfg)
            }
        }
        let _newList = [];
        while (l.length > this.maxCount) {
            _newList.push(l.pop());
        }
        for (let i = 0; i < _newList.length; i++) {
            let cfg = _newList[i];
            if (this.hasRedMainCfg(cfg.f_id)) {
                return cfg.f_funid;
            }
        }
        return 0;
    }

    private hasRedMainCfg(id: number) {
        let cfg: Configs.t_MainIcon_dat = MainIconProxy.Ins.GetDataById(id);
        let red: boolean = false;
        /*
        let _checkSubFuncList = MainIconProxy.Ins.getFuncListByF_ui_id(cfg.f_ui_id);
        if (_checkSubFuncList.length) {
            for (let i = 0; i < _checkSubFuncList.length; i++) {
                let funcId: number = _checkSubFuncList[i];
                if (this.getHasRed(funcId)) {
                    red = true;
                    break;
                }
            }
        } else {

        }
        */
        if (!red) {
            let funcId = cfg.f_funid;
            if (FunctionModel.Ins.getHasRed(funcId)) {
                red = true;
            }
        }

        return red;
    }

    getByFuncId(funcId: number) {
        let l = this.curIconList;
        for (let i = 0; i < l.length; i++) {
            let cell = l[i];
            if (cell.funcId == funcId) {
                return cell.skin;
            }
        }
    }
}