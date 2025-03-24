export class Message{
        static GAME = "game";
        static HALL = "hall";
       
        static COMMON = "common";
        static SUBGAME = "SUBGAME";

        /**属于哪个模块的 */
        type: string = "";
        /**希望是int */
        cmd: string = "";
        /**proBuf 要decode用的，然后json就不用了 */
        params: any;

        constructor(type: string, cmd: string, params: any) {
            this.cmd = cmd;
            this.type = type;
            this.params = params;
        }
}