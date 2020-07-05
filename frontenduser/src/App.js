import React from 'react';
import { Router,Route,Switch,Redirect, BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { ToastContainer } from 'react-toastify';
import { authFunction }  from "./helpers/auth"
import 'react-toastify/dist/ReactToastify.css';
import logo from './logo.svg';
import './App.css';
import Login  from "./login/login.js";
import Dashboard  from "./dashboard/dashboard"; 

function PrivateRoute ({component: Component, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authFunction.authCheck() === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

const history = createBrowserHistory();


class App extends React.Component{
  render(){
  return (    
      <Router history={history}>
    {/* <Login/>       */} 
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
        />
          {/* <Redirect path='/' to="/login" /> */}
          {(authFunction.authCheck())?          
            <Switch>
              {/* <Redirect from="/" to="/dashboard"/> */}
              <PrivateRoute path='/' exact  component={Dashboard} />
              <PrivateRoute path='/dashboard' exact  component={Dashboard} />
              <PrivateRoute path='/userresult' exact  component={Dashboard} />
              <Redirect to="/" />
            </Switch>
            :
            <Switch>
              <Route path='/' exact component={Login} />          
              <Route path='/login' exact component={Login} />
              <Redirect to="/" />
            </Switch>
            
          }
      </Router>          
  );
  }
}

export default App;
