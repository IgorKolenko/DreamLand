import React from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import StripeCheckout from 'react-stripe-checkout';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var total = 0;

class Cart extends React.Component{

    constructor(props){
        super(props);
        this.state = {
          cart: [],
          total: 0 
        };
        this.deleteItem = this.deleteItem.bind(this);
        this.continueShopping = this.continueShopping.bind(this);
        this.handleToken = this.handleToken.bind(this);
      }

    async componentDidMount(){
        toast.configure();
        await fetch('http://localhost:5000/get-user-cart', {
            method: 'GET', 
            mode: 'cors',
            credentials: 'include'
        }).then(res => res.json()).then((result) => {
            this.setState({
                cart: result
            });
        });
    }

    deleteItem(num){
        fetch('http://localhost:5000/delete-item', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "num": num
            }),
            mode: 'cors',
            credentials: 'include'
        }).then((res) => {
            window.location.reload(false);
        })
    }

    continueShopping(b){
        b.preventDefault();
        window.location.replace("/store");
    }

    handleToken(token){
        //console.log({token, addresses});
        console.log("Total: "+total.toFixed(2));
        fetch('http://localhost:5000/checkout', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token,
                product: {price: total.toFixed(2)/2}
            }),
            mode: 'cors',
            credentials: 'include'
        }).then((res) => {
            total = 0;
            console.log(res.status);
            if(res.status == 200){
                fetch('http://localhost:5000/delete-all', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    mode: 'cors',
                    credentials: 'include'
                }).then(async (res) => {
                    toast.success('Checkout complete!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                    setTimeout(() => {
                        window.location.reload(false);  
                    }, 3000);
                });
            }else{
                toast.error('Something went wrong', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
            }
        })
    }

    render(){
        console.log("User cart: "+JSON.stringify(this.state.cart));
        var ind = -1;
        return(
            <div>
                <h1>Cart</h1>
                <div class="container mb-4">
                    <div class="row">
                        <div class="col-12">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col"> </th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Author</th>
                                            <th scope="col" class="text-center">Quantity</th>
                                            <th scope="col" class="text-right">Price</th>
                                            <th> </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.cart.map((item) => {
                                            total += item.qnt*item.price;
                                            ind++;
                                            return(
                                                <tr>
                                                    <td><img src={'http://localhost:5000/images/'+item.fileID} style={{width: 50+'px', height: 80+'px'}}/> </td>
                                                    <td>{item.name}</td>
                                                    <td>{item.author}</td>
                                                    <td>{item.qnt}</td>
                                                    <td class="text-right">{(item.qnt*item.price).toFixed(2)+" $"}</td>
                                                    <td class="text-right">
                                                        <button class="btn btn-sm btn-danger" onClick={() => this.deleteItem(ind)}><i><FontAwesomeIcon icon={faTrashAlt} /></i> </button> 
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        <tr>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><strong>Total</strong></td>
                                            <td class="text-right"><strong>{total.toFixed(2)+" $"}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="col mb-2">
                            <div class="row">
                                <div class="col-sm-12  col-md-6">
                                    <button id="continueBtn" className="btn btn-block btn-light" onClick={this.continueShopping}>Continue Shopping</button>
                                </div>
                                <div class="col-sm-12 col-md-6 text-right">
                                    <StripeCheckout className="btn btn-block btn-primary"
                                    stripeKey="pk_test_51HFHGeIkujnIiQVa1gmL9HqUIwTWYdsFf3LYgUiMBLPYZLGMh05pCsvAGehcu5iVFTR6Kc9dX8lISe0KYDBL4Wzw00KOZNvDwa" 
                                    token={this.handleToken}
                                    billingAddress
                                    shippingAddress
                                    amount={total.toFixed(2)*100} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cart;