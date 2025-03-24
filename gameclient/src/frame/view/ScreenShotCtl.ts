/**
 * 截屏控制器,处理 目标渲染节点未添加到舞台的情况
 * 先截取一张空屏幕，然后比较base64的数据有变化就说明截频成功了
 * 
 *     private ctl:ScreenShotCtl = new ScreenShotCtl();
     this.ctl.Start(spr,new Laya.Handler(this,(_base64Data:string)=>{
                spr.removeSelf();
                this.createImageByBase64(_base64Data);
            }))


    //第2帧不一定能取到数据 所有不建议用这种方式截图
    Laya.timer.frameOnce(2,this,()=>{
                screenshot(spr);
                spr.removeSelf();
            })
 */
export class ScreenShotCtl{
    private empty:string;
    private  targetspr:Laya.Sprite;
    private end:Laya.Handler;
    private frameIndex:number = 0;
    private format:string ="image/png";//jepg
    constructor(){

    }

    private Init(targetspr:Laya.Sprite){
        this.targetspr = targetspr;
        let htmlHTMLCanvas = targetspr.drawToCanvas(targetspr.width, targetspr.height, 0, 0);
        let data: any = htmlHTMLCanvas.toBase64(this.format, 0.0);
        this.empty  = data;
        this.clear(htmlHTMLCanvas);
    }

    public Start(targetspr:Laya.Sprite,end:Laya.Handler){
        this.Init(targetspr);
        this.end = end;
        Laya.timer.frameLoop(1,this,this.onLoop);
    }
    private onLoop() {
        let targetspr = this.targetspr;
        let htmlHTMLCanvas = targetspr.drawToCanvas(targetspr.width, targetspr.height, 0, 0);
        let data: any = htmlHTMLCanvas.toBase64(this.format, 0.0);
        this.clear(htmlHTMLCanvas);
        console.log(Laya.timer.currTimer,Laya.timer.currFrame,this.frameIndex,data!=this.empty,data.length,this.empty.length);
        this.frameIndex++;
        if(data!=this.empty || data.length == this.empty.length){
            Laya.timer.clear(this,this.onLoop);
            this.end.runWith(data);
        }
    }

    private clear(htmlHTMLCanvas){
        htmlHTMLCanvas.release();
        htmlHTMLCanvas.clear();
        htmlHTMLCanvas.destroy();
    }
}

export class BlobArrayBuffer {
    public static base64ToBlob(base64) {
        const parts = base64.split(";base64,");
        const contentType = parts[0].split(":")[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;

        const uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; i += 1) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: contentType });
    };

    public static convertBlob(base64Img: string, callBack: Laya.Handler) {
        let reader = new FileReader();
        let b = this.base64ToBlob(base64Img);
        reader.onload = function () {
            // console.log(this.result);
            callBack.runWith([base64Img, this.result]);
        }
        reader.readAsArrayBuffer(b);
    }
}

export class RebuildImageSize{
    private ctl:ScreenShotCtl = new ScreenShotCtl(); 

    /**
     * 如果超出指定的大小就长宽自适应撑满
     * @param img 
     */
    public static RebuildScale(img:Laya.Image,w:number,h:number){
        let sx = img.width/w;
        let sy  =img.height/h;
        let s = 1;
        if(sx > sy){
            s = w / img.width;
        }
        else if(sy > sx){
            s = h / img.height;
        }
        if(s > 1){
            s = 1;
        }
        img.scaleX = img.scaleY  = s;
    }

    public rebuildSize(curData,callBack:Laya.Handler){
        let spr = new Laya.Sprite();
        let img = new Laya.Image(curData);
        
        img.once(Laya.Event.RESIZE,this,()=>{

            RebuildImageSize.RebuildScale(img,Laya.stage.width,Laya.stage.stage.height);
            // this.RebuildScale(img);

            spr.width = img.width*img.scaleX;
            spr.height = img.height*img.scaleY;

            LogSys.Log(img.scaleX,"#",Laya.stage.width,Laya.stage.height,"screen shot ======>",spr.width,spr.height);

            //方式2: 检测画布有数据之后回调,此方法比较安全,有数据才绘制
            this.ctl.Start(spr,new Laya.Handler(this,(_base64Data:string)=>{
                spr.removeSelf();
                img.dispose();
                // this.createImageByBase64(_base64Data);
                callBack.runWith(_base64Data);
            }));
        });
        spr.addChild(img);
    }
}