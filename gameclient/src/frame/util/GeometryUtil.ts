/**基础图形绘制模块 */
export class GeometryUtil {
    private static GetCross(p1: Laya.Point, p2: Laya.Point, p: Laya.Point) {
        return (p2.x - p1.x) * (p.y - p1.y) - (p.x - p1.x) * (p2.y - p1.y);
    }


    private static sign(p1, p2, p3) {
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }
    //#region pointInTriangle
/*
    判断 pt是否在v1 v2 v3的三角形内部
       v1
      /  \
     /    \
    /      \
   v2-------v3
*/
    private static pointInTriangle(pt, v1, v2, v3) {
    //#endregion
        let d1, d2, d3;
        let has_neg, has_pos;

        d1 = this.sign(pt, v1, v2);
        d2 = this.sign(pt, v2, v3);
        d3 = this.sign(pt, v3, v1);

        has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

        return !(has_neg && has_pos);
    }

    /*
    p2------p3
    |     / |
    |   /   |
    p1/-----p4

    p

    */
    public static isPointInRect(p1: Laya.Point, p2: Laya.Point, p3: Laya.Point, p4: Laya.Point, p: Laya.Point){
        // return this.pointInTriangle(p,p1,p2,p3) || this.pointInTriangle(p,p1,p3,p4);
        let isPointIn = this.GetCross(p1, p2, p) * this.GetCross(p3, p4, p) >= 0 && this.GetCross(p2, p3, p) * this.GetCross(p4, p1, p) >= 0;
        return isPointIn;
    }

    /**
     * 绘画圆角矩形
     * @param	graghics 	Graghics对象
     * @param	x			开始绘制的x轴位置
     * @param	y			开始绘制的y轴位置
     * @param	width		矩形宽
     * @param	height		矩形高
     * @param	roundRadius	圆角半径
     * @param	fillColor	填充颜色
     * @param	borderColor	边框填充颜色
     * @param	borderWidth 边框大小
     * @return DrawPathCmd 对象
     */
    private static drawRoundRect(graghics:Laya.Graphics, x:number, y:number, width:number, height:number, roundRadius:number, fillColor:string, borderColor:string = null, borderWidth:Number = 0) {
        var paths = [];
        paths.push(["moveTo", roundRadius, 0]);
        paths.push(["lineTo", width - roundRadius, 0]);
        paths.push(["arcTo", width, 0, width, roundRadius, roundRadius]);
        paths.push(["lineTo", width, height - roundRadius]);
        paths.push(["arcTo", width, height, width - roundRadius, height, roundRadius]);
        paths.push(["lineTo", roundRadius, height]);
        paths.push(["arcTo", 0, height, 0, height - roundRadius, roundRadius]);
        paths.push(["lineTo", 0, roundRadius]);
        paths.push(["arcTo", 0, 0, roundRadius, 0, roundRadius]);
        paths.push(["closePath"]);
        var brush:Object = { fillStyle:fillColor };
        var pen:Object = { strokeStyle:borderColor, lineWidth:borderWidth };
        return graghics.drawPath(x, y, paths, brush, pen);
    }
    /**为头像增加一个mask遮罩 */
    public static bindHeadMask(icon:Laya.Image){
        let _maskTemp = new Laya.Sprite();
        this.drawRoundRect(_maskTemp.graphics, 0, 0, icon.width, icon.height,10, "#ff0000");
        icon.mask = _maskTemp;
    }
}