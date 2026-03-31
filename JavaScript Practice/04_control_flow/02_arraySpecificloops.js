//++++++++++++ For each +++++++++++

const coding = ["js","cpp","java","swift","python"]

// coding.forEach((items) => {
//     console.log(items);
// })

// function printMe(item){
//     console.log(item);
// }
// coding.forEach(printMe)

coding.forEach((item, index ,arr) => {
    console.log(item, index, arr);
})// it gives item name,index and entire array as output


// Using object 

const myCoding =[
    {
        languageName : "javascript",
        languageFileName : "js"
    },

    {
        languageName : "java",
        languageFileName : "java"
    },
    {
        languageName : "python",
        languageFileName : "py"
    },
]

myCoding.forEach((item) => {
    console.log(item.languageName);
})