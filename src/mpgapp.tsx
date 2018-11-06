import * as React from 'react';
import { WithStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import {Theme, ListItemIcon} from '@material-ui/core'
import { createStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import {CssBaseline} from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import {IconButton} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon';
// import MenuIcon from '@material-ui/icons/Menu'
// import {Paper} from '@material-ui/core'
import {List, ListItem, ListItemText} from '@material-ui/core'
import {Card, CardContent, CardActionArea} from '@material-ui/core'
// import {Button} from '@material-ui/core'
// import {Item} from './item'
// import {IconButton} from '@material-ui/core'
import {TextField} from '@material-ui/core'
import MpgData from './mpgdata'
///////////////////////////////////////////////////////////////////////////////////////////////
// define styles
// consider moving these to a seaparte file
///////////////////////////////////////////////////////////////////////////////////////////////
const drawerWidth = 240;    // find a better place to initialise and maintain this and other constants!
const styles = ({ zIndex, spacing, mixins }: Theme) => createStyles({
  root: {
  },
  appBar: {
    zIndex: zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
  },
  toolbar: mixins.toolbar,
  menuButton: {
    marginLeft: -2,
    marginRight: 2,
  },
  iconLeft: {
    margin: spacing.unit * 2,
    marginLeft: 'auto',
  },
  iconRight: {
    margin: spacing.unit * 2,
    marginRight: 'auto',
  },
  iconHover: {
    margin: spacing.unit * 2,
    '&:hover': {
      color: red[800],
    },
  },
  item: {
    backgroundColor: '#E8E8E8',
    margin: '2px'
  },
  bodyDiv: {
    display: 'flex',
  },
  nameTextField: {
    marginLeft: spacing.unit,
    marginRight: spacing.unit,
    width: "90%",
  },
  priorityTextField: {
    marginLeft: spacing.unit,
    marginRight: spacing.unit,
    width: "5%",
  },
  appStatus: {
    position: 'absolute',
    bottom: 0,
    margin: spacing.unit,
    width: '80  %',
  },
  card: {
    minWidth: 275,
  },
});
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IAppProps extends WithStyles<typeof styles> {}
interface IAppState {
  newItemName: string,
  appErrorStatus: boolean,
  currentPage: CurrentPage,
  menuSelection: MenuSelection,
  data: MpgData,
  selectedItemId: number, //is it possible thta the selected index can be undefined? investigate
  itemPriority: number,
  // consider creating a propoery for the edit/create page
  editAction: EditAction,
  editCreatePageTitle: string
}
///////////////////////////////////////////////////////////////////////////////////////////////
// enum for current page
///////////////////////////////////////////////////////////////////////////////////////////////
enum CurrentPage {
  home,
  list,
  details
}
///////////////////////////////////////////////////////////////////////////////////////////////
// enum for menuSelection
///////////////////////////////////////////////////////////////////////////////////////////////
enum MenuSelection {
  values,
  goals,
  projects
}
///////////////////////////////////////////////////////////////////////////////////////////////
// editing action
///////////////////////////////////////////////////////////////////////////////////////////////
enum EditAction {
  create,
  edit
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MpgApp class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgApp extends React.Component<IAppProps,IAppState> {
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // constructor
  ///////////////////////////////////////////////////////////////////////////////////////////////
  constructor(props: IAppProps){
    super(props)
    this.state = {
      newItemName: "New item name",
      appErrorStatus: false,
      currentPage: CurrentPage.home,
      menuSelection: MenuSelection.values,
      data: new MpgData(),
      selectedItemId: -1,
      itemPriority: 1,
      editAction: EditAction.create,
      editCreatePageTitle: "Add New Item"
      }
    }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // render
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public render() {
    const {classes} = this.props as IAppProps
    return (
      <div className={classes.root}>
      <CssBaseline />
        {this.getCurrentPage()}
      </div>
    )
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // getCurrentpage
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getCurrentPage = () => {
      switch (this.state.currentPage){

        case CurrentPage.list:
          return this.listPage()
          
        case CurrentPage.details:
          return this.detailsPage()

        default:
        return this.menuPage()
      }
    }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle core value click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleCoreValueClick = () => {
    this.setState({menuSelection: MenuSelection.values})
    this.setState({currentPage: CurrentPage.list})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle home buttom click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleHomeClick = () => {
    this.setState({currentPage: CurrentPage.home})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle add item click
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleAddClick = () => {
    this.setState({editAction: EditAction.create})
    this.setState({currentPage: CurrentPage.details})
    // set new item name according to the current selection 
    this.setState({newItemName: "New " + this.getCurrentSelectionText()})
    this.setState({editCreatePageTitle: "New " + this.getCurrentSelectionText()})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle cancel buttom in details page
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleDetailsCancel = () => {
    //the type of selection of value, goals, etc should be still valid
    // we may have to do some other cleaning actions such as reset new item name
    this.setState({currentPage: CurrentPage.list})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle delete icon clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemDelete = (event: React.MouseEvent, id: number) => {
    console.log("handle delete item with id:",id);
    this.state.data.deleteItem(id)
    this.state.data.saveData(this.dataHasBeenSaved)
  } 
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle increase priority icon clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleIncreasePriority = (event: React.MouseEvent, index: number) => {
    this.state.data.increasePriority(index)
    this.state.data.saveData(this.dataHasBeenSaved)
  } 
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle decrease priority icon clicked
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleDecreasePriority = (event: React.MouseEvent, index: number) => {
    this.state.data.decreasePriority(index)
    this.state.data.saveData(this.dataHasBeenSaved)
  } 
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // hanndle save buttom
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleSave = () => {
    switch (this.state.editAction){
      case EditAction.create:
        // add new item
        // this should be delegated to mpgData
        //this.state.data.items.push(new Item(-1, this.state.newItemName, this.state.itemPriority))
        this.state.data.createItem(this.state.newItemName, this.state.itemPriority)
        this.state.data.saveData(this.dataHasBeenSaved)
        break

      case EditAction.edit:
        console.log("Saving updates. idex, name and pri:",this.state.selectedItemId, this.state.newItemName,
        this.state.itemPriority)
        
        this.state.data.updateItem(this.state.selectedItemId, this.state.newItemName,
          this.state.itemPriority)
        this.state.data.saveData(this.dataHasBeenSaved)
        break

      default:
        //should not happen
        // decide if you should handle things that cannot happend
        break
    }
    // set current page to list
    this.setState({currentPage: CurrentPage.list})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle listItem click event
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleListItemClick = (event: React.MouseEvent, index: number) => {
    console.log("handle item selected with id:",index);
    // set new item name to the currently selected item 
    const currentItem = this.state.data.getItem(index)
    if(currentItem != undefined){
      this.setState({newItemName: currentItem.getName()})
      this.setState({itemPriority: currentItem.getPriority()})
      this.setState({editCreatePageTitle: "Edit " + this.getCurrentSelectionText()})
      this.setState({editAction: EditAction.edit})
      this.setState({currentPage: CurrentPage.details})
      // record the id so we know which which item to update
      this.setState({selectedItemId: index})
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // list page
  ///////////////////////////////////////////////////////////////////////////////////////////////
  listPage = () => {
    const {classes} = this.props as IAppProps
    return(
      <div>
         <AppBar position="fixed" className={classes.appBar}>
         <Toolbar style={{display: 'flex', justifyContent:'space-between'}}>
            <Icon onClick={this.handleHomeClick}>
                home
            </Icon>
            <Typography variant="title" color="inherit">
              My Core Values
            </Typography>
            <Icon onClick={this.handleAddClick}>
              add_circle
            </Icon>
        </Toolbar>
        </AppBar>
        <div>
          <List style={{paddingTop:60}}>
            {this.state.data.items.map((item)=>(
              <ListItem button key = {item.getId()} className={classes.item}
                selected={this.state.selectedItemId === item.getId()}
                onClick={() => this.setState({selectedItemId: item.getId()})}>
                <ListItemText primary={item.getName()} 
                  secondary={"Priority: "+item.getAllPriorityText(this.state.data.getSumOfSiblingPri())}/>
                <ListItemIcon>
                  <Icon onClick={event => this.handleListItemClick(event,item.getId())}>
                  edit
                  </Icon>
                </ListItemIcon>
                <ListItemIcon>
                  <Icon onClick={event => this.handleIncreasePriority(event,item.getId())}>
                  keyboard_arrow_up
                  </Icon>
                </ListItemIcon>
                <ListItemIcon>
                  <Icon onClick={event => this.handleDecreasePriority(event,item.getId())}>
                  keyboard_arrow_down
                  </Icon>
                </ListItemIcon><ListItemIcon>
                  <Icon onClick={event => this.handleItemDelete(event,item.getId())}>
                  delete
                  </Icon>
                </ListItemIcon>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    )
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle item name change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleNewTaskChange = (event: React.ChangeEvent ) =>{
    this.setState({newItemName: (event.target as HTMLInputElement).value})
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle item priority change
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleItemPriorityChange = (event: React.ChangeEvent ) =>{
    const newPriority = parseInt((event.target as HTMLInputElement).value)
    if((newPriority != NaN) && newPriority > 0){
     this.setState({itemPriority: newPriority})
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get current selection in a string (to be used in titles, etc)
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getCurrentSelectionText = () => {
    switch (this.state.menuSelection){
      case MenuSelection.values:
        return "Core Value"
      default:
        return "Item"
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // details page
  ///////////////////////////////////////////////////////////////////////////////////////////////
  detailsPage = () => {
    const {classes} = this.props as IAppProps
    // set title according to the selected item type
    return(
      <div>
         <AppBar position="fixed" className={classes.appBar}>
         <Toolbar style={{display: 'flex', justifyContent:'space-between'}}>
            <Icon onClick={this.handleDetailsCancel}>
                cancel
            </Icon>
            <Typography variant="title" color="inherit">
              {this.state.editCreatePageTitle}
            </Typography>
            <Icon onClick={this.handleSave}>
              save
            </Icon>
        </Toolbar>
        </AppBar>
        <div style={{paddingTop:59}}>
          <div>
            <TextField
              id="itemName"
              label="Name"
              className={classes.nameTextField}
              value={this.state.newItemName}
              onChange={this.handleNewTaskChange}
              margin="normal"
            />
            <TextField
            id="itemPriority"
            label="Priority"
            className={classes.priorityTextField}
            value={this.state.itemPriority}
            onChange={this.handleItemPriorityChange}
            margin="normal"
            />
          </div>
        </div>
      </div>
    )
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // menuPage
  ///////////////////////////////////////////////////////////////////////////////////////////////
  menuPage = () => {
    // todo: create a list and render via map function
    return(
      <div style={{display: 'flex', justifyContent:'space-around', padding:10,
        flexWrap: 'wrap'}}>

      <Card style={{maxWidth: 150, minWidth:150, margin:10}}>
      <CardActionArea onClick={this.handleCoreValueClick}>
        <CardContent>
            <Icon >
              my_location
              </Icon>
            <Typography variant="h6" component="h2">
              Core Values
            </Typography>
        </CardContent>
      </CardActionArea>
      </Card>

     <Card style={{maxWidth: 150, minWidth:150, margin:10}}>
      <CardActionArea>
      <CardContent>
      <Icon >
            navigation
            </Icon>
          <Typography variant="h6" component="h2">
            Goals
          </Typography>
      </CardContent>
      </CardActionArea>
      </Card>

      <Card style={{maxWidth: 150, minWidth:150, margin:10}}>
      <CardActionArea>
      <CardContent>
      <Icon >
            navigation
            </Icon>
          <Typography variant="h6" component="h2">
            Projects
          </Typography>
      </CardContent>
      </CardActionArea>
      </Card>

      <Card style={{maxWidth: 150, minWidth:150, margin:10}}>
      <CardActionArea>
      <CardContent>
          <Icon >
            all_inbox
          </Icon>
          <Typography variant="h6" component="h2">
          Inbox
          </Typography>
      </CardContent>
      </CardActionArea>
      </Card>

      </div>
    )
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // data has been loaded
  ///////////////////////////////////////////////////////////////////////////////////////////////
  dataHasBeenLoaded = () => {
    // what should we do with this event?
    //const itemsNumber = this.state.data.items.length
    //console.log("Data has been loaded. Number of items: " + itemsNumber.toString());  
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // data has been loaded
  ///////////////////////////////////////////////////////////////////////////////////////////////
  dataHasBeenSaved = () => {
    // what should we do with this event?
    // const itemsNumber = this.state.data.items.length
    // console.log("Data has been Saved. Number of items: " + itemsNumber.toString());  
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle list item select
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handleListItemClick = (event: React.MouseEvent, index: number) => {
  //   this.setState({ selectedIndex: index })
  // }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component will mount (do some initialisation)
  // is this the write time (versus constructor or component did mount?)
  ///////////////////////////////////////////////////////////////////////////////////////////////=
  componentWillMount(){
    this.state.data.loadData(this.dataHasBeenLoaded)
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component will unmount
  ///////////////////////////////////////////////////////////////////////////////////////////////
  componentWillUnmount() {
    this.state.data.saveData(this.dataHasBeenSaved)
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// export MpgApp 
///////////////////////////////////////////////////////////////////////////////////////////////
export default withStyles(styles)(MpgApp)