import * as React from 'react';
import { WithStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import {Theme} from '@material-ui/core'
import { createStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
///////////////////////////////////////////////////////////////////////////////////////////////
// define interfaces for state and props
///////////////////////////////////////////////////////////////////////////////////////////////
interface IAppProps extends WithStyles<typeof styles> {}
interface IAppState {
  appStatus: string,
  newItemName: string,
  // data: MpgData
}
///////////////////////////////////////////////////////////////////////////////////////////////
// MpgApp class
///////////////////////////////////////////////////////////////////////////////////////////////
class MpgApp extends React.Component<IAppProps,IAppState> {
  public render() {
    return (
      <div className="App">
       <h1>My Personal Graph - v11</h1>
      </div>
    );
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // define styles used in the app
  ///////////////////////////////////////////////////////////////////////////////////////////////
}
///////////////////////////////////////////////////////////////////////////////////////////////
// define styles
// consider moving these to a seaparte file
///////////////////////////////////////////////////////////////////////////////////////////////
const drawerWidth = 240;    // find a better place to initialise and maintain this and other constants!
const styles = ({ zIndex, spacing, mixins }: Theme) => createStyles({
  root: {
    display: 'flex',
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
    marginRight: 20,
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
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////
// export MpgApp 
///////////////////////////////////////////////////////////////////////////////////////////////
export default withStyles(styles)(MpgApp)