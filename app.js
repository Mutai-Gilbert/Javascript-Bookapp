// Book class Represents a boo

class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class
class UI {
    static displayBooks(){
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
}
static addBookToList(book){
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');
    row.innerHTML =`
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class=delete> X</a></td>`;
    list.appendChild(row);
}
static deleteBook(el){
    if(el.classList.contains('delete')){
        el.parentElement.parentElement.remove();
    }
}

// Show alert
static showAlert(message, className){
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div,form);
    // clear the alert in 3 seconds
    setTimeout(()=>document.querySelector('.alert').remove(), 3000);
}

static clearFields(){
    document.querySelector('#title').value = '';
    document.querySelector('#Author').value = '';
    document.querySelector('#isbn').value = '';
}
}

//Store class
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
    }
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book,index)=>{
            if(book.isbn==isbn){
                book.splice(index,1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}
//Events Display
document.addEventListener('DOMContentLoaded', UI.displayBooks);
// Add a book
document.querySelector('#book-form').addEventListener('submit',(e)=> {
    e.preventDefault();
    //get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#Author').value;
    const isbn = document.querySelector('#isbn').value;
    // Validate
    if(title == '' || author == '' || isbn == ''){
        UI.showAlert('PLease fill all the details', 'danger')
    }else{

         // instantiate a new book
    const book = new Book(title,author,isbn);

    //Add books to UI
    UI.addBookToList(book);

    // add book to store 
    Store.addBook(book);
    //show success message 
    UI.showAlert('Book Added', 'success');

    // Clear fields 
    UI.clearFields();
    } 
});

//Remove a book

document.querySelector('#book-list').addEventListener('click', (e)=>{
    
    // Remove from UI
    UI.deleteBook(e.target);
    //Remove from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // show sucess when book removed
    UI.showAlert('Book Removed', 'success');
})