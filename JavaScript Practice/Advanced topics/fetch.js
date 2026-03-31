
//The fetch() method of the Window interface starts the process of fetching a resource from the network, 
//returning a promise that is fulfilled once the response is available.

//example using ".await()"
// async function getAllUsers(){
//     try {
//         const response = await fetch("https://api.github.com/users/hiteshchoudhary")
//         //response.json() also takes time so we have to add await.
//         const data  =await response.json()
//         console.log(data);
//     } catch (error) {
//         console.log("E :", error); 
//     }
// }

// getAllUsers() // this generates first then all other codes above this code.

// same function using .then() and .catch().

fetch("https://api.github.com/users/hiteshchoudhary")
.then((response) => {
    return response.json()
})
//this ".then()" handles the data
.then((data) => {
    console.log(data);
})
.catch(() => console.log(error))

// api data gets printed first then all the previous results of the above code , reson??