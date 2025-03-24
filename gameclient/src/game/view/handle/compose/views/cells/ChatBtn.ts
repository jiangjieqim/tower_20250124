// import { ButtonCtl } from "../../../../../../frame/view/ButtonCtl";
import { ui } from "../../../../../../ui/layaMaxUI";
import { EViewType } from "../../../../../common/defines/EnumDefine";
import { E, ScreenAdapter } from "../../../../../G";
import { IFaceChatVo } from "../FaceChatView";

/**聊天按钮 */
export class ChatBtn extends ui.views.compose.fightcell.ui_chat_btnUI {
    private btnCtl:ButtonCtl;
    constructor() {
        super();
        this.btnCtl = ButtonCtl.CreateBtn(this.btn,this,this.onClickHander);
    }

    private onClickHander(){
        let vo:IFaceChatVo = {} as IFaceChatVo;
        vo.con = this;
        E.ViewMgr.Open(EViewType.FaceChatView,null,vo);
    }

    setCenter() {
        let offset: number = 10;
        if (this.parent) {
            (this.parent as Laya.Sprite).x = ScreenAdapter.UIRefWidth - this.width - offset;
            (this.parent as Laya.Sprite).y = Laya.stage.height - this.height - 441 - E.sdk.bottomInset - offset - (Laya.stage.height - ScreenAdapter.DefaultHeight) / 2;
        }
        // this.x = (this.parent as Laya.Sprite).width - this.width - offset;
        // this.y = Laya.stage.height - this.height - 441 - E.sdk.bottomInset - offset - (Laya.stage.height - ScreenAdapter.DefaultHeight)/2;
    }
}