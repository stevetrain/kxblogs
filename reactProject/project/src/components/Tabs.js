import React, { PureComponent as Component} from 'react';
//https://react-bootstrap.github.io/components/navbar/
import { Nav, Navbar,NavbarBrand,Form } from 'reactstrap';
//https://reacttraining.com/react-router/core/guides/philosophy
import { BrowserRouter as Router, Route, Switch, Link} from "react-router-dom";
import Calendar from "./Calendar.js"
import OtherTab from "./OtherTab.js"
class Tabs extends Component {

 render() {
    let slider = (<label className="switch">
                                                        <input type="checkbox" checked={this.props.isNight} onChange={this.props.updateCSS}/>
                                                        <span className="slider round"></span>
                                                      </label>);
    let tabs = ["/","/OtherTab"];
    let connectionLost;
    if(this.props.activeConnection){
      connectionLost=null;
    }else{
      connectionLost=<i className="loader fa fa-spinner fa-spin"></i>;
    }
    return (
      <div className="App">
       <Router>
        <div>
            <div>
                <Navbar>
                    <Nav>
                        <NavbarBrand tag={Link} className={this.props.currentTab===tabs[0] ? "active" : ""} to={tabs[0]}>Calendar</NavbarBrand>
                        <NavbarBrand tag={Link} className={this.props.currentTab===tabs[1] ? "active" : ""} to={tabs[1]}>OtherTab</NavbarBrand>
                    </Nav>
                    <Form inline>
                        {connectionLost}
                        {slider}
                    </Form>
                 </Navbar>
             </div>
             <Switch>
                <Route exact path={tabs[0]} render={(props) => <Calendar
                  table={this.props.table}
                  cellChange = {this.props.cellChange}
                  editRow={this.props.editRow}
                  keyDown={this.props.keyDown}
                  wheel={this.props.wheel}
                  monthMessage={this.props.monthMessage}
                  tabChange={this.props.tabChange}
                  />}
                />
                <Route path={tabs[1]} render={(props) => <OtherTab
                  tabChange={this.props.tabChange}
                />}/>
             </Switch>
         </div>
       </Router>
      </div>
    );
  };
 };

export default Tabs