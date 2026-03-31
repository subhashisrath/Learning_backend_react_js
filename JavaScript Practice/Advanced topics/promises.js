
//A Promise is an object that represents a value that will be available later.
// 3 state of promises are -

/* | State     | Meaning                       |
| --------- | ----------------------------- |
| pending   | Initial state (still working) |
| fulfilled | Operation succeeded           |
| rejected  | Operation failed              |

Once settled (fulfilled/rejected), state never changes again.
 */
const promiseOne = new Promise(function(resolve,reject){
    //Do an aync task
    //DB calls,cryptography etc
    setTimeout(function () {
        console.log('Async task is complete.');
        resolve();// it needs to be called inorder to get connected to the .then()
    }, 1000)
})

//consuming promise. ".then()" has connection with resolve()
// After the resolve part is complete then only the .then() part be executed.

promiseOne.then(function(){
    console.log("Promise consumed."); 
})

// way-2
new Promise((resolve,reject) => {
    setTimeout(() => {
        console.log("ASync task 2"); 
        resolve();  
    },1000)

}) .then(() => {
    console.log("Async 2 resolved");
})

// 3rd promise
const promiseThree = new Promise(function(resolve,reject){
    setTimeout(function(){
        resolve({username:"subhashis",email:"exa@123"})
    },1000)
})

promiseThree.then(function(user){
    console.log(user); //the parameter passed in resolve will be gotten here.
    //{ username: 'subhashis', email: 'exa@123' }
})

// 4th Promise 
const promiseFour = new Promise(function(resolve,reject){
    setTimeout(function(){
        let error = true
        if (!error){
            resolve({username : "subha" , password : "123"})
        }
        else{
            //reject gives error
            reject('ERROR : Something went wrong')
        }
    },1000)
})

promiseFour
.then((user) => {
    console.log(user);
    return user.username  
})
.then((username) => {
    console.log(username);
}) 
.catch(function(error){
    console.log(error);
})
.finally(function(){
    console.log("The promise is either resolved or rejected");
})

//promise 5
const promiseFive = new Promise((resolve,reject) => {
    setTimeout(function(){
        let error = true
        if (!error){
            resolve({username : "Javacript" , password : "123"})
        }
        else{
            //reject gives error
            reject('ERROR : JS went wrong')
        }
    },1000)
})

// another approach .
async function consumePromiseFive (){
    try {
        const response = await promiseFive
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

consumePromiseFive()
