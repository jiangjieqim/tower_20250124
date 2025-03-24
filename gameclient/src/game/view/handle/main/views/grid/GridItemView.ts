/* @Author: tsy
 * @Date: 2023-02-20 11:52:33
 * @Last Modified by: tsy
 * @Last Modified time: 2023-02-21 19:49:51
*/

import { ui } from "../../../../../../ui/layaMaxUI";
import { GridItemCtl } from "./GridItemCtl";

/**
 * 道具格子
 */
export class GridItemView extends  ui.views.common.ui_slot_itemUI{
    public ctl:GridItemCtl;
    constructor(){
        super();
        this.ctl = new GridItemCtl(this);
    }
}