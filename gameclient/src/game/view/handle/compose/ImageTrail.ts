// import { CustomizeTexture } from "../../../framework/res/CustomizeTexture";
// import { GMath } from '../../utils/GMath';
// import { Dictionary } from '../../utils/Dictionary';

import { CustomizeTexture } from "./CustomizeTexture";

/*
 * @Descripttion: 屏幕拖尾
 * @Author: wangwx
 * @Date: 2020-03-09
 * @LastEditors: wangwx
 */
export class ImageTrail extends Laya.Script 
{
    private trailTex :CustomizeTexture = null;//CustomizeTexture
    private fristTex :CustomizeTexture = null;
    private startTrail:boolean = false;
    private ownerSpr:Laya.Sprite;
    /** @prop {name: ropeSize, tips:"平滑程度",type:Int} */
    public ropeSize:number = 50;
    /** @prop {name: trailTextureName, tips:"拖尾尾巴图片",type:string,accept:res} */
    public trailTextureName:string = "remote/base/green.png";

    /** @prop {name: fristTextureName, tips:"拖尾头部图片",type:string,accept:res} */
    public fristTextureName:string = "remote/base/red.png";
    
    /** @prop {name: width, tips:"拖尾宽度",type:Int} */
    public width:number = 0;
    
    /** @prop {name: historySize, tips:"历史存储数量",type:Int} */
    public historySize = 20;
    
    /** @prop {name: textureScale, tips:"拖尾图片缩放",type:Number} */
    public textureScale: number = 0;
    
    private cmd:Laya.DrawTextureCmd;;
    private trianglesCmd:Laya.DrawTrianglesCmd = null;
    private points: Laya.Point[] = [];
    private historyX = [];
    private historyY = [];
    constructor()
    {
        super();
    }

    onEnable()
    {
        this.ownerSpr = this.owner as Laya.Sprite;
        //this.ownerSpr.blendMode = Laya.BlendMode.ADD;

        
        var THIS = this;
        CustomizeTexture.GetTextureByUrlCallBack(this.trailTextureName,this.trailTextureName,0,0,Laya.Handler.create(this, function (customTex): void {
            THIS.trailTex= customTex;
        }));
        CustomizeTexture.GetTextureByUrlCallBack(this.fristTextureName,this.trailTextureName,0,0,Laya.Handler.create(this, function (customTex): void {
            THIS.fristTex= customTex;
            
            if(THIS.trailTex.texture.bitmap instanceof Laya.Texture2D)
            {
                if(THIS.textureScale > 0)
                {
                    THIS.trailTex.texture.bitmap.wrapModeU = this.trailTex.texture.bitmap.wrapModeV = Laya.BaseTexture.WARPMODE_REPEAT;
                }
                
            } 
        }));
        

        this.points = [];
        for (let i = 0; i < this.ropeSize; i++) {
            this.points.push(new Laya.Point(0,0));
        }
        this.historyX = [];
        this.historyY = [];
        //for (var i = 0; i < this.historySize; i++) {
        //    this.historyX.push(0);
        //    this.historyY.push(0);
        //}
    }
    public updateVertices(): void{
        const points = this.points;

        if (points.length < 1)
        {
            return;
        }

        let lastPoint = points[0];
        let nextPoint;
        let perpX = 0;
        let perpY = 0;

        const vertices = this.trianglesCmd.vertices;
        const total = points.length;

        for (let i = 0; i < total; i++)
        {
            const point = points[i];
            const index = i * 4;

            if (i < points.length - 1)
            {
                nextPoint = points[i + 1];
            }
            else
            {
                nextPoint = point;
            }

            perpY = -(nextPoint.x - lastPoint.x);
            perpX = nextPoint.y - lastPoint.y;

            let ratio = (1 - (i / (total - 1))) * 10;

            if (ratio > 1)
            {
                ratio = 1;
            }

            const perpLength = Math.sqrt((perpX * perpX) + (perpY * perpY));
            const num = this.textureScale > 0 ? this.textureScale * this.width / 2 : this.width / 2;

            perpX /= perpLength;
            perpY /= perpLength;

            perpX *= num;
            perpY *= num;

            vertices[index] = point.x + perpX;
            vertices[index + 1] = point.y + perpY;
            vertices[index + 2] = point.x - perpX;
            vertices[index + 3] = point.y - perpY;

            lastPoint = point;
        }
        
    }

