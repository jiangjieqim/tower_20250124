export class LayoutUtil {
    //横向布局居中
    static CenterLayout(container: Laya.Sprite, cellW: number, gap: number, row: number) {
        let allw: number;
        allw = container.numChildren * (cellW + gap) - gap;
        let offset = allw / 2;

        if (row == -1) {
            row = Number.MAX_VALUE;
            offset = allw / 2;
        } else {
            offset = (row * (cellW + gap)) / 2 - gap;
        }
        let _resetIndex: number = 0;
        let oy: number = 0;
        for (let i = 0; i < container.numChildren; i++) {
            let cell: Laya.Sprite = container.getChildAt(i) as Laya.Sprite;
            cell.x = _resetIndex * (cellW + gap) - offset;//i * (cellW + gap) - offset;
            cell.y = oy;
            //cellW = cell.width;
            _resetIndex++;
            if (_resetIndex >= row) {
                _resetIndex = 0;
                oy += (cellW + gap);
            }
        }
    }
}