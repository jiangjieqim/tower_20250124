
export class QualityUtils {
    public static defaultColor = "#6E6E6E";

    public static getQuaColor(qua: number) {
        /*
        // let arr: string[] = [
        //     "#6E6E6E",
        //     "#5CCD0C",
        //     "#1F1FC0",
        //     "#AD38F1",
        //     "#D9CE00",
        //     "#F79A0D",
        //     "#CD330C",
        //     "#0CBCCD"
        // ]
        // if (qua > arr.length) {
        //     return arr[0];
        // }
        // return arr[qua - 1];
        let quacfg:Configs.t_EquipmentQuality_dat = EquipmentQualityProxy.Ins.GetDataById(qua);
        if(quacfg)
            return "#"+quacfg.f_Color;
        else{
            if(E.Debug){
                E.ViewMgr.ShowMidError("qua = 0");
            }
            return "#ffffff";
        }
        */
       return "#ff0000";
    }
}