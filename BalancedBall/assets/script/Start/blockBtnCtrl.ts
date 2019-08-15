const {ccclass, property} = cc._decorator;
import startSceneCtrl from './startSceneCtrl';
@ccclass
export default class blockBtnCtrl extends cc.Component {
    @property(cc.Label)
    gameName:cc.Label = null;

    @property(cc.Label)
    gameInde:cc.Label = null;

    data:any = null;
    startCtrl:startSceneCtrl = null;
    start () {

    }

    initBtn(data,startCtrl:startSceneCtrl)
    {
        this.data = data;
        this.gameName.string = data.blockName;
        this.gameInde.string = data.gameIndex;
        this.startCtrl = startCtrl;
        this.node.on('click',()=>{
            this.startCtrl.currentChoose(this.data,this);
        })
    }


    // update (dt) {}
}
