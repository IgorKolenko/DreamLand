import React from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css'

class Login extends React.Component{
    constructor(){
        super();
        this.state = {
            msg: ""
        }
    }

    componentDidMount(){
        fetch('http://localhost:5000/login-msg', {
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
                            <form className="form-container" action="/login-user" method="POST">
                                <p style={{width: 100+"%"}}>{this.state.msg}</p>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Email address</label>
                                    <input type="email" className="form-control" name="email" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1">Password</label>
                                    <input type="password" className="form-control" name="password" id="exampleInputPassword1" placeholder="Password" />
                                </div>
                                <button type="submit" className="btn btn-primary">Login</button>
                                <br />
                                <a href="/register">Create an account</a>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;