// const declarations for DOM elements
const booksDiv = document.getElementById("books")
const bookSearchDiv = document.getElementById("books-search")
const bookQuery = document.getElementById("book-query")
const bookQueryButton = document.getElementById("book-query-submit")
const bookQueryLimit = document.getElementById("book-query-limit")

// GET API that returns a json of books that is based on the string query given
// Query should be a string, Limit and offset should be an integer
// Default offset is put to 0 for pagination purposes
async function fetchBooks(query, limit, offset = 0) {
    const res = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=${limit}&offset=${offset}`)
    return res
}

// GET API that returns a cover image of a book using ISBN number to search the cover
// isbn and size should be a string
// default value of size is M
// possible size value is: S, M, L
async function fetchBookCover(isbn, size = "M") {
    const res = await fetch(`https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`)
    return res
}

// defines the current page for pagination purposes
let booksPaginationPage = 0

// nextPaginationPage adds 1 to booksPaginationPage
function nextPaginationPage() {
    booksPaginationPage += 1
}

// nextPaginationPage substract 1 to booksPaginationPage if it is more than 0
function prevPaginationPage() {
    if (booksPaginationPage <= 0) {
        return
    }

    booksPaginationPage -= 1
}


// fetches the books from fetchBooks function using arguments
// parent is the div variable that is the book is going to append itself into
// query is the string that will be searched when using the API
// limit is the integer that will limit the amount of searches that will be used
// whilst the books are loading it will call the appendLoad() function to show users it is loading
// after the books have been retrieved it will call clearDiv() to remove any existing element in the parent div
// appendBook() will then be called for every single book that got retrieved
function showBooks(parent, query, limit) {
    appendLoad(parent)
    fetchBooks(query, limit)
        .then((res) => res.json())
        .then((books) => {
            clearDiv(parent)
            for (let i = 0; i < books.docs.length; i++) {
                appendBook(books, i, parent)
            }
        })
        .catch((err) => console.error(err))
}

// Load function that will be put whilst the user is waiting for the retrieval of books
// required so that the user didnt think anything is broken after they press the search button
function appendLoad(parent) {
    const para = document.createElement('p')

    para.innerText = "loading..."

    parent.appendChild(para)
}

// appendBook creates a div for a book and puts book details inside of the div
// it will search up for the cover, title, author, and ISBN of the book
// res is the JSON that is retrieved from the API
// number is the index of the book that is being appended
// parent is the div element that the book will be appended to
// the div of the book itself has the class of "book"
// the cover has the class name of "book-cover-div"
// the main info has the class name of "book-info-div"
function appendBook(res, number, parent) {
    const div = document.createElement('div')
    const divChild = document.createElement('div')
    const divChild2 = document.createElement('div')

    div.className = "book"
    divChild.className = "book-cover-div"
    divChild2.className = "book-info-div"

    appendBookCover(res, number, divChild)
    appendBookTitle(res, number, divChild2)
    appendBookAuthor(res, number, divChild2)
    appendBookISBN(res, number, divChild2)
    
    div.appendChild(divChild)
    div.appendChild(divChild2)
    parent.appendChild(div)
}

// appendBookCover creates an IMG element that is retreived from res and appends it to parent
// parent is the div element that the IMG is gonna be appended to
// res is the json that is being retrieved from the api
// number is the index of the book that is being appended
// the book cover have the class name of "book-cover"
function appendBookCover(res, number, parent) {
    const img = document.createElement('IMG')
    img.className = "book-cover"
    try {
        let isbn = JSON.stringify(res.docs[number].isbn[0])
        let title = JSON.stringify(res.docs[number].title)
        title = title.replace(/['"]+/g, '')
        isbn = isbn.replace(/['"]+/g, '')
        fetchBookCover(isbn)
            .then((res)=> {img.src = res.url})
        img.alt = `${title} IMG` 
        parent.appendChild(img)
        
    } catch (error) {
        img.alt = "Cover not found"
        parent.appendChild(img)
    }    
}

// appendBookTitle creates a 'p' element that is retrieved from res and appends it to parent
// parent is the div element that the IMG is gonna be appended to
// res is the json that is being retrieved from the api
// number is the index of the book that is being appended
// the book title have the class name of "book-title"
function appendBookTitle(res, number, parent) {
    const para = document.createElement('p')
    para.className = "book-title"
    try {
        let title = JSON.stringify(res.docs[number].title)
        title = title.replace(/['"]+/g, '')
        para.innerText = `${title}`
        parent.appendChild(para)
    } catch(err) {
        para.innerText = "Title not found"
        parent.appendChild(para)
    }
}

// appendBookAuthor creates a 'p' element that is retrieved from res and appends it to parent
// parent is the div element that the IMG is gonna be appended to
// res is the json that is being retrieved from the api
// number is the index of the book that is being appended
// the book author have the class name of "book-author"
function appendBookAuthor(res, number, parent) {
    const para = document.createElement('p')
    para.className = "book-author"
    try {
        let author = JSON.stringify(res.docs[number].author_name[0])
        author = author.replace(/['"]+/g, '')
        para.innerText = `${author}`
        parent.appendChild(para)
    } catch (error) {
        para.innerText = "Author not found"
        parent.appendChild(para)
    }

}

// appendBookISBN creates a 'p' element that is retrieved from res and appends it to parent
// parent is the div element that the IMG is gonna be appended to
// res is the json that is being retrieved from the api
// number is the index of the book that is being appended
// the book ISBN have the class name of "book-isbn"
function appendBookISBN(res, number, parent) {
    const para = document.createElement('p')
    para.className = "book-isbn"
    try {
        let isbn = JSON.stringify(res.docs[number].isbn[0])
        isbn = isbn.replace(/['"]+/g, '')
        para.innerText = `${isbn}`
        parent.appendChild(para)  
    } catch (error) {
        para.innerText = "ISBN not found"
        parent.appendChild(para)  
    }

}

// queryAppendEmpty creates a div that will be shown when the query is empty and appends it to parent
function queryAppendEmpty(parent) {
    const div = document.createElement('div')
    const para = document.createElement('p')
    const para2 = document.createElement('p')

    para.innerText = "Query is empty"
    para2.innerText = "Please Enter A Book Name"

    div.appendChild(para)
    div.appendChild(para2)

    parent.appendChild(div)
}

// clearDiv clears a div that is provided in div
function clearDiv(div) {
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

// submitQuery handles the main function of calling all of the append books function
function submitQuery() {
    if (bookQuery.value == "") {
        clearDiv(booksDiv)
        queryAppendEmpty(booksDiv)
    } else {
    clearDiv(booksDiv)
    showBooks(booksDiv, bookQuery.value, bookQueryLimit.value)
    }
}

// links the bookQueryButton to the submitQuery function
bookQueryButton.addEventListener('click', submitQuery)

// enables the user to just press enter to search instead of clicking the search button
bookQuery.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      bookQueryButton.click();
    }
})

// adds the class "input-focus" when the bookQuery is focused on
bookQuery.addEventListener("focusin", function() {
    bookSearchDiv.classList.add("input-focus")
})

// removes the class "input-focus" when the bookQuery is not focused on
bookQuery.addEventListener('focusout', function() {
    bookSearchDiv.classList.remove("input-focus")
})

// calls the queryAppendEmpty first because by default there is no query
queryAppendEmpty(booksDiv)