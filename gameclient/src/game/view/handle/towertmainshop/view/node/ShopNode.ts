import { RowMoveBaseNode } from "../../../../../../frame/view/ScrollPanelControl";
import { ShopItem1 } from "../item/ShopItem1";
import { ShopItem10 } from "../item/ShopItem10";
import { ShopItem2 } from "../item/ShopItem2";
import { ShopItem3 } from "../item/ShopItem3";
import { ShopItem4 } from "../item/ShopItem4";
import { ShopItem5 } from "../item/ShopItem5";
import { ShopItem6 } from "../item/ShopItem6";
import { ShopItem7 } from "../item/ShopItem7";
import { ShopItem8 } from "../item/ShopItem8";
import { ShopItem9 } from "../item/ShopItem9";

export class ShopNode1 extends RowMoveBaseNode {
    protected clsKey: string = "ShopNode1";
    protected createNode(index) {
        let _skin: ShopItem1 = Laya.Pool.getItemByClass(this.clsKey, ShopItem1);
        _skin.setData(this.list[index],index);
        _skin.x = 50;
        _skin.y = this.y;
        return _skin;
    }
}

export class ShopNode2 extends RowMoveBaseNode {
    protected clsKey: string = "ShopNode2";
    protected createNode(index) {
        let _skin: ShopItem2 = Laya.Pool.getItemByClass(this.clsKey, ShopItem2);
        _skin.setData(this.list[index],index);
        _skin.x = index * _skin.width + (index * 28) + 48;
        _skin.y = this.y;
        return _skin;
    }
}

export class ShopNode3 extends RowMoveBaseNode {
    protected clsKey: string = "ShopNode3";
    protected createNode(index) {
        let _skin: ShopItem3 = Laya.Pool.getItemByClass(this.clsKey, ShopItem3);
        _skin.setData(this.list[index],index);
        _skin.x = index * _skin.width + (index * 17) + 52;
        _skin.y = this.y;
        return _skin;
    }
}

export class ShopNode4 extends RowMoveBaseNode {
    protected clsKey: string = "ShopNode4";
    protected createNode(index) {
        let _skin: ShopItem4 = Laya.Pool.getItemByClass(this.clsKey, ShopItem4);
        _skin.setData(this.list[index],index);
        _skin.x = index * _skin.width + (index * 30) + 65;
        _skin.y = this.y;
        return _skin;
    }
}

export class ShopNode5 extends RowMoveBaseNode {
    protected clsKey: string = "ShopNode5";
    protected createNode(index) {
        let _skin: ShopItem5 = Laya.Pool.getItemByClass(this.clsKey, ShopItem5);
        _skin.setData(this.list[index],index);
        _skin.x = index * _skin.width + (index * 30) + 65;
        _skin.y = this.y;
        return _skin;
    }
}

export class ShopNode6 extends RowMoveBaseNode {
    protected clsKey: string = "ShopNode6";
    protected createNode(index) {
        let _skin: ShopItem6 = Laya.Pool.getItemByClass(this.clsKey, ShopItem6);
        _skin.setData(this.list[index],index);
        _skin.x = index * _skin.width + (index * 46) + 65;
        _skin.y = this.y;
        return _skin;
    }
}

export class ShopNode7 extends RowMoveBaseNode {
    protected clsKey: string = "ShopNode7";
    protected createNode(index) {
        let _skin: ShopItem7 = Laya.Pool.getItemByClass(this.clsKey, ShopItem7);
        _skin.setData(this.list[index]);
        _skin.y = this.y;
        return _skin;
    }
}

export class ShopNode8 extends RowMoveBaseNode {
    protected clsKey: string = "ShopNode8";
    protected createNode(index) {
        let _skin: ShopItem8 = Laya.Pool.getItemByClass(this.clsKey, ShopItem8);
        _skin.setData(this.list[index]);
        _skin.y = this.y;
        return _skin;
    }
}

export class ShopNode9 extends RowMoveBaseNode {
    protected clsKey: string = "ShopNode9";
    protected createNode(index) {
        let _skin: ShopItem9 = Laya.Pool.getItemByClass(this.clsKey, ShopItem9);
        _skin.setData(this.list[index],index);
        _skin.x = index * _skin.width + (index * 3) + 30;
        _skin.y = this.y;
        return _skin;
    }
}

export class ShopNode10 extends RowMoveBaseNode {
    protected clsKey: string = "ShopNode10";
    protected createNode(index) {
        let _skin: ShopItem10 = Laya.Pool.getItemByClass(this.clsKey, ShopItem10);
        _skin.setData(this.list[index],index);
        _skin.x = index * _skin.width + (index * 30) + 65;
        _skin.y = this.y;
        return _skin;
    }
}
