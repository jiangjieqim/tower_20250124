
//战斗中的美术字
export class FontClipCtl{
    private l:Laya.Image[] = [];
    private container:Laya.Sprite;
    private key:string = "fontImage";
    private atlas:string;
    public mScale:number = 1;
    public mWidth:number = 0;
    public offsetX:number = 0;
    constructor(atlas:string){
        this.atlas = atlas;
    }

    public setText(container:Laya.Sprite,v:string){
        this.mWidth = 0;
        while(this.l.length > 0){
            let img:Laya.Image =  this.l.pop();
            img.removeSelf();
            Laya.Pool.recover(this.key,img);
        }
        let img:Laya.Image = Laya.Pool.getItemByClass(this.key,Laya.Image);
        img.x = img.y = 0;
        img.skin = this.atlas+`${v}.png`;
        this.mWidth = img.width;
        container.addChild(img);
        this.l.push(img);
    }

    // /*数字默认偏移-2个像素*/
    // public setNum(container:Laya.Sprite,v:string,align:string = "left"){
    //     this.setValue(container,v,align,-2);
    // }

    public clear(container:Laya.Sprite){
        this.setValue(container,"");
    }

    public setCn(container:Laya.Sprite,v:string){
        let arr = ['一','二','三','四','五','六','七','八','九','十'];
        let str = "";
        for(let i = 0;i < v.length;i++){
            let index = arr.indexOf(v[i]);
            str+=index.toString()+"";
        }
        this.setValue(container,str);
    }
    dispose(){
        if(this.container){
            this.clear(this.container);
        }
    }
    /**
     * 
     * @param container 
     * @param v 
     * @param align "left" "middle"
     * @param offset 
     */
    public setValue(container: Laya.Sprite, v: string, align: string = "left", offset: number = 0) {
        this.container = container;
        // container.graphics.clear();
        // container.graphics.drawRect(0,0,100,100,null,"#ff0000",1);

        if(this.offsetX){
            offset = this.offsetX;
        }
        // if(align == "right"){
        //     let str = v;
        //     let newStr = str.split("").reverse().join("");
        //     v = newStr;
        // }
        container.scaleX = container.scaleY = this.mScale;
        while(this.l.length > 0){
            let img:Laya.Image =  this.l.pop();
            img.removeSelf();
            Laya.Pool.recover(this.key,img);
        }
        this.mWidth = 0;
        let w:number = 0;
        let h:number = 0;
        for(let i = 0;i < v.length;i++){
            let img:Laya.Image = Laya.Pool.getItemByClass(this.key,Laya.Image);
            container.addChild(img);
            img.skin = this.atlas+`${v[i]}.png`;//`blood/${v[i]}.png`;
            img.x = w;
            // if(E.Debug){
            //     let g = new Laya.Sprite();
            //     g.graphics.drawRect(0,0,img.width,img.height,null,"#ff0000");
            //     img.addChild(g);
            // }
            if(h < img.height){
                h = img.height;
            }
            w += (img.width+offset);
            this.l.push(img);
        }
        this.mWidth = w;
        let half:number = w/2;
        for (let i = 0; i < this.l.length; i++) {
            let img = this.l[i];
            img.y = (h - img.height) / 2;
            if(align == "right"){
                img.x-=w;
            }else if(align == "middle"){
                img.x=img.x-half;
            }
        }
        if(debug){
            container.graphics.clear();
            container.graphics.drawRect(0,0,this.mWidth,h,null,"#ff0000");
        }
    }
}
