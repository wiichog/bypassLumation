/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch } from "react-router-dom";

import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import routes from "routes.js";
import './styles.css';

var ps;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "black",
      activeColor: "info",
      login: false,
      password: "",
    };
    this.mainPanel = React.createRef();
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      this.mainPanel.current.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }
  handleActiveClick = color => {
    this.setState({ activeColor: color });
  };
  handleBgClick = color => {
    this.setState({ backgroundColor: color });
  };
  handlePassword = (event) => {
    this.setState({password: event.target.value});
  }
  handleLogin = () => {
    if (this.state.password === "password"){
      this.setState({
        login:true,
      })
    }
  }
  render() {
    return (
        this.state.login ? (
          <div className="wrapper">
          <Sidebar
            {...this.props}
            routes={routes}
            bgColor={this.state.backgroundColor}
            activeColor={this.state.activeColor}
          />
          <div className="main-panel" ref={this.mainPanel}>
            <DemoNavbar {...this.props} />
            <Switch>
              {routes.map((prop, key) => {
                return (
                  <Route
                    path={prop.layout + prop.path}
                    component={prop.component}
                    key={key}
                  />
                );
              })}
            </Switch>
          </div>
        </div>
        ) : (
          <div className="login-wrapper">
            <div className="login">
              <h5>
                Ingresa la contraseña:
              </h5>
              <TextField
                className="myinput"
                variant="outlined"
                id="password"
                label="Pasword"
                name="password"
                type="password"
                value={this.state.password} 
                onChange={this.handlePassword} 
              />
              <Button variant="contained" color="primary" onClick={()=>this.handleLogin()}>
                Login
              </Button>
            </div>
          </div>
        )
    );
  }
}

export default Dashboard;
