// const coding = ["js","cpp","java","swift","python"]

// let myItems = coding.forEach((items) => {
//     console.log(items); 
//     return items[0] // returns "undefined" bvz for each doesn't return .
// })
// console.log(myItems);

//forEach() doesn't return value but filter() and map() does.

const myNums = [1,2,3,4,5,6,7,8,9,10]

// one way of writing the function.
/* let oddNums = myNums.filter((items) => {
     if (items%2 !== 0) {
        return items 
    }
}) */

// second way
let oddNums = myNums.filter((items) => items %2 !== 0)
// console.log(oddNums); //[1,3,5,7,9]

// Even if we can't return in foreach but we can solve the same problem using for each too.

const newNums = []

myNums.forEach((item) => {
    if(item %2 !== 0){
        newNums.push(item)
    }
})

// console.log(newNums);// [1.3,5,7,9]

//-----------Problem related to book -------------
const books = [
  { title: "Silent Forest", genre: "Fantasy", publish: 2015, edition: "1st" },
  { title: "Edge of Tomorrow", genre: "Sci-Fi", publish: 2018, edition: "2nd" },
  { title: "Mind Over Matter", genre: "Self-Help", publish: 2020, edition: "1st" },
  { title: "Crimson Truth", genre: "Thriller", publish: 2013, edition: "3rd" },
  { title: "Waves of Time", genre: "Adventure", publish: 2011, edition: "1st" },
  { title: "Code & Chaos", genre: "Tech", publish: 2022, edition: "1st" },
  { title: "Lost Chronicle", genre: "History", publish: 2009, edition: "4th" },
  { title: "Patterns of Life", genre: "Bio", publish: 2017, edition: "2nd" },
  { title: "Black Horizon", genre: "Mystery", publish: 2014, edition: "3rd" },
  { title: "Digital Dreams", genre: "Cyberpunk", publish: 2021, edition: "1st" }
];

/* //1.Print only the titles of all books.
books.forEach((bk) => {
    console.log(bk.title); 
})
//2.Find all books published after 2015.
const booksAfter2015 = books.filter((bk) => {
    return bk.publish > 2015
})
console.log(booksAfter2015);

//3.Find all books with edition "1st".
const edition1st = books.filter((bk) => {
    return bk.edition === "1st"
})
console.log(edition1st);

// 4.Return an array of all genres.
const booksGenre = []
books.forEach((bk) => {
    booksGenre.push(bk.genre)
})

console.log(booksGenre);

//5.Count how many books belong to the genre 'Fantasy'.
const fantasyCount = books.filter(bk => bk.genre === "Fantasy").length;
console.log(fantasyCount); */


//Return an array of all genres using map()

const booksGenre = books.map((bk) => bk.genre)
console.log(booksGenre);// array of books genre 

//Print only the titles of all books using map
console.log(books.map((bk) => bk.title))