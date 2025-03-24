import {ArrayUtil} from "../util/ArrayUtil";

/**二维数组*/
export class DoubleArray<T> {
    private _array: Array<T[]> = new Array<T[]>();

    public Rows: number = 0;
    public Cols: number = 0;

    constructor(rows: number, cols: number, value: T) {
        this.Rows = rows;
        this.Cols = cols;
        if (rows > 0 && cols > 0) {
            for (let row = 0; row < rows; ++row) {
                for (let col = 0; col < cols; ++col) {
                    this.Set(row, col, value);
                }
            }
        }
    }

    public Set(row: number, col: number, value: T) {
        if (!this._array[row])
            this._array[row] = new Array<T>();
        this._array[row][col] = value;
    }

    public Get(row: number, col: number): T {
        if (!this._array[row])
            return null;
        return this._array[row][col];
    }

    /**获取整行*/
    public GetCol(col: number): T[] {
        return this._array[col];
    }

    public SetCol(col: number, lst: T[]) {
        this._array[col] = lst;
    }



    public Clear(): void {
        ArrayUtil.Clear(this._array);
    }
}