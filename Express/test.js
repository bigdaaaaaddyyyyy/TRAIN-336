let x = 10;
let y = x++ + ++x;

console.log(y);
console.log(x);

console.log(42 / +0);
console.log(42 / -0);

class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    getArea() {
        return this.width * this.height;
    }
}

const NewRectangle = new Rectangle(10, 20);

console.log(NewRectangle.width);
console.log(NewRectangle.height);
console.log(NewRectangle.getArea());

{
  // TDZ starts at beginning of scope
  const func = () => console.log(letVar); // OK

  // Within the TDZ letVar access throws `ReferenceError`

  let letVar = 3; // End of TDZ (for letVar)
  func(); // Called outside TDZ!
}