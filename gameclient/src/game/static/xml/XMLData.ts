
// XML数据类
export class XMLData {
        
    private static _instance: XMLData;
    public static get Instance(): XMLData {
        if (!XMLData._instance)
        XMLData._instance = new XMLData();
        return XMLData._instance;
    }

    constructor() {

    }

    public Init(): boolean{
        
        return true;
    }

}