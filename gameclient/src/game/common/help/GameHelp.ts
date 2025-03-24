import View = Laya.View;
import Vector2 = Laya.Vector2;
import Vector3 = Laya.Vector3;
import Node = Laya.Node;
import Sprite3D = Laya.Sprite3D;
import MeshSprite3D = Laya.MeshSprite3D;

export class GameHelp {

    public static DesignWidth = 0;    //设计宽度
    public static DesignHeight = 0;  //设计高度

    //添加ui
    public static AddChild(parent: Node, childView: View): void {
        if (parent) {
            parent.addChild(childView);
        }
    }

    //移除ui
    public static RemoveChild(parent: Node, childView: View): void {
        if (parent) {
            parent.removeChild(childView);
        }
    }

    //移除所有子ui
    public static ClearChild(parent: Laya.Box): void {
        if (parent) {
            while (parent.numChildren > 0) {
                parent.removeChildAt(0);
            }
        }
    }

    // public changeToClientWorld(input: Laya.Vector2): Laya.Vector2 {
    //     let ratioX = (input.x / Laya.stage.width);
    //     let ratioY = (input.y / Laya.stage.height);
    //     let clientWidth = Laya.stage.clientScaleX * Laya.stage.width
    //     let clientHeight = Laya.stage.clientScaleY * Laya.stage.height

    //     // let singleX = (Laya.Browser.width - clientWidth)/2;
    //     // let singleY = (Laya.Browser.height - clientHeight)/2;
    //     input.x = ratioX * clientWidth;//singleX,Y 看效果自行修改
    //     input.y = ratioY * clientHeight;
    //     return input;
    // }

    /**平台上的鼠标位置 */
    public static get StageMousePos(): Vector2 { return new Vector2(Laya.stage.mouseX, Laya.stage.mouseY); }

    /*设备宽度*/
    public static get StageWidth(): number { return Laya.stage.width; }

    /*设备高度*/
    public static get StageHeight(): number { return Laya.stage.height; }

    /*宽度比例*/
    public static get CalViewDeviceRatioW(): number { return this.StageWidth / this.DesignWidth; }
    /*高度设备比例*/
    public static get CalViewDeviceRatioH(): number { return this.StageHeight / this.DesignHeight; }

    /** 物理宽度和设计宽度比例 */
    public static get BrowserAndGameConfigRatioW(): number { return Laya.Browser.width / this.DesignWidth; }

    /** 物理高度和设计高度比例 */
    public static get BrowserAndGameConfigRatioH(): number { return Laya.Browser.height / this.DesignHeight; }

    public static get ScreenCenter(): Vector2 { return new Vector2(this.StageWidth / 2, this.StageHeight / 2); }

    /**当前是否是横屏 */
    public static get IsHor(): boolean { return this.StageWidth > this.StageHeight; }
    /**游戏设计是否是横屏 */
    public static get IsHorDesgin(): boolean { return this.DesignWidth > this.DesignHeight; }


    /**该位置是否在屏幕内*/
    public static IsInStageRange(x: number, y: number): boolean {
        if (x > 0 && x < this.StageWidth && y > 0 && y < this.StageHeight)
            return true;
        return false;
    }

    /*计算两个对象的二维距离*/
    public static CalTwoObjDisV2(s_pos: Vector3, e_pos: Vector3, d: number): boolean {
        return Math.abs(s_pos.x - e_pos.x) < d && Math.abs(s_pos.z - e_pos.z) < d;
    }

    /**计算两个对象的三维距离*/
    public static CalTwoObjDisV3(s_pos: Vector3, e_pos: Vector3, d: number): boolean {
        return Vector3.distance(s_pos, e_pos) < d;
    }

    /**是否触发
     * 随机数值
    */
    public static RandomIsTigger(num: number): boolean {
        let rand = Math.random();
        if (rand * 100 < num)
            return true;
        return false;
    }

    /**显示是或否*/
    public static ShowTrueOrFalseText(isTrue: boolean): string {

        if (isTrue) return "是";
        else return "否";
    }


    public static GetMesh(obj: Sprite3D): MeshSprite3D {
        let mesh: MeshSprite3D = null;
        for (let i: number = 0; i < obj.numChildren; i++) {
            let child = obj.getChildAt(i);

            if (child instanceof MeshSprite3D) {
                mesh = child as MeshSprite3D;
            }
            if (mesh == null)
                mesh = this.GetMesh(child as Sprite3D);
            if (mesh != null)
                break;
        }
        return mesh;
    }

    public static GetChildByName(obj: Laya.Node, name: string): Laya.Node {
        let res: Laya.Node;
        for (let i: number = 0; i < obj.numChildren; i++) {
            let child = obj.getChildAt(i);
            if (child.name == name) {
                res = child;
            }
            if (res == null)
                res = this.GetChildByName(child, name);
            if (res != null)
                break;
        }
        return res;
    }

    public static GetChildByNameContains(obj: Laya.Node, name: string): Laya.Node {
        let res: Laya.Node;
        for (let i: number = 0; i < obj.numChildren; i++) {
            let child = obj.getChildAt(i);
            if (StringUtil.Contains(child.name, name)) {
                res = child;
            }
            if (res == null)
                res = this.GetChildByName(child, name);
            if (res != null)
                break;
        }
        return res;
    }

    public static GetAllChildByName(obj: Laya.Node, name: string): Laya.Node[] {
        let res: Laya.Node[] = [];
        for (let i: number = 0; i < obj.numChildren; i++) {
            let child = obj.getChildAt(i);
            if (child.name == name) {
                ListUtil.Add(res, child);
            }
            if (res == null) {
                ListUtil.SafeAddRange(res, this.GetAllChildByName(child, name));
            }
        }
        return res;
    }

    public static GetAllChildByNameContains(obj: Laya.Node, name: string): Laya.Node[] {
        let res: Laya.Node[] = [];
        for (let i: number = 0; i < obj.numChildren; i++) {
            let child = obj.getChildAt(i);
            if (StringUtil.Contains(child.name, name)) {
                ListUtil.Add(res, child);
            }
            if (res == null) {
                ListUtil.SafeAddRange(res, this.GetAllChildByName(child, name));
            }
        }
        return res;
    }

}