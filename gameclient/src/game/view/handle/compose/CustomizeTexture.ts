export class CustomizeTexture{
    texture:Laya.Texture;
    static GetTextureByUrlCallBack(url:string,url1:string,x:number,y:number,callBack:Laya.Handler){
        Laya.loader.load(url,new Laya.Handler(this,()=>{

            let img = new CustomizeTexture();
            img.texture = Laya.loader.getRes(url);
            callBack.runWith(img);
        }));
    }
}