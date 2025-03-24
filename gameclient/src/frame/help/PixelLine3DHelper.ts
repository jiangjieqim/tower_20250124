/**绘制3d像素线的辅助类 */
export class PixelLine3DHelper {

    /**创建像素线对象 
     * @param maxCount 最大线数量
     * @param name 对象名字
     * @param parent  父节点-放到一个3d父节点下才能显示出来
    */
    public static CreateLineSprite3D(maxCount: number, name: string, parent?: Laya.Node): Laya.PixelLineSprite3D {
        let line: Laya.PixelLineSprite3D = new Laya.PixelLineSprite3D(maxCount, name);
        if (parent != null) {
            parent.addChild(line);
        }
        return line;
    }

    /**创建像素线数据
     * @param s 起始坐标
     * @param e 结束坐标
     * @param sc 起始颜色
     * @param ec 结束颜色
     */
    public static CreateLineData(s: Laya.Vector3, e: Laya.Vector3, sc: Laya.Color, ec?: Laya.Color): Laya.PixelLineData {
        let line: Laya.PixelLineData = new Laya.PixelLineData();
        line.startPosition = new Laya.Vector3(s.x, s.y, s.z);
        line.endPosition = new Laya.Vector3(e.x, e.y, e.z);
        line.startColor = sc;
        line.endColor = ec ? ec : sc;
        return line;
    }

    /**通过像素线获取
     * @param line3d 像素线对象
     * @param index 索引
     * @returns 如果存在返回数据，否则返回null
     */
    public static GetLineDataByIndex(line3d: Laya.PixelLineSprite3D, index: number): Laya.PixelLineData {
        let data: Laya.PixelLineData;
        line3d.getLine(index, data);
        return data;
    }

    /**添加像素线数据
     * @param line3d 像素线对象
     * @param linedata 像素线数据
     */
    public static AddLineData(line3d: Laya.PixelLineSprite3D, linedata: Laya.PixelLineData): void {
        line3d.addLines([linedata]);
    }

    /**添加像素线数据组
     * @param line3d 像素线对象
     * @param linedatas 像素线数据组
     */
    public static AddLineDatas(line3d: Laya.PixelLineSprite3D, linedatas: Laya.PixelLineData[]): void {
        line3d.addLines(linedatas);
    }

    /**清除所有线数据 */
    public static Clear(line3d: Laya.PixelLineSprite3D): void {
        line3d.clear();
    }

    /**修改指定索引的像素线的颜色
     * @param line3d 像素线对象
     * @param index 指定索引
     * @param sc 起始颜色
     * @param ec 结束颜色
     */
    public static ChangeColor(line3d: Laya.PixelLineSprite3D, index: number, sc: Laya.Color, ec: Laya.Color): void {
        let data: Laya.PixelLineData;
        line3d.getLine(index, data);
        if (data != null) {
            data.startColor = sc;
            data.endColor = ec;
        }
    }

    /**修改指定索引的像素线的位置
     * @param line3d 像素线对象
     * @param index 指定的索引
     * @param sp 起始坐标
     * @param ep 结束坐标
     */
    public static ChangePos(line3d: Laya.PixelLineSprite3D, index: number, sp: Laya.Vector3, ep: Laya.Vector3): void {
        let data: Laya.PixelLineData;
        line3d.getLine(index, data);
        if (data != null) {
            data.startPosition = sp;
            data.endPosition = ep;
        }
    }


    public static Test(): void {

        // let line: Laya.PixelLineData = new Laya.PixelLineData();
        // let filter: Laya.PixelLineFilter =new Laya.PixelLineFilter()
        // let line3d: Laya.PixelLineSprite3D = new Laya.PixelLineSprite3D();
        // let linemat: Laya.PixelLineMaterial = new Laya.PixelLineMaterial();
        // let linerender: Laya.PixelLineRenderer = new Laya.PixelLineRenderer();

    }

}