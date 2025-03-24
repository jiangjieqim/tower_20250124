export class EventCenter extends Laya.EventDispatcher {
    private static _inst: EventCenter;
    static ON_STAGE_RESIZE = "ON_STAGE_RESIZE";
    static ON_VIEWOPEN = "ON_VIEWOPEN";
    static ON_VIEWHIDE = "ON_VIEWHIDE";
    static ON_VIEWSHOW = "ON_VIEWSHOW";

    static get inst(): EventCenter {
        if (!EventCenter._inst) {
            EventCenter._inst = new EventCenter();
        }
        return EventCenter._inst;
    }

    private constructor() {
        super();
    }
}