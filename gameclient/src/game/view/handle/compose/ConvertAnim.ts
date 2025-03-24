import { AtlasParserV, IMSpineRegions } from "../avatar/spine/SpineManager";

interface IFrame{
    frame;
    sourceSize;
    spriteSourceSize;
    meta;
}
/*
    D:\Project1\Client\towertrunk\resource\res\atlas\hero
*/
export class ConvertAnim{
    private url:string = "o/heroframe/20.atlas";
    constructor(){
        Laya.loader.load(this.url,new Laya.Handler(this,this.onCompleteHandler),null,Laya.Loader.TEXT);
    }

    private onCompleteHandler(){
        let atlas = AtlasParserV.parse(Laya.Loader.getRes(this.url));
        // console.log(atlas);
        let obj = {
            frames:{},
            meta:{}
        };

        let regions:IMSpineRegions[] = atlas.regions;
        for(let i = 0;i < regions.length;i++){
            let cell = regions[i];
            // cell.name
            let o:IFrame = {} as IFrame;
            // let frameName = cell.name;
            let frameName = `${i+1}.png`;
            obj.frames[frameName] = o;
            o.frame = {};
            o.frame.w = cell.width;
            o.frame.h = cell.height;
            o.frame.x = cell.x;
            o.frame.y = cell.y;
            o.frame.idx = 0;

            o.sourceSize = {};
            o.sourceSize.w = cell.origW;
            o.sourceSize.h = cell.origH;

            o.spriteSourceSize = {};
            o.spriteSourceSize.x = cell.offsetX;
            o.spriteSourceSize.y = cell.offsetY;
        }
        let a1 = this.url.split("/");
        let la = a1[a1.length-1];
        let img = la.replace("atlas","png");
        obj.meta['image'] = img;
        // console.log(obj);
        let name = img.replace(".png","");
        obj.meta['prefix'] = `hero/${name}/`;//this.url.replace(la,"")+name;
        // Laya.loader.getRes(this.url);
        // console.log(obj);
        // \res\atlas\hero

        // Laya.Loader.loadedMap[this.url] = obj;


        console.log(JSON.stringify(obj));
        console.log(1);

/*
        let _img = new Laya.Image();
        _img.skin = `o/heroframe/20/20-0_00.png`;
        Laya.stage.addChild(_img);
        _img.x = Laya.stage.width/2;
        _img.y = Laya.stage.height/2;
*/
        /*

        let a = `res/atlas/hero/1.atlas`;
        Laya.loader.load(a,new Laya.Handler(this,()=>{
            let a1 = Laya.loader.getRes(a);
            console.log(a1);
        }),null,Laya.Loader.ATLAS);
        */
    }
}