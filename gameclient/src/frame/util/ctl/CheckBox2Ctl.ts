
interface ICheckBoxSkin extends Laya.EventDispatcher{
     bg:Laya.Image;
     kaiimg:Laya.Image;
     kai:Laya.Label;
     tf:Laya.Label;
}

export class CheckBox2Ctl{
    private skin:ICheckBoxSkin;//ui.views.main.ui_checkbox_02UI;
    private _sel:boolean = false;
    public selectHander:Laya.Handler;

    constructor(skin:ICheckBoxSkin,label:string=""){//:ui.views.main.ui_checkbox_02UI
        this.skin = skin;
        this.skin.on(Laya.Event.CLICK,this,this.onClickHander);
        this.selected = this._sel;
        this.skin.tf.text = label;
    }

    private onClickHander(){
        this.selected = !this.selected;
        if (this.selectHander) {
            this.selectHander.run();
        }
    }

    public set selected(v) {
        this._sel = v;
        if (v) {
            this.skin.bg.skin = "remote/shezhi/bottom_s.png";
            this.skin.kaiimg.x = 78;
            this.skin.kai.text = "开";
            this.skin.kai.x = 24;
        } else {
            this.skin.bg.skin = "remote/shezhi/bottom_n.png";
            this.skin.kaiimg.x = -1;
            this.skin.kai.text = "关";
            this.skin.kai.x = 73;
        }
    }

    public get selected(){
        return this._sel;
    }
}