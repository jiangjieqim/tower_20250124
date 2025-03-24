import { ColorUtil } from "../util/ColorUtil";

// export class DefaultButton extends Laya.Image {
//     constructor(clickHandler: Laya.Handler) {
//         super();
//         this.skin = `remote/common/base/anniu_green.png`;
//         let btnCtl = new ButtonCtl(this, clickHandler);
//         this.sizeGrid = "15,15,15,15";
//         this.width = 150;
//         this.height = 70;
//     }
// }

export class ButtonSkin extends Laya.Image {
    tf:Laya.Label;
    constructor(name: string = "", clickHandler: Laya.Handler = null, x: number = 0, y: number = 0,w:number = 150,h:number = 50) {
        // skin:string = "remote/base/btn_s.png",color:string= "#000000"
        super();
        // if(fill){
        // this.skin = skin;


        this.alpha = 0.75;
        this.width = w;;
        this.height = h;
        let _fullColor:string = "#ffff00";
        this.graphics.clear();
        this.graphics.drawRect(0,0,this.width,this.height,_fullColor);

        // this.sizeGrid = "0,50,0,50";
        // this.graphics.drawRect(0,0,this.width,this.height,"#ffffff");
        // this.graphics.drawRect(0, 0, this.width, this.height, null, "#ff0000", 1);
        // this.alpha = 0.5;
        // }else{
        // this.skin = `remote/common/base/anniu_green.png`;//"comp/button.png";
        // }
        // this.state = 1;
        // this.label = name;
        // this.labelSize *= 2;
        // this.labelColors = "#ffffff";
        // this.labelStroke = 1;
        // this.labelStrokeColor = "#000000";
        
        // this.clickHandler = clickHandler;
        this.on(Laya.Event.CLICK,this,()=>{
            if(clickHandler){
                clickHandler.runWith(this);
            }
        })

        this.hitArea = new Laya.Rectangle(0,0,this.width,this.height);
        let tf = new Laya.Label();
        tf.fontSize = 22;//h * 0.75;
        tf.color = ColorUtil.getColorInverse(_fullColor);
        // tf.stroke = 1;
        // tf.strokeColor = "#000000"
        tf.text = name;
        this.addChild(tf);
        tf.x = (this.width - tf.textField.textWidth)/2;
        tf.y = (this.height - tf.textField.textHeight)/2;
        this.tf = tf;
        this.x = x;
        this.y = y;
        DebugUtil.draw(this);
    }

    layout(){
        let tf = this.tf;
        tf.x = (this.width - tf.textField.textWidth)/2;
        tf.y = (this.height - tf.textField.textHeight)/2;
    }
}