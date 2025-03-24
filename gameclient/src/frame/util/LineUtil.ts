/**
 * 计算N个点均匀排列成圆的各个点坐标
 * @param nodeSize 参与排列成圆的元素个数
 * @param center 圆的中心点坐标 {x:, y:}
 * @param radius 圆的半径
 * @return 各个元素的坐标：[{x:, y:}, {x:, y:}, ...]
 */
function calcCircularLayout(nodeSize, center, radius) {
    var i, _i, _layouts = [];
    for (i = _i = 0; _i < nodeSize; i = ++_i) {
        var x = center.x + radius * Math.sin(2 * Math.PI * i / nodeSize),
            z = center.z + radius * Math.cos(2 * Math.PI * i / nodeSize);

        _layouts.push({ x: x, y: center.y, z: z });
    }

    return _layouts;
}
export class LineUtil {

    public static getCalcPoints(nodeSize, center, radius){
        return calcCircularLayout(nodeSize, center, radius);
    }

    /**
     * 绘制一个圆环线框
     */
    public static drawCircle(x1 = 0, y1 = 0, z1 = 0, r = 5, slicing = 15) {
        let lines = new Laya.PixelLineSprite3D();

        let list2 = calcCircularLayout(slicing, { x: x1, y: y1, z: z1 }, r);
        let l2 = LineUtil.createList(list2);
        lines.maxLineCount = l2.length;
        lines.addLines(l2);
        return lines;
    }

    public static createList(list2,color:Laya.Color = Laya.Color.RED):Laya.PixelLineData[]{
        let l2:Laya.PixelLineData[] = []
        for (let i = 0; i < list2.length; i++) {
            let d: Laya.PixelLineData = new Laya.PixelLineData();
            let t = list2[i];
            d.startPosition = new Laya.Vector3(t.x, t.y, t.z);
            if (i < list2.length - 1) {
                let n = list2[i + 1];
                d.endPosition = new Laya.Vector3(n.x, n.y, n.z);
                d.startColor = color;
                d.endColor = color;
            } else {
                let n = list2[0];
                d.endPosition = new Laya.Vector3(n.x, n.y, n.z);
                d.startColor = color;
                d.endColor = color;
            }
            l2.push(d);
        }
        return l2;
    }

    /**
     * 线框矩形
     */
    public static createLineRect(r:number = 1, color: Laya.Color = Laya.Color.GREEN) {
        let _list2: Laya.Vector3[] = [];
        let y = r;
        _list2.push(new Laya.Vector3(-r, y, r));
        _list2.push(new Laya.Vector3(r, y, r));
        _list2.push(new Laya.Vector3(r, y, -r));
        _list2.push(new Laya.Vector3(-r, y, -r));
        let l2 = LineUtil.createList(_list2, color);
        let box = new Laya.PixelLineSprite3D();
        box.maxLineCount = l2.length;
        box.addLines(l2);
        return box;
    }
}
