
// export class DebugUtil {
//     /**紫色 */
//     public static COLOR_PURPLE:string = "#ff00ff";
//     private static get canDraw(){
//         // if(Laya.Utils.getQueryString("disable_debug_draw")){
//         //     return false;
//         // }
//         return debug;
//     }
//     public static draw(p: Laya.Sprite, color: string = "#00ff00",w?:number,h?:number,x:number = 0,y:number = 0,full:boolean = false,lineW:number = 1) {
//         if (p) {
//             this.realDraw(p,color,w,h,x,y,full,lineW);
//         }
//     }

//     private static realDraw(p: Laya.Sprite, color: string = "#00ff00",w?:number,h?:number,x:number = 0,y:number = 0,full:boolean = false,lineW:number = 1){
//         if(this.canDraw){
//             let keyName:string = "debugspr";
//             if(p.getChildByName(keyName)){
//                 p.getChildByName(keyName).removeSelf();
//             }
//             let spr = new Laya.Sprite();
//             spr.name = keyName;
//             spr.mouseThrough = true;
//             spr.width = p.width;
//             spr.height = p.height;
//             spr.graphics.clear();
//             let offset = 3;
//             spr.graphics.drawRect(x + offset, y + offset, (w || p.width) - offset * 2, (h || p.height) - offset * 2, !full?null:color, color, lineW);
//             spr.alpha = full ? 0.5 : 1;
//             p.addChild(spr);
//         }
//     }

//     public static drawCross(p: Laya.Sprite, x: number = 0, y: number = 0, _size: number = 10,_color:string = "#0000ff") {
//         if (this.canDraw) {
//             let con = new Laya.Sprite();
//             let size: number = _size;
//             con.graphics.clear();
//             con.graphics.drawLine(x - size, y, x + size, y, _color);
//             con.graphics.drawLine(x, y - size, x, y + size, _color);
//             p.addChild(con);
//         }
//     }
//     public static drawRect(p: Laya.Sprite, x: number = 0, y: number = 0, _size: number = 10,_color:string = "#00ff00") {
//         if (this.canDraw) {
//             let con = new Laya.Sprite();
//             let n: number = _size;
//             con.graphics.clear();
//             con.graphics.drawRect(x-n/2,y-n/2,n,n,null,_color,1);
//             p.addChild(con);
//         }
//     }
//     public static drawCirle(p: Laya.Sprite, x: number = 0, y: number = 0, _size: number = 5,_color:string = "#ff0000") {
//         if (this.canDraw) {
//             let con = new Laya.Sprite();
//             con.graphics.clear();
//             con.graphics.drawCircle(x,y,_size,null,_color,1)
//             p.addChild(con);
//         }
//     }

//     public static drawTF(view: Laya.Sprite, content: string,color:string="#ff0000",ox:number = 0,oy:number = 0) {
//         if (this.canDraw) {
//             this.realDrawTF(view,content,color,ox,oy);
//         }
//     }

//     private static realDrawTF(view: Laya.Sprite, content: string,color:string="#ff0000",ox:number,oy:number){
//         let key = "debugTf";
//         view.getChildByName(key);
//         if (view.getChildByName(key)) {
//             view.getChildByName(key).removeSelf();
//         }
        
//         if(StringUtil.IsNullOrEmpty(content)){
//             return;
//         }

//         let lb = new Laya.Label();
//         lb.stroke = 2;
//         lb.strokeColor = "#000000";
//         lb.color = color;
//         view.addChild(lb);
//         lb.x = ox;
//         lb.y = oy;
//         lb.name = key;
//         lb.fontSize = 18;
//         lb.text = content;
//     }

//     static createTf(){
//         let tf = new Laya.Label();
//         tf.fontSize = 22;
//         tf.color = "#00ff00";
//         tf.stroke = 2;
//         tf.strokeColor = "#000000"
//         // tf.text = name;
//         // this.addChild(tf);
//         // tf.x = (this.width - tf.textField.textWidth)/2;
//         // tf.y = (this.height - tf.textField.textHeight)/2;
//         return tf;
//     }
// }