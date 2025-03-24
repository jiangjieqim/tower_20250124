import Sprite = Laya.Sprite;
import Node = Laya.Node;

/**显示工具类*/
export class DisplayUtil {

    /**移除全部子对象*/
    public static RemoveAllChild(container: Laya.Sprite): void {
        if (!container) return;
        if (container.numChildren <= 0) return;
        while (container.numChildren > 0)
            container.removeChildAt(0);
    }

    /**销毁ui节点*/
    public static DestroyUINode(node: Node): void {
        if (node) {
            node.removeSelf();
            node.destroy();
            node = null;
        }
    }

    /**通过名字获取子节点*/
    public static GetChildByName(parent: Node, name: string): Node {

        if (!parent) return null;
        if (parent.name === name) return parent;
        let child: Node = null;
        let num: number = parent.numChildren;
        for (let i = 0; i < num; ++i) {
            child = this.GetChildByName(parent.getChildAt(i), name);
            if (child) return child;
        }
        return null;
    }

    /**创建透明遮罩*/
    public static CreateMaskLayer(): Sprite {
        let layer = new Sprite();
        layer.mouseEnabled = true;

        let width = layer.width = Laya.stage.width + 200;
        var height = layer.height = Laya.stage.height + 400;
        layer.graphics.clear(true);
        layer.graphics.drawRect(0, 0, width, height, UIConfig.popupBgColor);
        layer.alpha = UIConfig.popupBgAlpha;

        return layer;
    }


}