import { stCellValue } from "../../../../network/protocols/BaseProto";

export class VoUtils {
    public static convertCellList(str: string): stCellValue[] {
        let arr: string[] = str.split("|");
        let _l: stCellValue[] = [];
        if (str != "") {
            for (let i = 0; i < arr.length; i++) {
                let cell: string[] = arr[i].split("-");
                let _itemVo: stCellValue = new stCellValue();
                _itemVo.id = parseInt(cell[0]);
                _itemVo.count = parseInt(cell[1]);
                _l.push(_itemVo)
            }
        }
        return _l;
    }
}