//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Data class that deals with all things data           
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import {MpgItem, IItemData} from "./item"
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
    items: MpgItem[] = []
    appStateMsg: string 
    dataLoaded: boolean
    sumOfSiblingsPri: number = 0
    constructor(){
        this.items = []
        this.appStateMsg = "No state has beebn set"
        this.dataLoaded = false
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Add item 
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    addItem = (name: string, id: number=-1) =>{
        const item = new MpgItem(id, name)
        this.items.push(item)
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Set Items
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    setItems(fetchedItems: IItems){
        let itemsData: IItemData[] = fetchedItems.items
        let items: MpgItem[] = []
        itemsData.map(itemsData => {
          items.push(new MpgItem(itemsData.id, itemsData.name, itemsData.priority))
        })
        this.items = items
      }    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Save data
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    saveData = (dataHasBeenSavedFun: Function) => {
        // create items data
        let itemsData: IItemData[] = []
        let itemData: IItemData
        for(let item of this.items){
            itemData = {id: item.getId(), name: item.getName(), priority: item.getPriority()}
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
            this.updateSumOfSiblingPri()
            dataHasBeenLoadedFun()})
        .catch((reason: any)=>{console.log("reason:",reason)})
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
        this.updateSumOfSiblingPri()
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
        this.updateSumOfSiblingPri()
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
        this.updateSumOfSiblingPri()
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update item
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateItem = (id: number, newName: string, newPriroity: number) => {
        const foundItem = this.getItem(id)
        if(foundItem != undefined){
            const item = foundItem as MpgItem
            item.setName(newName)
            item.setPriority(newPriroity)
            this.updateSumOfSiblingPri()
        }else{
            console.log("Item not found with id: ",id) // todo: need a standard way to report and record errors of this nature
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update sum of siblings pri
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateSumOfSiblingPri = () => {
        this.sumOfSiblingsPri = 0
        for(let item of this.items){
            this.sumOfSiblingsPri += item.getPriority()
        }
        // now sort them
        this.items = this.items.sort((item1, item2) => {return (item2.getPriority() - item1.getPriority())})
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
    createItem = (name: string, pri: number): void => {
        const newItem = new MpgItem(-1, name, pri)
        this.items.push(newItem)
        this.updateSumOfSiblingPri()
    }
}