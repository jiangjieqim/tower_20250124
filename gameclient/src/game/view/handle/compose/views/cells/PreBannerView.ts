// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { E } from "../../../../../G";
import { ComposeModel } from "../../ComposeModel";

class PreBtnView extends ui.views.compose.fightcell.ui_pre_btnUI {
    viewType: EViewType;
    private btnCtl: ButtonCtl;
    constructor(lb: string, url: string) {
        super();
        this.icon.skin = url;
        this.pb_fork.visible = false;
        this.lb.text = E.getLang(lb);
        this.btnCtl = ButtonCtl.CreateBtn(this.btn, this, this.onClickHandler);
    }
    protected onClickHandler() {
        E.ViewMgr.Open(this.viewType);
    }

    dispose() {
        this.btnCtl.dispose();
        this.btnCtl = null;
    }
}
/**屏蔽按钮*/
class FilterBtn extends PreBtnView {
    private get model(){
        return ComposeModel.Ins;
    }
    constructor() {
        super("yllbPB", 'remote/fight/icon_pb.png');
        this.fork = this.model.isFork;
    }

    set fork(v: boolean) {
        this.model.isFork = v;
        this.pb_fork.visible = v;
    }

    get fork() {
        return this.pb_fork.visible;
    }
    /**设置屏蔽状态 */
    protected onClickHandler() {
        this.fork = !this.fork;
    }
}

/**顶部预览按钮 */
class TopPreBtn{
    bSwitchSkin:boolean = false;
    private btn: ButtonCtl;//预览
    private rImg:Laya.Image;
    private skin:Laya.Image;
    constructor(skin:Laya.Image,rImg:Laya.Image){
        this.skin = skin;
        this.rImg = rImg;
        this.btn = ButtonCtl.CreateBtn(skin, this, this.onYuLanBtnClick);
    }
    
    private onYuLanBtnClick() {
        this.rImg.visible = !this.rImg.visible;
        this.updateYlBtn();
    }
    
    private updateYlBtn(){
        if(this.bSwitchSkin){
            if (this.rImg.visible) {
                this.skin.skin = "remote/fight/icon_gb.png";
            } else {
                this.skin.skin = "remote/fight/icon_yl.png";
            }
        }
    }

    init(){
        this.rImg.visible = false;
        this.updateYlBtn();
    }
    dispose(){
        this.btn.dispose();
        this.btn = null;
    }
}
export interface IPreBannerSkin extends Laya.Sprite{
    btn_yulan: Laya.Image;
    rImg: Laya.Image;
}
/**预览栏视图 */
export class PreBannerView {
    bSwitchSkin:boolean;
    uiTypes:EViewType[];
    /**对齐方式 */
    algin:string;
    skin:IPreBannerSkin;
    private filterBtn: FilterBtn;
    private _btnList: PreBtnView[] = [];
    private _topPreBtn:TopPreBtn;
    init(){
        this._topPreBtn = new TopPreBtn(this.skin.btn_yulan,this.skin.rImg);
        this._topPreBtn.bSwitchSkin = this.bSwitchSkin;
        // this.createPreBtn("yllbTJ", 'remote/fight/icon_tj.png', EViewType.FightPossess);
        // this.createPreBtn("yllbRW", 'remote/fight/icon_rw.png', EViewType.FightTask);
        // this.createPreBtn("yllbJL", 'remote/fight/icon_jl.png', EViewType.FightMsgHisShowView);
        
        for(let i = 0;i < this.uiTypes.length;i++){
            let uiType:EViewType = this.uiTypes[i];
            this.createByType(uiType);
        }

        this.filterBtn = new FilterBtn();
        this._btnList.push(this.filterBtn);
        this.layout();
        this._topPreBtn.init();
    }

    private createByType(type:EViewType){
        let lb:string;
        let url:string;
        switch(type){
            case EViewType.FightPossess:
                lb = "yllbTJ";
                url = 'remote/fight/icon_tj.png';
                break;
            case EViewType.FightTask:
                lb = "yllbRW";
                url = 'remote/fight/icon_rw.png';
                break;
            case EViewType.FightMsgHisShowView:
                lb = "yllbJL";
                url = 'remote/fight/icon_jl.png';
                break;
        }

        if(!StringUtil.IsNullOrEmpty(lb)){
                this.createPreBtn(lb, url, type);
        }
    }

    private layout() {
        let offsetY:number = 20;
        for (let i = 0; i < this._btnList.length; i++) {
            let cell = this._btnList[i];
            cell.x = (this.skin.rImg.width - cell.width) / 2;
            cell.y = offsetY+cell.height * i;
            this.skin.rImg.addChild(cell);
        }
        this.skin.rImg.height = this._btnList.length * 60 + offsetY * 2;
        if(this.algin == "bottom"){
            // this.skin.rImg.y = -this.skin.btn_yulan.height;

        }
    }

    // /**是否伤害数字屏蔽 */
    // get isFork() {
    //     return this.filterBtn.fork;
    // }

    private createPreBtn(lb: string, url: string, viewType: EViewType) {
        let btn = new PreBtnView(lb, url);
        btn.viewType = viewType;
        this._btnList.push(btn);
        return btn;
    }

    destory(){
        this.skin.destroy();
    }
}