import {Message} from "./Message";
import {EventCenter} from "../EventCenter";

export class MessageManager {

    private static _inst: MessageManager;
    queueDic: { [key: string]: Message[] } = {};
    pausedDic: { [key: string]: boolean } = {};

    static get inst(): MessageManager {
        if (!MessageManager._inst) {
            MessageManager._inst = new MessageManager();
        }
        return MessageManager._inst;
    }

    constructor() {
        this.queueDic[Message.HALL] = [];
        this.queueDic[Message.GAME] = [];
        this.queueDic[Message.COMMON] = [];

        this.pausedDic[Message.HALL] = false;
        this.pausedDic[Message.GAME] = false;
        this.pausedDic[Message.COMMON] = false;
    }

    dealMsg(error, cmd, result, type: string = Message.GAME) {
        if (error == 0) {
            let msg: Message = new Message(type, cmd, result);
            this.dispatch(msg);
        } else {//报错了
            //  if(ConfManager.inst.errorData){
            // 	   console.log("on error", ConfManager.inst.errorData[error]);
            //  }

        }
    }

    pauseQueue(queueName: string) {
        this.pausedDic[queueName] = true;
    }

    dispatch(msg: Message) {
        this.queueDic[msg.type].push(msg);
        // console.log("msg.type :: " + msg.type, this.queueDic[msg.type].length)

        if (!this.pausedDic[msg.type]) {
            EventCenter.inst.event(msg.type, msg);
        }
    }

    

    continueQueue(queueName: string) {
        let queue: Message[] = this.queueDic[queueName];
        this.pausedDic[queueName] = false;
        let i: number, len: number = queue.length, msg: Message;
        if (len == 0) {
            return;
        }
        for (i = 0; i < queue.length + 1; i++) {
            if (queue.length == len - 1) {
                len = queue.length;
                i--;
            }
            msg = queue[i];
            if (!this.pausedDic[queueName]) {
                EventCenter.inst.event(msg.type, msg);
            }
        }
    }

    completeMsg(msg: Message) {

        var queue: Message[] = this.queueDic[msg.type];

        console.log("msg.type :: ", queue.length)
        var i: number, len: number = queue.length;
        for (i = 0; i < len; i++) {
            if (queue[i] == msg) {
                queue.splice(i, 1);
                break;
            }
        }
    }
}