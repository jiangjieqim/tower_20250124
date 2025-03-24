//飘字组件
// import { AtlasParser, IMSpineRegions } from "../SpineSwitchSkin";
// import { SpineTemplet_3_8_v1 } from "../SpineTemplet_3_8_v1";

// interface IFontTexture{
//     tex:Uint8Array;
//     w:number;
//     h:number;
//     x:number;
// }

// export class SpineFontTexture{
//     private templet:SpineTemplet_3_8_v1;
//     private fileList:IMSpineRegions[];
//     private _tex: Laya.Texture;
//     // private _usePartsList:string[] = [];
//     public dispose(){
//         this.templet.destroy();
//         // this._tex.disposeBitmap();
//     }
//     constructor(templet:SpineTemplet_3_8_v1,input:string){
//         this.templet = templet;
//         let _url: string = `${input}.png`;
//         let _boxsell_atlas: string = `${input}.atlas`;
//         let _tex: Laya.Texture = Laya.Loader.getRes(_url);
//         this._tex = _tex;
//         let fileList = AtlasParser.Start(Laya.Loader.getRes(_boxsell_atlas));
//         this.fileList = fileList;
//     }

//     private getCell(name:string):IMSpineRegions{
//         for(let i = 0;i < this.fileList.length;i++){
//             let cell = this.fileList[i];
//             if(cell.name == name){
//                 return cell;
//             }
//         }
//     }

//     /**清除指定的部分 */
//     public clearPart(part:string){
//         let cell = this.getCell(part);
//         let w = cell.width;
//         let h = cell.height;
//         let clear = new Uint8Array(w*h * 4);
//         this.templet.fillSkin(clear,part);//清理填充
//     }

//     // private checkClearPart(part:string){
//     //     if(this._usePartsList.indexOf(part)==-1){
//     //         this.clearPart(part);
//     //         this._usePartsList.push(part);
//     //     }
//     // }

//     public setText(part:string="icon_12",txt:string = "",suffix:string="h",algin:string = "left"){
//         // this.checkClearPart(part);
//         this.clearPart(part);
        
//         let cell = this.getCell(part);
//         let w = cell.width;
//         let h = cell.height;
//         // let clear = new Uint8Array(w*h * 4);
//         // this.templet.fillSkin(clear,part);//清理填充

//         let curW:number = 0;
//         let l:IFontTexture[] = [];
//         for(let i = 0;i < txt.length;i++){
//             let a = txt.substr(i,1);
//             let cur = this.getCell(suffix+a);
//             let texData = this._tex.getPixels(cur.x,cur.y,cur.width,cur.height);
//             // this.templet.fillRect(texData,cell.x+curW,cell.y,cur.width,cur.height);

//             let fcell:IFontTexture = {} as IFontTexture;
//             fcell.tex = texData;
//             fcell.w = cur.width;
//             fcell.h = cur.height;
//             fcell.x = curW;
//             l.push(fcell);
//             curW+=cur.width;
//         }

//         let _offsetX:number = 0;
//         if(algin == "middle"){
//             _offsetX = (w - curW) / 2;
//         }
//         while(l.length > 0){
//             let f:IFontTexture = l.pop();
//             this.templet.fillRect(f.tex,cell.x+f.x + _offsetX,cell.y,f.w,f.h);
//         }
//     }
// }