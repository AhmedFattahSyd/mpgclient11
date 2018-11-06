//////////////////////////////////////////////////////////////////////////////////////////////////////////
// item type enum
// note that defining the type as an enum makes the cvode robust but will not allow adding new types without recompilation
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export enum MpgItemType {
    item = 'item',
    coreVlaue = 'corevale',
    goal = 'goal',
    project = 'project',
    task = 'task'
    // todo: investigate should we add unknowm?
}
///////////////////////////////////////////////////////////////////////////////
// Mpg Item class
///////////////////////////////////////////////////////////////////////////////
export class MpgItem{
    id: number
    name: string
    priority: number
    type: MpgItemType
    static lastIndex: number = 0 //note that the id is accross all item types. we may need to re-design this
    constructor(id: number,typeParam: MpgItemType, nameParam: string, priorityParam=1){
        if(id >0){
            this.id = id
            MpgItem.lastIndex = Math.max(MpgItem.lastIndex, this.id)
        }else{
            this.id = MpgItem.lastIndex
        }
        this.type = typeParam
        this.priority = priorityParam
        MpgItem.lastIndex++
        this.name = nameParam
    }
    getId(): number{
        return this.id
    }
    getType = () : MpgItemType => {
        return this.type
    }
    setType = (newType: MpgItemType): void => {
        this.type = newType
    }
    getName(): string{
        return this.name
    }
    setName = (newName: string) => {
        this.name = newName
    }
    getPriority = () => {
        return this.priority
    }
    setPriority = (newPriority: number) => {
        this.priority = newPriority
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get relative priority
    // returns a number between 0 and 100 that indicates the relative 'importance' of this item r=in relation to its sibiligs
    // calculated by dividing its priority over the sum of all its sibibligs' priority
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getRelativePriority = (sumOfSibilingPri: number) : number =>{
        let relativePriority = 0
        if(sumOfSibilingPri > 0){
            relativePriority = (this.priority / sumOfSibilingPri) * 100
        } else {
            console.log("Item: getRelativePriority: invalid sum of sibilings priority: ", sumOfSibilingPri);
        }
        return relativePriority
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get all priority text
    // returns a text that includes 'basic' priroty, relative priority, ...
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getAllPriorityText = (sumOfSibilingPri: number) : string => {
        let allPriorityText = ''
        allPriorityText += this.getPriority().toString() + ", "
        allPriorityText += Math.floor(this.getRelativePriority(sumOfSibilingPri)).toString() + "%"
        return allPriorityText
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Item data
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface IItemData{
    id: number
    type: string
    name: string
    priority: number
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// All items json object
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// moved to mpgdata calss
// todo: delete
// export interface IItems {
//     items: IItemData[]
// }