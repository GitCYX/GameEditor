import DataManager from "./DataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScrollItemCtrl extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    level: number = -1;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    Init (id)
    {
        this.label.string = id;
        this.level = id;
        this.node.on("click", this.OnClicked, this);
    }
    
    OnClicked ()
    {
        DataManager.GetInstance().SetCurrentEditLevel(this.level);
        DataManager.GetInstance().EditExsitLevel();
    }

    // update (dt) {}
}
