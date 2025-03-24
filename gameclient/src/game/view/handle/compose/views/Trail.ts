/**弹道特效 */
export class Trail extends Laya.Sprite {
    /**动画需要播放的时长 */
    static readonly useTime:number = 400;
    static CLS_NAME:string = "Trail";
    curColor:string = "#ffffff";
    private readonly delay:number = 1;//间隔多少帧绘制
    private get bDebug():boolean
    {
        return debug;
    }
    //===============================================
    private curIndex:number = 0;
    private out:Laya.Point[] = [];
    private len:number;//列表长度
    private paths:Laya.Point[];
    private curTime:number = 0;
      /* 参数校验 */
    private Validityparameter(startPoint,endPoint,point) {
        let isOkey = true;
        Array.isArray(startPoint) && startPoint.length !== 2 && (isOkey = false)
        Array.isArray(endPoint) && endPoint.length !== 2 && (isOkey = false) && (point.constructor !== Number) && (isOkey = false)
        return isOkey;
    }
    /**
     * https://zhuanlan.zhihu.com/p/144751163
     * 飞入购物车，轨迹点绘制
     * @author   
     * @param {Array} start`在这里插入代码片`Point 起点clientX, clientY值 (必要) 
     * @param {Array} endPoint   终点clientX, clientY值 (必要)
     * @param {number} point     点数          (必要) 
     * @param {number} h         抛物线向上高度(上抛运动)  (可选)
     * @param {number} hclientX  当存在h情况下，达到最高点时候的clientX值
     * @return {Array}  [ left ,top ] 值组成的数组
     */
    private flycart(startPoint, endPoint, point, h = 0, hclientX?) {
        /* 
        设置startPoint 为(0,0)点 , 此抛物线经过(0,0)点 ，可以推到出模型关系式 y =  ax^2 + bx 或者 y = ax^ 2
        1 当存在 h 的情况，抛物线会y轴向上偏移 h, 此时的关系式 y = ax^2 + bx
        2 当不存在h 的情况 ，抛物线startPoint为顶点， 此时关系式 y = ax^2 
        */

        /* 参数验证 */
        if (!this.Validityparameter(startPoint,endPoint,point)) {
            return []
        }

        /* A点横坐标 */
        const xA = 0
        /* A点纵坐标 */
        const yA = 0
        /* x轴偏移量 */
        const offsetX = startPoint[0]
        /* y轴偏移量 */
        const offsetY = startPoint[1]
        /* B点横坐标 */
        const xB = endPoint[0] - offsetX
        /* B纵坐标 */
        const yB = endPoint[1] - offsetY

        /* 根据B点坐标和最大高度h求系数a,b 参数*/
        let b = 0
        let a = 0

        /* 计算系数 a ,b */
        function handerComputer() {
            if (h < 10) {
                a = yB / Math.pow(xB, 2)
            } else {
                /* 因为一般的情况都是向下，实际上我们的坐标系是反向的，所以我们这里要把h 设置成负值 */
                h = -h
                /* 一元二次求解a,b ，现在知道一点  ( xB , yB ) 另外一点 （ maxHx，h ）  */
                /* 有效达到最高点时候的x坐标 */
                const effectMaHx = hclientX && Math.abs(hclientX - offsetX) > 0 && Math.abs(hclientX - offsetX) < Math.abs(xB)
                /* 如果hclientX不满足要求，则选A , B 中点为   */
                let maxHx = effectMaHx ? (hclientX - offsetX) : (xB + xA) / 2
                /* 已知两点 求 a , b值  根据解方程式解得 y = ax^2 + bx  */
                a = ((yB / xB) - (h / maxHx)) / (xB - maxHx)
                /* 将 a 带入其中一个求解 b */
                b = (yB - a * Math.pow(xB, 2)) / xB
            }
        }


        /* 轨迹数组 */
        const travelList = []
        /* x 均等分 */
        const averageX = (xB - xA) / point

        /* 处理直线运动 */
        function handerLinearMotion(type) {
            if (type === 'X') {
                const averageY = (yB - yA) / point
                for (let i = 1; i <= point; i++) {
                    travelList.push([offsetX, i * averageY + offsetY])
                }
            } else {
                for (let i = 1; i <= point; i++) {
                    travelList.push([offsetX + i * averageX, offsetY])
                }
            }
            return travelList
        }

        /* 当 xB的绝对值小于10的情况，我们看作Y轴直线运功    */
        if (Math.abs(xB) < 10) {
            return handerLinearMotion('X')
        }
        /*当 yB的绝对值小于10的情况，我们看作x轴直线运功  */
        if (Math.abs(yB) < 10) {
            return handerLinearMotion('Y')
        }

        handerComputer()
        /* 绘制路径 */
        for (let i = 1; i <= point; i++) {
            const currentX = averageX * i
            const currentY = Math.pow(currentX, 2) * a + b * currentX - yA
            travelList.push([currentX + offsetX, currentY + offsetY])
        }

        return travelList
    }
    private drawList(posList: Laya.Point[]) {
        let verts = this.updateVertices(posList)
        let _vertslist: number[] = [];
        for (let o in verts) {
            _vertslist.push(verts[o]);
        }
        if(_vertslist.length < 6){
            // console.warn(`顶点数:${_vertslist.length}`,_vertslist);
            return;
        }
        // console.log(`${Laya.timer.currTimer} ===================================================================`);
        for (let i = 0; i < _vertslist.length; i++) {
            // console.log(`i:${i}`);
            let ox1 = _vertslist[i];
            let oy1 = _vertslist[i + 1];
            let ox2 = _vertslist[i + 2];
            let oy2 = _vertslist[i + 3];
            let ox3 = _vertslist[i + 4];
            let oy3 = _vertslist[i + 5];
            i++;
            if( ox1 == undefined || oy1 == undefined || 
                ox2 == undefined || oy2 == undefined || 
                ox3 == undefined || oy3 == undefined)
            {
                continue;
            }
            this.graphics.drawPoly(0, 0, [ox1, oy1, ox2, oy2, ox3, oy3], this.curColor);
            // console.log(`poly ${i}:`,ox1, oy1, ox2, oy2, ox3, oy3);
        }

        //线框
        if(this.bDebug){ 
            this.graphics.drawLines(0, 0, _vertslist, "#00ff00");
            for (let i = 0; i < posList.length; i++) {
                let pos = posList[i];
                this.graphics.drawCircle(pos.x, pos.y, 3, null, "#ff0000", 1);
            }
        }
    }

