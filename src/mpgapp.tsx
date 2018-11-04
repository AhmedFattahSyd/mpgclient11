import * as React from 'react';
import { WithStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import {Theme} from '@material-ui/core'
import { createStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import {CssBaseline} from '@material-ui/core'
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import {IconButton} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon';
// import MenuIcon from '@material-ui/icons/Menu'
// import {Paper} from '@material-ui/core'
import {List, ListItem, ListItemText} from '@material-ui/core'
import {Card, CardContent, CardActionArea} from '@material-ui/core'
// import {Button} from '@material-ui/core'
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
    marginLeft: -12,
    marginRight: 12,
  },
  icon: {
    margin: spacing.unit * 2,
    marginLeft: 'auto',
  },
  iconHover: {
    margin: spacing.unit * 2,
    '&:hover': {
      color: red[800],
    },
  },
  itemList: {
    width: '50%',
    margin: spacing.unit,
    border: 'lightgrey 1px solid'
  },
  item: {
    backgroundColor: '#E8E8E8',
    margin: '2px'
  },
  itemDetails: {
    width: '50%',
    margin: spacing.unit,
    border: 'lightgrey 1px solid'
  },
  bodyDiv: {
    display: 'flex',
  },
  textField: {
    marginLeft: spacing.unit,
    marginRight: spacing.unit,
    width: "90%",
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
  appStatus: string,
  newItemName: string,
  appErrorStatus: boolean,
  currentPage: CurrentPage,
  menuSelection: MenuSelection
  // data: MpgData
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
// MpgApp class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgApp extends React.Component<IAppProps,IAppState> {
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // constructor
  ///////////////////////////////////////////////////////////////////////////////////////////////
  constructor(props: IAppProps){
    super(props)
    this.state = {
      appStatus: "App has started ...",
      newItemName: "New item name",
      appErrorStatus: false,
      currentPage: CurrentPage.home,
      menuSelection: MenuSelection.values
      // data: new MpgData()
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
        case CurrentPage.home:
          return this.menuPage()
        default:
          return(
            <div>
              ERROR - not such a page
            </div>
          )
      }
    }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // menuPage
  ///////////////////////////////////////////////////////////////////////////////////////////////
  menuPage = () => {
    
    return(
      <div style={{display: 'flex', justifyContent:'space-around', padding:10,
        flexWrap: 'wrap'}}>
      <Card style={{maxWidth: 150, minWidth:150, margin:10}}>
      <CardActionArea>
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
            navigation
            </Icon>
          <Typography variant="h6" component="h2">
            Contexts
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
            Journal
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
            What to do now
          </Typography>
      </CardContent>
      </CardActionArea>
      </Card>

      </div>
    )
  }
  menuPageOLD = () => {
    return(
      <List>
        <ListItem
          button
          selected={this.state.menuSelection === MenuSelection.values}
          onClick={event => this.handleListItemClick(event, MenuSelection.values)}>
            <ListItemText primary="Values"></ListItemText>
        </ListItem>
        <ListItem
          button
          selected={this.state.menuSelection === MenuSelection.goals}
          onClick={event => this.handleListItemClick(event, MenuSelection.goals)}>
            <ListItemText primary="Goals"></ListItemText>
        </ListItem>
        <ListItem
          button
          selected={this.state.menuSelection === MenuSelection.projects}
          onClick={event => this.handleListItemClick(event, MenuSelection.projects)}>
            <ListItemText primary="Projects"></ListItemText>
        </ListItem>
      </List>
    )
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // handle list item select
  ///////////////////////////////////////////////////////////////////////////////////////////////
  handleListItemClick = (event: React.MouseEvent, index: MenuSelection) => {
    this.setState({ menuSelection: index }, () => {
      this.setState({appStatus: "Menu index: "+index.toString()})
    })
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // component will mount (do some initialisation)
  // is this the write time (versus constructor or component did mount?)
  ///////////////////////////////////////////////////////////////////////////////////////////////=
  componentWillMount(){
    // this.state.data.loadData(this.dataHasBeenLoaded)
    this.setState({
      appStatus: "App has started ...",
      newItemName: "New item name" 
    })
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// export MpgApp 
///////////////////////////////////////////////////////////////////////////////////////////////
export default withStyles(styles)(MpgApp)