import React from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './store.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';

class Store extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isOpen: false,
            dropdownValue: "All",
            sliderValue: 20,
            searchValue: "",
            returnedJson: []
        };
        this.toggleOpen = this.toggleOpen.bind(this);
        this.dropdownOnClick = this.dropdownOnClick.bind(this);
        this.sliderOnChange = this.sliderOnChange.bind(this);
        this.handleValue = this.handleValue.bind(this);
        this.filterPost = this.filterPost.bind(this);
        this.searchPost = this.searchPost.bind(this);
        this.redToItemPage = this.redToItemPage.bind(this);
    }

    toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

    componentDidMount(){
        fetch('http://localhost:5000/filter-books', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "genre": "All",
                "maxPrice": 20
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
        })
    }

    handleValue(s){
        this.setState({
            searchValue: s.target.value
        });
    }

    dropdownOnClick(b){
        b.preventDefault();
        const value = b.target.value;
        this.setState({
            dropdownValue: value
        });
    }

    sliderOnChange(s){
        const value = s.target.value
        this.setState({
            sliderValue: value
        })
    }

    filterPost(b){
        b.preventDefault();
        fetch('http://localhost:5000/filter-books', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "genre": this.state.dropdownValue,
                "maxPrice": this.state.sliderValue
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
        })
    }

    searchPost(b){
        b.preventDefault();
        fetch('http://localhost:5000/search-books', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "search": this.state.searchValue
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
            });
        })   
    }

    redToItemPage(id){
        console.log("Redirecting to Item page "+ id);
        window.location.replace("/store/"+id);
    }

    render(){
        const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;
        var json = this.state.returnedJson;
        var self = this;
        return(
            <div id="body">
                <div id="searchAndFilter">
                    <form id="search">
                        <input type="text" className="form-control" id="searchArea" onChange={this.handleValue} placeholder={"Search..."} />
                        <button id="searchSubmit" onClick={this.searchPost} className="btn btn-primary">Search</button>
                    </form>
                    <form id="filter">
                        <label htmlFor="category">Category:</label>
                        <div className="btn-group" id="dropdown" onClick={this.toggleOpen}>
                            <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.dropdownValue}
                            </button>
                            <div className={menuClass}>
                                <button className="dropdown-item" onClick={this.dropdownOnClick} value="All">All</button>
                                <button className="dropdown-item" onClick={this.dropdownOnClick} value="Fantasy">Fantasy</button>
                                <button className="dropdown-item" onClick={this.dropdownOnClick} value="Sci-Fi">Sci-fi</button>
                                <button className="dropdown-item" onClick={this.dropdownOnClick} value="Romance">Romance</button>
                                <button className="dropdown-item" onClick={this.dropdownOnClick} value="Mystery">Mystery</button>
                                <button className="dropdown-item" onClick={this.dropdownOnClick} value="Thriller">Thriller</button>
                                <button className="dropdown-item" onClick={this.dropdownOnClick} value="Horror">Horror</button>
                                <button className="dropdown-item" onClick={this.dropdownOnClick} value="Educational">Educational</button>
                            </div>
                        </div>
                        <label htmlFor="priceSlider">Max price:</label>
                        <input type="range" id="priceSlider" min="1" max="20" value={this.state.sliderValue} onChange={this.sliderOnChange} />
                        <p>{this.state.sliderValue+"$"}</p>
                        <button id="filterSubmit" className="btn btn-primary" onClick={this.filterPost}>Filter</button>
                    </form>
                </div>

                <div id="itemDisplay">
                    {json.map(function(book){
                        var imgUrl = 'http://localhost:5000/images/'+book.fileID;
                        return(
                            <div className="card" style={{width: 18+'rem'}} value={book._id} onClick={() => self.redToItemPage(book._id)}>
                                <img src={'http://localhost:5000/images/'+book.fileID} className="card-img-top" style={{width: 17.9+'rem', height: 500+'px'}} alt="..." />
                                <div className="card-body">
                                    <h5 className="card-title">{book.name}</h5>
                                    <p className="card-text">{book.author}</p>
                                    <br />
                                    <p className="card-text" style={{color: "green"}}>{book.price}$</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Store;