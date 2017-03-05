// your run of the mill average garden
// variety function
function bark (words) {
  return `${this.doggoName} barks ${words}`
}

// As a global function, bark's this is the window
bark('thing')
// returns "undefined barks thing"
window.doggoName = 'WindowDoggo'
// set window.doggoName to "WindowDoggo"
bark('thing')
// returns "WindowDoggo barks thing"

let drillBitDarel = {
doggoName: 'Drill Bit Darel'
}

// As a method of drillBitDarel object, bark's
// this is drillBitDarel
drillBitDarel.bark = bark
function bark(words) {
  return `${this.doggoName} barks ${words}`
}
drillBitDarel.bark('thing')
// returns "Drill Bit Darel barks thing"

// 👇 using bind this way makes the woof function
// a copy of bark where its this is always
// drillBitDarel
let darelsWoof = bark.bind(drillBitDarel)

// You can use Chrome's console.dir to verify
// if a function has been bound
console.dir(darelsWoof)
// Opening up the object will show you
// the this that's been bound, the arguments
// that have been bound & the function
// it copies (or, targets)

darelsWoof('Monster Smash')
// returns "Drill Bit Darel barks Monster Smash"
const moneybagsMichael = {
doggoName: "Moneybags Michael"
}

// even when darelsWoof is set as a method of another
// object, it will still always the this that was bond
// with .bind
moneybagsMichael.woof = darelsWoof
function bark(words) {
  return `${this.doggoName} barks ${words}`
}

//👇 as an example
moneybagsMichael.woof("Thing")
// returns "Drill Bit Darel barks Thing"

// DEMO .call
bark('thing')
// mild mannered bark returns "WindowDoggo barks thing"
// 👇 use the .call method of the Function.prototype to
// immediately use the function with a different this
bark.call({doggoName: 'Immediate Pete'}, 'Do you even chew!?')
// returns "Immediate Pete barks Do you even chew!?"

// 👇 once a function has been, it's this can not be changed even with .call
darelsWoof.call({doggoName: 'Immediate Pete'}, 'Do you even chew!?')
// returns "Drill Bit Darel barks Do you even chew!?"



// EXERCISE: Refactor Counter#timer with .bind
if (false) {
  class Counter {
    constructor (count = 0, step = 1) {
      this.count = count;
      this.step = step;
    }
    setCount (n) { this.count = n }
    setStep (step) { this.step = step }
    inc () { return this.count += this.step }
    dec () { return this.count -= this.step }
    now () { return this.count }
    show () { return this.count }
    reset () {
      this.count = 0;
      this.step = 1;
    }
    time (startTime) {
      this.setCount(startTime);

      let intervalId = setInterval(function () {
        if (this.dec() <= 0) clearInterval(intervalId);

        console.info(this.show());
      // when the current anonymous function is declared,
      // we immediately call bind on it which creates a copy
      // of the function that has a permanently bound this which
      // will be the same as the scope it was declared in
      }.bind(this), 1000);
    }
  }
  const timer = new Counter();
}


class Counter {
  constructor (count = 0, step = 1) {
    this.count = count;
    this.step = step;
  }
  setCount (n) { this.count = n }
  setStep (step) { this.step = step }
  inc () { return this.count += this.step }
  dec () { return this.count -= this.step }
  now () { return this.count }
  show () { return this.count }
  reset () {
    this.count = 0;
    this.step = 1;
  }
  time (startTime) {
    this.setCount(startTime);

    // if an arrow function doesn't any arguments, you must
    // still begin it's declaration with ()
    let intervalId = setInterval(() => {
      if (this.dec() <= 0) clearInterval(intervalId);

      console.info(this.show());
    }, 1000);
  }
}

const timer = new Counter();


// Demo: Plucking Petals
const random = n => Math.floor(Math.random() * n)


function pluckPetalsSynchronous () {
  // a promise will have two end states
  // depending on whether or not resolve or rejected
  // was called first
  return new Promise((resolve, reject) => {
    if (random(2) === 0) {
      // if 👇 is called, pluckPetals will return a Promise
      // with the status resolve and the value 'yes'
      resolve('yes');
    } else {
      // if 👇 is called, pluckPetals will return a Promise
      // with the status reject and the value 'no'
      reject('no');
    }
  })
}

// EXERCISE: Wait for it

const randFromRange = (end, start = 0) =>
  Math.floor(Math.random() * (end - start)) + start;

function pluckPetals () {
  // the callback given to the Promise constructor
  // is commonly referred as the executor
  return new Promise((resolve, reject) => {
    // 👇 the following works because .bind can also be used to pre-set an
    // argument without actually calling resolve
    setTimeout(resolve.bind(null, 'yes'), randFromRange(3000, 1000));
    // 👇 the following works with a callback that will call the reject function
    // we're making use of a closure to keep access to scope of the parent function
    // of () => reject('no')
    setTimeout(() => reject('no'), randFromRange(3500, 1500))
  })
}

// DEMO: Then There Were Petals
// As shown above, pluckPetals returns a Promise
// to read the value of a Promise, we must call
// the .then method on it with a callback.
// the given callback will be called with the
// argument of resolve inside the Promise executor
pluckPetals()
  .then(result => console.log(result))
  // same with catch
  .catch(err => console.log(err))

// DEMO: Create a delay function
{
  const delay = time => new Promise(
    (resolve, reject) => {
      setTimeout(resolve, time)
    }
  )

// don't chain promises this way
// 🚫🚫🚫🚫🚫🚫🚫🚫
  delay(2000)
  .then(
    () => pluckPetals().then(result => console.log(result))
  )


// chain promises like 👇
  delay(2000)
  .then(() => pluckPetals())
  .then(result => console.log(result))
// if a callback given to .then returns a promise,
// that promise will become responsibility for resolution
// in other words, chain .then afterwards will call it on that promise
}

const add = (val) => result => new Promise(
  (resolve, reject) => {
    resolve(val + result);
  }
)

{ // Another way to do this
  const add = (a, b) => new Promise(
    (resolve, reject) => {
      resolve(a + b)
    }
  );

  add(3,0)
    .then(result => add(1, result))
    .then(result => add(2, result))
    .then(result => add(6, result))
}

add(3)(0)
  .then(add(1))
  .then(add(2))
  .then(add(6))

// EXERCISE: Upgrade delay

// const delay = (time, val) => new Promise(
//   (resolve, reject) => {
//     setTimeout(() => resolve(val), time)
//   }
// )

const delay = time => result => new Promise(
  (resolve, reject) => {
    setTimeout(() => {
      console.info(`delay:`, result);
      resolve(result)
    }, time)
  }
)

// DEMO: Sequential vs. Parralel

function promiseVal (val) {
  return delay(randFromRange(3000))(val);
}

function sequentialDemo () {
  promiseVal(10)
    .then(() => promiseVal(20))
    .then(() => promiseVal(30))
    .then(() => promiseVal(40))
    .then(() => promiseVal(50))
}

function parallelDemo () {
  const allPromises = [
    promiseVal(10),
    promiseVal(20),
    promiseVal(30),
    promiseVal(40),
    promiseVal(50)
  ]

  Promise.all(allPromises)
   .then(result => console.log(result))
}





















/* */
