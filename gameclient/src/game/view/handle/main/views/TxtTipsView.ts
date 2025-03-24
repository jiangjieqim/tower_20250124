import { ui } from "../../../../../ui/layaMaxUI";
import { SmallTipsView } from "./SmallTipsView";
/**文本tips */
export class TxtTipsView extends SmallTipsView{
    protected mShowUpdate:boolean = true;
    private oldY:number = 0;
    private skin:ui.views.common.ui_txt_tipsUI;
    protected initUI(){
        this.UI = this._ui = this.skin = new ui.views.common.ui_txt_tipsUI();
        this.oldY = this.skin.desc.y;
    }
    protected updateContent(){
        let _data = this._data;
        this.skin.desc.text = _data.content;
        this.skin.tf.text = _data.title;
        let offset: number = 20;

        if(this._data.title == ""){
            this.skin.desc.y = 11;
        }else{
            this.skin.desc.y = this.oldY;
        }

        this.skin.img.height = this.skin.desc.textField.height + this.skin.desc.y + offset;
    }
}