    /* 
        滑动的轨迹分为多段，完整划痕由多段短的轨迹拼接而成。滑动过程中，记录一定数量的滑动点，根据两点间的距离和位置，计算两点间短轨迹的长度和角度，当有新的点添加进来时，删除最先添加的点，
        用类似方法，在轨迹最前端，再添加一条短的轨迹，类似下图效果。
        
        todo:
        1.计算弹道路径
        1.在路径上填充Ploy


        //  MotionStreak
        https://gwb.tencent.com/community/detail/124886
    */
    constructor() {
        super();
        // this.play(Laya.stage.width / 2,Laya.stage.height / 2,100,-100);
        this.alpha = 0.75;
    }

    play(x:number,y:number,endX:number,endY:number){
        this.x = x;
        this.y = y;
        /*
        0,0<---1,0
        |       ^
        v       |
        0,1--->1,1
        */
        let _start: Laya.Point = new Laya.Point(0, 0);
        this.curTime = Laya.timer.currTimer;


        /*
            n * Laya.timer.delta = useTime
        */

        let n = Trail.useTime / Laya.timer.delta;
        n = Math.floor(n);
        if(n > 10){
            n = 10;
        }else if( n < 3){
            n = 3;
        }
        // LogSys.Log(`n = ${n}`);
        let points = this.flycart([_start.x, _start.y], [endX, endY], n, Math.abs(endY - _start.y));//10
        // LogSys.Log(`flycart use time ${Laya.timer.currTimer - this.curTime} ms.`);
        let l: Laya.Point[] = [];
        // console.log(points);
        l.push(_start);
        for (let i = 0; i < points.length; i++) {
            let cell = points[i];
            l.push(new Laya.Point(cell[0], cell[1]));
        }
        this.paths = l;
        this.out = [];
        this.curIndex = 0;
        this.len = l.length;
        // LogSys.Log(`need play len:${this.len} delta:${Laya.timer.delta} ms,n=${n}`);
        Laya.timer.frameLoop(this.delay, this, this.onLoop);
    }
    // private testIndex:number = 1;
    private onLoop(){
        const div:number = 1;
        if (this.out.length < this.len/div) {
            this.curIndex++;
            this.out = [];
            for (let i = 0; i < this.curIndex; i+=div) {
                this.out.push(this.paths[i]);
            }
            this.graphics.clear();

            if(this.bDebug){
                this.graphics.drawRect(0,0,10,10,null,"#ff0000",1);
            }

            this.out.reverse();
            this.drawList(this.out);
        }else{
            this.stop();
        }
    }
    private stop(){
        this.graphics.clear();
        Laya.timer.clear(this,this.onLoop);
        this.removeSelf();
        Laya.Pool.recover(Trail.CLS_NAME,this);
        // LogSys.Log(`trail use time:${Laya.timer.currTimer - this.curTime} ms`);
    }
    private updateVertices(points: Laya.Point[]) {
        // const points = this.points;
        const maxLineW:number = 20;//最大宽度
        let lineW: number = maxLineW;
        if (points.length < 1) {
            return;
        }

        let lastPoint = points[0];
        let nextPoint;
        let perpX = 0;
        let perpY = 0;

        const vertices = {};//this.trianglesCmd.vertices;
        const total = points.length;

        for (let i = 0; i < total; i++) {
            const point = points[i];
            const index = i * 4;

            if (i < points.length - 1) {
                nextPoint = points[i + 1];
            }
            else {
                nextPoint = point;
            }

            perpY = -(nextPoint.x - lastPoint.x);
            perpX = nextPoint.y - lastPoint.y;

            let ratio = (1 - (i / (total - 1))) * 10;

            if (ratio > 1) {
                ratio = 1;
            }

            const perpLength = Math.sqrt((perpX * perpX) + (perpY * perpY));
            let num = lineW - i;//this.textureScale > 0 ? this.textureScale * this.width / 2 : this.width / 2;

            lineW -= 1;//递减宽度

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
        for(let e in vertices){
            if(isNaN(vertices[e])){
                return [];
            }
        }
        return vertices;
    }

}