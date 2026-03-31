//JS has two memories STACK(primitive),HEAP(non primitive)
// Primitive data types stores copy of the object but Non primitives stores reference of the objects.

//primitive dtypes stores a copy of the varibles in stack . so changing its value didn't affect the original.
let name="subhashis"
let anotherName=name // here a copy of the "names" value is assigned to "anotherName".
anotherName="someone"
console.log(name);//subhashis
console.log(anotherName);//someone


// Non primitive datatypes stores variables in heap .
let user={
    name:"subhashis",
    email:"kjjk@mj"
}
let anotheUser=user // Here the exct reference of the object is being assigned to "anotherUser" so changing it will change the original.
anotheUser.email="aaabb@mj" // now the "user's email is this.
console.log(user.email);// aaabb@mj
