
export class EntityHelper {

    private static _id: number = 0;

    public static GetUUID(): number {
        this._id++;
        return this._id;
    }

}