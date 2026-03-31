// Declaring singleton object
const tinderUser = new Object()

tinderUser.id="1123abs"
tinderUser.name = "jay"
tinderUser.isLoggedIn = false

// console.log(tinderUser);//{ id: '1123abs', name: 'jay', isLoggedIn: false }

const regularUser = {
    email :"some@gmail.com",
    fullname : {
        userfullname :{
            firstname : "subhashis",
            lastname: "rath"
        }
    }
}

// console.log(regularUser.fullname.userfullname.firstname);//subhashis

// const obj1 = {1: "a", 2: "b"};
// const obj2 = {3: "a", 4: "b"};

// const obj3 = {obj1,obj2}
//{ obj1: { '1': 'a', '2': 'b' }, obj2: { '3': 'a', '4': 'b' } }


/* // assign() takes the first arg as target and rest as source. then merges the sources to target. 
const obj4 = Object.assign({},obj1,obj2)
//{ '1': 'a', '2': 'b', '3': 'a', '4': 'b' }
console.log(obj4);

const obj5 = {...obj1,...obj2}
console.log(obj5);//{ '1': 'a', '2': 'b', '3': 'a', '4': 'b' }
 */


/* //It gives keys and values as arrays.
console.log(Object.keys(tinderUser)); //[ 'id', 'name', 'isLoggedIn' ]
console.log(Object.values(tinderUser));//[ '1123abs', 'jay', false ]

// It gives keys , values pairs as aray in array format .
//[ ['id','1123abs'],['name','jay'],['isLoggedIn',false ] ]
console.log(Object.entries(tinderUser));

//It gives a bolean value if the property exists or not.
console.log(tinderUser.hasOwnProperty('isLoggedIn'));//true */



//Destructuring object
const course = {
    coursename : "Javascript",
    price: "999",
    courseInstructor: "hitesh"
}

// This is destructuring object. Insted of writing same "object.property" mutiple time we can write like this to access it easily.

const {courseInstructor} = course
console.log(courseInstructor);// hitesh

// we can even name them according to you.
const {courseInstructor: instructor} = course
console.log(instructor);//hitesh

// Json -  javascript objct notation
// Keys are always string in json
// {
//     "name": "xx",
//     "coursename": "nkk",
//     "price":"free"
// }

//sometimes we get aps's in array format like ths
// [
//     {},
//     {},
//     {}
// ]