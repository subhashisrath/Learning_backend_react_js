const buttons = document.querySelectorAll('.button');
const body = document.querySelector('body');

//querySelectorAll returns a nodelist but we can use foreach to loopthrough.
buttons.forEach(function (button) {
  console.log(button);
  button.addEventListener('click', function (e) {
    // e is event object
    console.log(e);
    console.log(e.target); // It lets us know where the event is coming from.

    if (e.target.id === 'grey') {
      body.style.backgroundColor = 'grey';
    }
    if (e.target.id === 'white') {
      body.style.backgroundColor = 'white';
    }
    if (e.target.id === 'blue') {
      body.style.backgroundColor = 'blue';
    }
    if (e.target.id === 'yellow') {
      body.style.backgroundColor = 'yellow';
    }
  });
});
