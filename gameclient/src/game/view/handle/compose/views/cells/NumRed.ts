import { ui } from "../../../../../../ui/layaMaxUI";
/**数字红点 */
export class NumRed extends ui.views.compose.fightcell.ui_num_redUI {
    static CLS_KEY: string = "NumRed";
    pool:boolean = true;
    set num(v: number) {
        if (v > 0) {
            this.visible = true;
            this.tf.text = v + "";
            // if (v > 1) {
            //     this.tf.visible = true;
            //     this.tf.text = v + "";
            // }
            // else {
            //     this.tf.visible = false;
            // }
        }else{
            this.visible = false;
        }
    }

    dispose() {
        this.removeSelf();
        if(this.pool){
            Laya.Pool.recover(NumRed.CLS_KEY, this);
        }
    }
}
