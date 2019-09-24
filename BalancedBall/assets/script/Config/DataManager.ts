const {ccclass, property} = cc._decorator;

@ccclass
export default class DataManager extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property()
    folderPath: string = "";

    savePath: string = '/LevelConfig.json';

    private static instance: DataManager = null;
    private currentChooseLevel: number = -1;
    private data:{level:number, info:{id:number, type:number}[]}[] = [];

    public static GetInstance ()
    {
        return  DataManager.instance;
    }


    onLoad () {
        DataManager.instance = this;
    }

    start () {
        this.LoadConfig();
    }

    EditExsitLevel ()
    {
        this.node.emit("ChooseEditLevel");
    }

    SetCurrentEditLevel (level)
    {
        this.currentChooseLevel = level;
    }

    GetCurrentEditLevel()
    {
        return this.currentChooseLevel;
    }

    GetSavePath ()
    {
        return this.folderPath  + this.savePath;
    }

    GetLevelDatas ()
    {
        return this.data;
    }

    UpdateData(level:number, info:{id:number, type:number}[])
    {
        let isExsit = false;
        for (let i = 0; i < this.data.length; i++)
        {
            if (level === this.data[i].level)
            {
                isExsit = true;
                this.data[i].info = info;
                break;
            }
        }

        if (!isExsit)
        {
            this.data.push({level:level, info:info});
        }
    }

    LoadConfig ()
    {
        cc.loader.loadRes('config/LevelConfig', (error, res)=>{
            if(!error)
            {
                this.ResolveData(res.json)
            }
        });
    }

    ResolveData (config)
    {
        console.log(config.data);
        //var test = {data:[{level:1,info:[11,22,30,40]},{level:2,info:[10,21,33]}]}
        let levelArr:[] = config.data;
        for (let i = 0; i < levelArr.length; i++)
        {
            this.CreateLevel(levelArr[i]);
        }
        this.node.emit("LoadConfigFinish");
    }

    CreateLevel (levelData)
    {
        let groundDatas:{id:number, type:number}[] = [];
        for (let i = 0; i < levelData.info.length; i++)
        {
            let groundData = this.CreateGroundData(levelData.info[i]);
            groundDatas.push(groundData);
        }
        this.data.push({level:levelData.level, info:groundDatas});
    }

    CreateGroundData (number)
    {
        let type = number % 10;
        let id = Math.floor(number / 10);
        return {id:id, type:type}
    }
}
