// classe que representa os livros
class Book {
    constructor(title, autor, isbn) {
        this.title = title;
        this.autor = autor;
        this.isbn = isbn;
    }
}

// UI Class

class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr'); // Criei uma tabela em linha para sprimir lista, que foi setada os elementos nela na class a cima

        row.innerHTML =`
        <td>${book.title}</td>
        <td>${book.autor}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
          el.parentElement.parentElement.remove();
        }
      }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // vanish in 3 seg
        setTimeout(() => document.querySelector('.alert').remove(),2000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#autor').value = '';
        document.querySelector('#isbn').value = '';
    }
}

//store class: handles storage
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index,1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//event add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {

    // precent actual submit
    e.preventDefault();

    //get values
    const title = document.querySelector('#title').value;
    const autor = document.querySelector('#autor').value;
    const isbn = document.querySelector('#isbn').value;

    // validando
    if(title === '' || autor === '' || isbn === '') {
    UI.showAlert('Porfavor preencha os campos corretamente.','danger')
    } else {
    // Instatiate book
    const book = new Book(title, autor, isbn);
    UI.showAlert('Dados Salvos.','success')
    
    //add book to ui
    UI.addBookToList(book);

    //add book to store
    Store.addBook(book);

    //show message salvo!
    // UI.showAlert('Dados Salvos.','success')

    //limpar campo
    UI.clearFields();
    }
})

    //event: remover
    document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);

    // remover livro do store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show success mesage
    UI.showAlert('Livro Removido com sucesso', 'success')
});