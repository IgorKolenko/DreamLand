import React from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './register.css'

class Register extends React.Component{
    constructor(){
        super();
        this.state = {
            msg: ""
        }
    }

    componentDidMount(){
        fetch('http://localhost:5000/register-msg', {
            method: 'GET', 
            mode: 'cors',
            credentials: 'include'
        }).then(res => res.json()).then((result) => this.setState({
            msg: result.msg
        }));
        console.log("Message: "+this.state.msg);
    }

    render(){
        return(
            <div id="body">
                <div className="container-fluid bg">
                    <div className="row justify-content-center">
                        <div className="col-12 col-sm-6 col-md-5 col-lg-3">
                            <form className="form-container" action="/register-user" method="POST">
                                <p>{this.state.msg}</p>
                                <div className="form-group">
                                    <label htmlFor="inputUsername">Username</label>
                                    <input type="username" className="form-control" name="username" id="inputUsername" aria-describedby="usernameHelp" placeholder="Enter username" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="InputEmail">Email address</label>
                                    <input type="email" className="form-control" name="email" id="InputEmail" aria-describedby="emailHelp" placeholder="Enter email" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="InputPassword1">Password</label>
                                    <input type="password" className="form-control" name="password" id="InputPassword1" placeholder="Password" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="InputPassword2">Confirm password</label>
                                    <input type="password" className="form-control" name="confirmPassword" id="InputPassword2" placeholder="Password" />
                                </div>
                                <button type="submit" className="btn btn-primary">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;