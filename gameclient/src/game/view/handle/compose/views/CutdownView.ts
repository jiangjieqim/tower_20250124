import { ui } from "../../../../../ui/layaMaxUI";

export class CutdownView extends ui.views.compose.ui_cutdown_viewUI{
    constructor(){
        super();
    }

    set time(v:number){
        if(v<=0){
            this.closeUI();
            return;
        }
        this.timetf.text = v + "";
    }

    private closeUI(){
        this.removeSelf();
    }
}