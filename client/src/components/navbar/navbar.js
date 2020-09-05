import React from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';


//Bootstrap navbar component
class Navbar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          menu: false,
          username: ""
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.LogoutUser = this.LogoutUser.bind(this);
      }
    
      toggleMenu(){
        this.setState({ menu: !this.state.menu })
      }

      LogoutUser(){
        fetch('http://localhost:5000/logout-user', {
                method: 'GET', 
                mode: 'cors',
                credentials: 'include'
        });
      }

      componentDidMount(){
        console.log("Fetching user");
        fetch('http://localhost:5000/logged-user', {
            method: 'GET', 
            mode: 'cors',
            credentials: 'include'
        }).then(res => res.json()).then((result) => {
            if(result.username != null){
                this.setState({
                    username: result.username
                })
            }else{
                this.setState({
                    username: ""
                })
            }
        });
      }

    render(){
        const show = (this.state.menu) ? "show" : "" ;

        return(
            <nav className="navbar navbar-expand-md sticky-top">

                <span className="navbar-text"><FontAwesomeIcon icon={faMoon} />
DREAM LAND</span>
                
                <button className="navbar-toggler" type="button" onClick={ this.toggleMenu}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
                
                <div className={"collapse navbar-collapse " + show}>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/store">Store</a>
                        </li>
                        <li className="nav-item">
                            {this.state.username != "" ? <a className="nav-link" onClick={this.LogoutUser} href="/">Logout</a> : <a className="nav-link" href="/login">Login</a>}
                        </li>
                        <li className="nav-item">
                            {this.state.username != "" ? <a className="nav-link" href="/cart">Cart <FontAwesomeIcon icon={faShoppingCart} /></a> : <a className="nav-link" href="/register">Register</a>}
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Navbar;