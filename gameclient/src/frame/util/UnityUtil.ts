

/**Unity工具类 */
export class UnityUtil {

    /**
     * 获取未知层级的子物体
     * @param parent 父对象
     * @param childname 子对象名字 
     */
    public static GetChildByName(parent: Laya.Node, childname: string): Laya.Node {
        if (parent == null) {
            return null;
        }
        let numChildren = parent.numChildren;
        for (let i: number = 0; i < numChildren; i++) {
            if (parent == null) {
                return null;
            }
            let child: Laya.Node = parent.getChildAt(i);
            if (child.name == childname)
                return child;

            child = UnityUtil.GetChildByName(child, childname);
            if (child != null)
                return child;
        }
        return null;
    }

    /**
     * 获取未知层级的子物体的组件
     * @param parent 
     * @returns 第一个子物体的组件
     */
    public static GetChildComponent<T>(parent: Laya.Node) {
        if (parent == null) {
            return null;
        }
        for (let i: number = 0; parent && i < parent.numChildren; i++) {
            let child = parent.getChildAt(i);
            if (child == null) {
                continue;
            }
            let component: T = child.getComponent(Laya.Component) as T;
            if (component != null) {
                return component;
            }
            return UnityUtil.GetChildComponent(child);
        }
        return null;
    }

    /**
     * 清除子节点
     * @param parent 父对象
     */
    public static ClearChildren(parent: Laya.Node) {
        if (parent == null) {
            return;
        }
        if (parent.numChildren > 0) {
            parent.removeChildren(0, parent.numChildren);
        }
    }

    /**重置条目 */
    public static ResetItem(item: Laya.Sprite3D) {
        item.transform.localPosition = new Laya.Vector3(0, 0, 0);
        item.transform.localRotation = new Laya.Quaternion(0, 0, 0, 1);
        item.transform.localScale = new Laya.Vector3(1, 1, 1);
    }

    /**设置阴影接收 */
    public static ReceiveShadow(item: Laya.MeshSprite3D, bSet: boolean) {
        if (!item.meshRenderer) return;
        item.meshRenderer.receiveShadow = bSet;
        item.meshRenderer.castShadow = bSet;
    }
}