import { ScrollPanelControl } from "./ScrollPanelControl";

/**
 * 使用下三角显示
 */
export class TriangleScrollPanelControl extends ScrollPanelControl{
    private down:Laya.Sprite;
    public onScrollBarChange () {
        super.onScrollBarChange();
        // console.log(this.panel.vScrollBar.value);
        // console.log("#",this.getPanel().height,this.getAllHeight())
    
        this.showHideDown();
    }
    public setTriangleIcon(down:Laya.Sprite){
        this.down = down;
        this.on(ScrollPanelControl.EVENT_END,this,this.onEndHandler);
    }

    private onEndHandler(){
        this.showHideDown();
    }

    private showHideDown(){
        let panel = this.getPanel();
        if(panel.destroyed){
            return;
        }
        let h = this.getPanel().height;
        let allh = this.getAllHeight();

        if(h >= allh){
            this.down.visible = false;
        }else{
            if(this.getPanel().vScrollBar.value == allh - h){
                this.down.visible = false;
            }else{
                this.down.visible = true;
            }
        }
    }
}