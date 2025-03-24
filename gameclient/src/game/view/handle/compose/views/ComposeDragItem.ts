import { ComposeConfig } from "../ComposeConfig";
/**拖拽小格子皮肤,空格子 */
export class ComposeDragItem extends Laya.Sprite{
    constructor(){
        super();
        this.width = ComposeConfig.cellW;
        this.height = ComposeConfig.cellH;
        if(debug){
            this.graphics.drawRect(0,0,this.width,this.height,null,"#00ff00",3);
        }
    }
    dispose(){
        this.removeSelf();
    }
}