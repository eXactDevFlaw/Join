class TaskClass{
    constructor(item){
        this._item = item
        this.amount = item
    }

    logger(){
        if(this._item){
            console.table(this._item);
        } else {
            console.log("Error onm loading of data!")
        }
    }

    constructHTMLElements() {

    }
}