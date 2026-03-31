//  class Person {
//     constructor (name,age){
//         this.name = name
//         this.age = age
//     }
//     hello(){
//        return `${this.name} is ${this.age} years old.`
//     }
//  }
 
//  const person1 = new Person("subhashis",20)
//  const person2 = new Person("rahul",25)

//  console.log(person1.hello())
//  console.log(person2.hello())


//   class Account{
//     constructor(balance){
//         this.balance = balance
//     }

//     deposite(amount){
//         this.balance += amount
//         return `Your current balance : ${this.balance}`
//     }

//     withdraw(amount){
//         this.balance -= amount
//         return `your current balance : ${this.balance}`
//     }
//  }

//  const sbi = new Account(5000)
//  console.log(sbi.deposite(500))
// console.log(sbi.withdraw(1000))


// class TeaMaking {
//   #type;

//   constructor(type) {
//     this.#type = type;
//   }
//   #boilWater() {
//     return "Boiling  the water .";
//   }

//   #addTea() {
//     return `Adding the ${this.#type} into the water.`;
//   }
//   #addSugar() {
//     return `Adding the sugar into the tea.`
//   }

//   makeTea() {
//     console.log(this.#boilWater());
//     console.log(this.#addTea());
//     console.log(this.#addSugar());
//     console.log(`Your ${this.#type} is ready!`);
//   }
// }

// const morningTea = new TeaMaking("Tata tea");
// morningTea.makeTea(); 



// class person{
//     constructor(rollno,age){
//         this.rollno = rollno
//         this.age=age
//     }
//     Task(){
//         return `Roll no:${this.rollno} will be the monitor tommorow.`
//     }
// }

// class student extends person{
//     constructor(rollno,age,name){
//         super(rollno,age)
//         this.name = name
//     }
//     work(){
//         return `${this.name} is ${this.age} years old.`
//     }
// }

// const student1 = new student(101,20,"subhashis")
// console.log(student1.Task())
// console.log(student1.work());


class Animal{
    constructor(name){
        this.name = name
    }
    speak(){
        return `${this.name} says hii!!`
    }
}

class Dog extends Animal{
    constructor(name){
        super(name)
    }
    speak(){
        return `Dog barks!! woof,woof`
    }
}

const animal1 = new Animal("Lion")
console.log(animal1.speak())
const dog1 = new Dog("Buddy")
console.log(dog1.speak())