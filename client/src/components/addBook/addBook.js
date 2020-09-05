import React from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './addBook.css';

class AddBook extends React.Component{
    render(){
        return(
            <div id="bookForm">
                <form action="/add-book" method="POST" encType="multipart/form-data">
                    <label className="BookItem" htmlFor="name">Book name:</label>
                    <br />
                    <input type="text" className="BookItem" id="name" name="name" />
                    <br />
                    <label className="BookItem" htmlFor="author">Book author:</label>
                    <br />
                    <input type="text" className="BookItem" id="author" name="author" />
                    <br />
                    <label className="BookItem" htmlFor="pic">Book picture:</label>
                    <br />
                    <input className="BookItem" type="file" id="pic" name="pic" />
                    <br />
                    <label className="BookItem" htmlFor="description">Book description:</label>
                    <br />
                    <input className="BookItem" type="text" id="description" name="description" />
                    <br />
                    <label className="BookItem" htmlFor="price">Book price:</label>
                    <br />
                    <input className="BookItem" type="number" step="0.01" id="price" name="price" />
                    <br />
                    <label className="BookItem" htmlFor="genres">Book genres:</label>
                    <br />
                    <input className="BookItem" type="text" id="genres" name="genres" />
                    <br />
                    <button type="submit" className="btn btn-primary BookItem">Submit</button>
                </form>
            </div>
        );
    }
}

export default AddBook;