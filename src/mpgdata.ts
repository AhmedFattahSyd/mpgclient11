//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Data class that deals with all things data           
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import {MpgItem, IItemData, MpgItemType} from "./mpgitem"
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// All items json object
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface IItems {
    items: IItemData[]
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgData class
// defines all functions that interact with the graph data
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export default class MpgData {
    private items: MpgItem[] = []
    // should we clreatre different arrays for different types? investigate
    appStateMsg: string 
    dataLoaded: boolean
    sumOfSiblingsPri: number = 0
    // sumOfSiblingsPri: number[]
    constructor(){
        this.items = []
        // this.appStateMsg = "No state has beebn set" //tdo: remove
        this.dataLoaded = false
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Add item 
    // shoul use createItem
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // addItem = (name: string, id: number=-1) =>{
    //     const item = new MpgItem(id, name)
    //     this.items.push(item)
    // }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // getMpgItemType
    // maps from the string of type type enum
    // todo: should consider a better implementation with dictionary with symbols keys
    // todo: consider moving to MpgItem class
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getMpgItemType = (typeString: string): MpgItemType =>{
        switch (typeString){
            case 'item':
                return MpgItemType.item
            case 'corevalue':
                return MpgItemType.coreVlaue
            case 'goal':
                return MpgItemType.goal
            case 'project':
                return MpgItemType.project
            case 'task':
                return MpgItemType.task
            default:
                console.log("MpgData:ggetMpgItemType: unknow item type string",typeString);
                return MpgItemType.coreVlaue
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get item type as a string
    // todo: consider a better implementation
    // todo: consider moving to item
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getItemTypeString = (typeEnum: MpgItemType): string =>{
        switch (typeEnum){
            case MpgItemType.item:
                return 'item'
            case MpgItemType.coreVlaue:
                return 'corevalue'
            case MpgItemType.goal:
                return 'goal'
            case MpgItemType.project:
                return 'project'
            case MpgItemType.task:
                return 'task'
            default:
                console.log("MpgData:getItemTypeString: unknow MpgItemType",typeEnum);
                return 'item'
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Set Items
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    private setItems(fetchedItems: IItems){
        let itemsData: IItemData[] = fetchedItems.items
        let items: MpgItem[] = []
        itemsData.map(itemsData => {
            let newItemType = this.getMpgItemType(itemsData.type)
            //todo: investigate: should use create item
            items.push(new MpgItem(itemsData.id, newItemType, itemsData.name, itemsData.priority))
        })
        this.items = items
      }    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Save data
    // todo: inv=estigate if we need the dataHasBeenSaved function
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    saveData = (dataHasBeenSavedFun: Function) => {
        // create items data
        let itemsData: IItemData[] = []
        let itemData: IItemData
        for(let item of this.items){
            let itemTypeString = this.getItemTypeString(item.getType())
            itemData = {id: item.getId(), type: itemTypeString, name: item.getName(), priority: item.getPriority()}
            itemsData.push(itemData)
        }
        let allItems: IItems = {items: itemsData}
        // console.log("allItems:",JSON.stringify(allItems));
        
        fetch('/items',{
          method: 'post',
          headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
          body: JSON.stringify(allItems)
        })
        .then(res => { res.json()
                dataHasBeenSavedFun()})
        .catch((reason: any)=>{console.log("reason:",reason)})
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Load data
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    loadData = (dataHasBeenLoadedFun: Function) => {
        fetch('/items')
        .then(res => res.json())
        .then(items => {
            this.setItems(items)
            this.dataLoaded = true
            this.updateAllSumOfSiblingPri()
            dataHasBeenLoadedFun()})
        .catch((reason: any)=>{console.log("reason:",reason)})
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // getItems of type
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getItemsWithType = (typeRequired: MpgItemType): MpgItem[] => {
        let foundItems: MpgItem[] = []
        for(let item of this.items){
            if(item.getType() == typeRequired){
                foundItems.push(item)
            }
        }
        return foundItems
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // delete item
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    deleteItem = (idParam: number) => {
        // make sure that the item exit 
        let foundIndex: number = this.getIndex(idParam)
        if(foundIndex != -1){
            this.items.splice(foundIndex, 1)
        } else {
            console.log("MpgData:deleteItem: item not found with id:",idParam)  // todo: need a better way to report and handle app errors  
        }
        this.updateAllSumOfSiblingPri()
        //we need to do much better than this
        //concerns: you shouldn't delete item of an array inside forEach
        // this.items.forEach((item, index) => {
        //     if(item.getId() === idParam){
        //         this.items.splice(index,1)
        //     }
        // },this)
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get item
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getItem = (idParam: number): MpgItem | undefined => {
        let itemFound = undefined
        for(let item of this.items){
            if(item.getId() == idParam){
                itemFound = item
            }
        }
        if(itemFound == undefined){
            console.log("MpgData:getItem: Item not found with id: ",idParam) // todo: need a good way to report and log such errors
        }
        return itemFound
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get index of item with an id
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getIndex = (idParam: number): number => {
        let foundIndex: number = -1
        for(let index = 0; index < this.items.length; index++){
            if(this.items[index].getId() == idParam){
                foundIndex = index
            }
        }
        if(foundIndex == -1 ){
            console.log("MpgData:getIndex: item not found with id: ",idParam) // todo: need a standard way to report and log errors
        }
        return foundIndex
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // increase priority
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    increasePriority = (idParam: number) => {
        this.items.forEach((item, index) => {
            if(item.getId() === idParam){
                item.setPriority(item.getPriority() + 1)
            }
        },this)
        this.updateAllSumOfSiblingPri()
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // decrease priority
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    decreasePriority = (idParam: number) => {
        this.items.forEach((item, index) => {
            if(item.getId() === idParam){
                if(item.getPriority() > 1){
                 item.setPriority(item.getPriority() - 1)
                }
            }
        },this)
        this.updateAllSumOfSiblingPri()
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update item
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateItem = (id: number, newType: MpgItemType, newName: string, newPriroity: number) => {
        const foundItem = this.getItem(id)
        if(foundItem != undefined){
            const item = foundItem as MpgItem
            item.setType(newType)
            item.setName(newName)
            item.setPriority(newPriroity)
            this.updateAllSumOfSiblingPri()
        }else{
            console.log("Item not found with id: ",id) // todo: need a standard way to report and record errors of this nature
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update sum of siblings pri
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    private updateSumOfSiblingPri = (type: MpgItemType): number => {
        let sumOfSiblingsPri = 0
        for(let item of this.items){
            if(item.getType() == type){
             sumOfSiblingsPri += item.getPriority()
            }
        }
        return sumOfSiblingsPri
        // now sort them
        // this.items = this.items.sort((item1, item2) => {return (item2.getPriority() - item1.getPriority())})
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update all sum of sibling pri
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    private updateAllSumOfSiblingPri = () : void => {
        // the following does noit work because what is returned is string not enum
        // for(let type in MpgItemType){
        //     this.updateSumOfSiblingPri(type)
        // }
        // let's do it in any way we can then improve
        // todo: improve
        let sum = this.updateSumOfSiblingPri(MpgItemType.coreVlaue)
        this.sumOfSiblingsPri[0] = sum

        // tasks have to be handled differently at project level     
        //this.updateSumOfSiblingPri(MpgItemType.task)
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get sum of siblings pri
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getSumOfSiblingPri = () => {
        return this.sumOfSiblingsPri
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create item
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    createItem = (type: MpgItemType, name: string, pri: number): void => {
        const newItem = new MpgItem(-1, type, name, pri)
        this.items.push(newItem)
        this.updateAllSumOfSiblingPri()
    }
}