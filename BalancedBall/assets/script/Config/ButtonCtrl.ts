const {ccclass, property} = cc._decorator;

@ccclass
export default class ButtonCtrl extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property()
    id: number = 1;

    level: number = -1;
    status: number = 1;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    Reset ()
    {
        this.status = 1;
        this.label.string = "";
        this.node.color = cc.Color.WHITE; 
    }

    OnClicked ()
    {
        switch (this.status)
        {
            case 1:
                this.status = 0;
                this.label.string = "Hole";
                this.node.color = cc.Color.BLUE;
                break;
            case 0:
                this.status = 2;
                this.label.string = "Exit";
                this.node.color = cc.Color.GREEN;
                break;
            case 2:
                this.status = 1;
                this.label.string = "";
                this.node.color = cc.Color.WHITE;
                break;
        }
    }

    Init (status, level)
    {
        this.level = level;
        this.status = status;
        switch (this.status)
        {
            case 0:
                this.label.string = "Hole";
                this.node.color = cc.Color.BLUE;
                break;
            case 1:
                this.label.string = "";
                this.node.color = cc.Color.WHITE;
                break;
            case 2:
                this.label.string = "Exit";
                this.node.color = cc.Color.GREEN;
                break;
        }
    }

    GetCurrentConfig ()
    {
        return  {id:this.id, type:this.status};
    }
    // update (dt) {}
}
