async function fetchBook() {
    const res = await fetch("https://openlibrary.org/search.json?q=wolfsong&limit=1")
    return res.json()
}

fetchBook()
    .then((res) => console.log(res.docs[0]))
