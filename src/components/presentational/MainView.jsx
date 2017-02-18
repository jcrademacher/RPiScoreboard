import React from 'react';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper';
// icons for tabs
import StatsIcon from 'material-ui/svg-icons/action/assessment';
import ControlIcon from 'material-ui/svg-icons/action/build';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import DisplaysIcon from 'material-ui/svg-icons/av/video-label';
import Panel from "../containers/Panel.jsx";
import LinearProgress from "material-ui/LinearProgress";

export default class MainView extends React.Component {

  constructor(props) {
		super(props);

		this.sendHTTPRequest = this.sendHTTPRequest.bind(this);

		this.state = {
			progress: 0,
			tabIndex: 1
		};
	}

	// method available to all panels for sending http requests
	sendHTTPRequest(method, url, data) {
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = (e) => {
			var p;

			// running through all readyState possibilities, updating progress bar as such
			switch(xhr.readyState) {
				case 1:
					p = 25;
					break;
				case 2:
					p = 50;
					break;
				case 3:
					p = 75;
					break;
				case 4:
					p = 100;
					break;
			}

			// not found
			if(xhr.status != 200)
				p = 0;

			this.setState({ progress: p }); // sets value for progress bar defined in main.js

			if(xhr.readyState == 4) {
				setTimeout(() => this.setState({ progress: 0 }), 2000); // reset progress to 0 after 2 seconds
			}
		};

		xhr.open(method, url, true);
		xhr.send(data);
	}

  render() {
    var panel;

		var styles = {
			paper: {
				backgroundColor: "#f5fafa"
			}
		};

		var i = this.state.tabIndex;

    if(i == 0) {
      panel = "stats";
    }
    else if(i == 1){
      panel = "control";
    }
		else if(i == 2) {
			panel = "displays";
		}
		else if(i == 3) {
			panel = "settings"
		}
		else {
			panel = "control";
		}

    return (<div style={{textAlign: "center"}}>
      <Paper zDepth={4} style={styles.paper}>
        <div>
          <BottomNavigation style={{backgroundColor: "#e5e5e5"}} selectedIndex={this.state.tabIndex}>
            <BottomNavigationItem
              label="View Stats"
              icon={<StatsIcon/>}
              onClick={() => this.setState({tabIndex: 0})}
            />
            <BottomNavigationItem
              label="Control Board"
              icon={<ControlIcon/>}
              onClick={() => this.setState({tabIndex: 1})}
            />
						<BottomNavigationItem
							label="Displays"
							icon={<DisplaysIcon/>}
							onClick={() => this.setState({tabIndex: 2})}
						/>
						<BottomNavigationItem
              label="Settings"
              icon={<SettingsIcon/>}
              onClick={() => this.setState({tabIndex: 3})}
            />
          </BottomNavigation>
        </div>
        <div>
					<LinearProgress mode="determinate" value={this.state.progress}/> {/* progress bar for http statuses */}
          <Panel selectedIndex={panel} httpCallback={this.sendHTTPRequest}/>
        </div>
      </Paper>
    </div>);
  }
}