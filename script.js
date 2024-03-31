
const main = document.getElementById("main")

async function fetchBook(query, limit) {
    const res = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=${limit}`)
    return res
}

async function fetchBookCover(query) {
    const res = await fetch(`https://covers.openlibrary.org/b/isbn/${query}-M.jpg`)
    return res
}


function showBook(parent, query, limit) {
    fetchBook(query, limit)
        .then((res) => res.json())
        .then((books) => {
                console.log(books)
                for (let i = 0; i < books.docs.length; i++) {
                    appendBooks(books, i, parent)
                }

        })
        .catch((err) => console.error(err))
}

function appendBooks(res, number, parent) {
    appendBook(res, number, parent)
}

function appendBook(res, number, parent) {
    const div = document.createElement('div')

    appendBookTitle(res, number, div)
    appendBookAuthor(res, number, div)
    appendBookISBN(res, number, div)
    appendBookCover(res, number, div)

    parent.appendChild(div)
}

function appendBookCover(res, number, parent) {
    const img = document.createElement('IMG')
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

function appendBookTitle(res, number, parent) {
    const para = document.createElement('p')
    let title = JSON.stringify(res.docs[number].title)
    title = title.replace(/['"]+/g, '')
    para.innerText = `${title}`
    parent.appendChild(para)
}

function appendBookAuthor(res, number, parent) {
    const para = document.createElement('p')
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

function appendBookISBN(res, number, parent) {
    const para = document.createElement('p')
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

showBook(main, "brothersong", 4)