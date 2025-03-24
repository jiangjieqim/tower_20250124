import { ComposeConfig } from "../ComposeConfig";
/**地图区块 */
export class FightMapItem extends Laya.Sprite{
    private tf:Laya.Label;
    constructor(){
        super();
        this.tf = new Laya.Label();
        this.addChild(this.tf);
        this.tf.color = "#ffffff";
        // this.tf.alpha = 0.5;
        this.graphics.drawRect(0,0,ComposeConfig.MapCellW,ComposeConfig.MapCellH,null,"#ff0000",1);
        this.alpha = 0.5;
    }

    setISO(x:number,y:number){
        this.tf.text = x + "," + y;
    }
}