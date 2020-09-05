import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/navbar/navbar';
import Homepage from './components/homepage/homepage';
import Login from './components/login/login';
import Register from './components/register/register';
import Cart from './components/cart/cart';
import AddBook from './components/addBook/addBook';
import Store from './components/store/store';
import Item from './components/item/item';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: "",
      isLogged: false,
      responded: false
    };
    this.LogoutUser = this.LogoutUser.bind(this);
  }

  LogoutUser(){
    fetch('http://localhost:5000/logout-user', {
            method: 'GET', 
            mode: 'cors',
            credentials: 'include'
    });
  }
  
  async componentDidMount(){
    console.log("Fetching user");
    await fetch('http://localhost:5000/logged-user', {
        method: 'GET', 
        mode: 'cors',
        credentials: 'include'
    }).then(res => res.json()).then((result) => {
        if(result.username != null){
            this.setState({
                username: result.username,
                isLogged: true,
                responded: true
            })
        }else{
            this.setState({
                username: "",
                isLogged: false,
                responded: true
            })
        }
    });
  }

  

  render(){
    console.log("Islogged: "+this.state.isLogged);
    if(this.state.responded){
      return (
        <Router>
          <div className="App">
            <Navbar />
            <Switch>
              <Route path="/" exact component={Homepage} />
              <Route exact path="/login">
                {this.state.isLogged == false ? <Login /> : <Redirect to="/" />}
              </Route>
              <Route exact path="/register">
                {this.state.isLogged == false ? <Register /> : <Redirect to="/" />}
              </Route>
              <Route path="/logout">
                {this.LogoutUser}
                <Redirect to="/" />
              </Route>
              <Route exact path="/cart">
                {this.state.isLogged == true ? <Cart /> : <Redirect to="/" />}
              </Route>
              <Route exact path="/addBook">
                {this.state.username == "admin" ? <AddBook /> : <Redirect to="/" />}
              </Route>
              <Route path="/store" exact component={Store} />
              <Route path="/store/:itemId" exact component={Item} />
            </Switch>
          </div>
        </Router>
      );
    }else{
      return <div></div>
    }
  }
  
}

export default App;