    private build(): void
    {
        const points = this.points;

        if (!points) return;

        let vertexBuffer = this.trianglesCmd.vertices;
        let uvBuffer = this.trianglesCmd.uvs;
        let indexBuffer = this.trianglesCmd.indices;

        // if too little points, or texture hasn't got UVs set yet just move on.
        if (points.length < 1)
        {
            return;
        }

        // if the number of points has changed we will need to recreate the arraybuffers
        if (vertexBuffer.length / 4 !== points.length)
        {
            vertexBuffer = new Float32Array(points.length * 4);
            uvBuffer = new Float32Array(points.length * 4);
            indexBuffer = new Uint16Array((points.length - 1) * 6);
        }

        const uvs = uvBuffer;
        const indices = indexBuffer;

        uvs[0] = 0;
        uvs[1] = 0;
        uvs[2] = 0;
        uvs[3] = 1;

        let amount = 0;
        let prev = points[0];
        const textureWidth = this.width * this.textureScale;
        const total = points.length; // - 1;

        for (let i = 0; i < total; i++)
        {
            // time to do some smart drawing!
            const index = i * 4;

            if (this.textureScale > 0)
            {
                // calculate pixel distance from previous point
                const dx = prev.x - points[i].x;
                const dy = prev.y - points[i].y;
                const distance = Math.sqrt((dx * dx) + (dy * dy));

                prev = points[i];
                amount += distance / textureWidth;
            }
            else
            {
                // stretch texture
                amount = i / (total - 1);
            }

            uvs[index] = amount;
            uvs[index + 1] = 0;

            uvs[index + 2] = amount;
            uvs[index + 3] = 1;
        }

        let indexCount = 0;

        for (let i = 0; i < total - 1; i++)
        {
            const index = i * 2;

            indices[indexCount++] = index;
            indices[indexCount++] = index + 1;
            indices[indexCount++] = index + 2;

            indices[indexCount++] = index + 2;
            indices[indexCount++] = index + 1;
            indices[indexCount++] = index + 3;
        }

        this.updateVertices();
    }

    /**
    * Cubic interpolation based on https://github.com/osuushi/Smooth.js
    */
    clipInput(k, arr) {
        if (k < 0) k = 0;
        if (k > arr.length - 1) k = arr.length - 1;
        return arr[k];
    }

    getTangent(k, factor, array) {
        return factor * (this.clipInput(k + 1, array) - this.clipInput(k - 1, array)) / 2;
    }

    cubicInterpolation(array, t, tangentFactor = null) {
        if (tangentFactor == null) tangentFactor = 1;

        var k = Math.floor(t);
        var m = [this.getTangent(k, tangentFactor, array), this.getTangent(k + 1, tangentFactor, array)];
        var p = [this.clipInput(k, array), this.clipInput(k + 1, array)];
        t -= k;
        var t2 = t * t;
        var t3 = t * t2;
        return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
    }


    onRealUpdate()
    {
        if(!this.startTrail || this.trailTex == null ||this.fristTex == null || this.ownerSpr == null || this.points.length == 0)return;
        if(!this.trianglesCmd)
        {
            let vertices = new Float32Array(this.ropeSize * 4);
            let uvs = new Float32Array(this.ropeSize * 4);
            let indexs = new Uint16Array((this.ropeSize - 1) * 6);
            this.trianglesCmd = this.ownerSpr.graphics.drawTriangles(this.trailTex.texture,0,0,vertices,uvs,indexs);
            this.trianglesCmd.blendMode = Laya.BlendMode.NORMAL;//ADD;
            this.build();
        }
        if(this.historyX.length >= this.historySize)
        this.historyX.pop();
        this.historyX.unshift(Laya.stage.mouseX);
        if(this.historyX.length >= this.historySize)
        this.historyY.pop();
        this.historyY.unshift(Laya.stage.mouseY);
        // Update the points to correspond with history.
        for (var k = 0; k < this.ropeSize; k++) {
            var p = this.points[k];
            // Smooth the curve with cubic interpolation to prevent sharp edges.
            var ix = this.cubicInterpolation(this.historyX, k / this.ropeSize * this.historySize);
            var iy = this.cubicInterpolation(this.historyY, k / this.ropeSize * this.historySize);
            p.x = ix;
            p.y = iy;
        }
        if (this.textureScale > 0)
        {
            this.build(); // we need to update UVs
        }
        else
        {
            this.updateVertices();
        }
        if(!this.cmd)
        {
            this.cmd = this.ownerSpr.graphics.drawTexture(this.fristTex.texture,Laya.stage.mouseX-this.fristTex.texture.width/2,Laya.stage.mouseY-this.fristTex.texture.height/2,this.fristTex.texture.width,this.fristTex.texture.height,null,1,"#ffff00");
        }
        this.cmd.x = Laya.stage.mouseX-this.fristTex.texture.width/2;
        this.cmd.y = Laya.stage.mouseY-this.fristTex.texture.height/2;
    }

    onUpdate()
    {
        
        this.onRealUpdate();
    }

    onStageMouseDown (e:Laya.Event)
    {
        this.startTrail = true;
    }

    private clearDraw()
    {
        this.startTrail = false;
        this.ownerSpr.graphics.clear(true);
        this.cmd = null;
        if(this.trianglesCmd)
        {
            var _index = this.ownerSpr.graphics.cmds.indexOf(this.trianglesCmd)
            if (_index != -1)
            {
                this.ownerSpr.graphics.cmds.splice(_index, 1);
                
            }
            this.trianglesCmd.recover();
            this.trianglesCmd = null;
        }
        this.historyX = [];
        this.historyY = [];
    }

    onStageMouseUp (e:Laya.Event)
    {
        this.clearDraw();
    }

    onStageMouseMove (e:Laya.Event)
    {
    }

    onMouseOut(e:Laya.Event)
    {
        this.clearDraw();
    }

    onDisable()
    {
    }
    
    onDestroy()
    {
    }
}