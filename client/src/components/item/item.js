import React from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './item.css';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Item extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            returnedJson: {},
            quantity: 1
        }
        this.onBackButtonEvent = this.onBackButtonEvent.bind(this);
        this.onChangeFunc = this.onChangeFunc.bind(this);
        this.addToCartFunc = this.addToCartFunc.bind(this); 
    }
    
    componentDidMount(){
        toast.configure();
        const { match: { params } } = this.props;
        console.log(params.itemId);
        fetch('http://localhost:5000/item', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "itemId": params.itemId
            }),
            mode: 'cors',
            credentials: 'include'
        })
        .then((resp) => {
            return resp.json();
        })
        .then((json) => {
            this.setState({
                returnedJson: json
            })
        });
    }


    onBackButtonEvent(nextState){
        if (nextState.action === 'POP') {
            window.location.replace("/store");
        }
    }

    onChangeFunc(i){
        this.setState({
            quantity: parseInt(i.target.value)
        });
    }

    addToCartFunc(b){
        b.preventDefault();
        var itemJson = this.state.returnedJson;
        itemJson.qnt = this.state.quantity;
        fetch('http://localhost:5000/add-to-cart', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "itemJson": itemJson
            }),
            mode: 'cors',
            credentials: 'include'
        })
        .then((resp) => {
            return resp.json();
        })
        .then((json) => {
            if(json.isLogged == false){
                window.location.replace("/login");
            }else{
                var message = itemJson.qnt+" "+itemJson.name+" has been added to your cart";
                toast.info(message, {
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
        var book = this.state.returnedJson;

        return(
            <div id="itempageBody">
                <div id="itemImgDiv">
                    <img src={'http://localhost:5000/images/'+book.fileID} class="card-img-top" style={{width: 17.9+'rem', height: 500+'px'}} alt="..." />
                </div>
                <div id="itemInfo">
                    <h1>{book.name}</h1>
                    <h2>{book.author}</h2>
                    <h3>{book.description}</h3>
                    <p>{"Genres: "+book.genres}</p>
                    <form id="addForm">
                        <input type="number" id="itemQuantity" name="quantity" defaultValue={1} min="1" onChange={this.onChangeFunc} />
                        <button id="addBtn" className="btn btn-primary" onClick={this.addToCartFunc}>Add to Cart</button>      
                    </form>
                </div>
            </div>
        );
    }
}

export default Item;