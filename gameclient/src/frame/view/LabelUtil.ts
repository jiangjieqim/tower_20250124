export class LabelUtil{
    public static create(color:string = "#ffffff"){
        let label  = new Laya.Label();
        label.color = color;
        label.fontSize = 22;
        label.strokeColor = "#000000";
        label.stroke = 2;
        return label;
    }
}