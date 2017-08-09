const Nightmare = require('nightmare');
const _ = require('lodash');
const co = require('co');
const nightmare = Nightmare({ show: true });
const dotenv = require('dotenv').config({ silent: true });

const like = function*() {
  yield nightmare.wait(500);
  yield nightmare.click('.js-profile-header-toggle-layout');
  yield nightmare.wait('.js-location-label');
  yield nightmare
    .evaluate(function() {
      return {
        location: document.querySelector('.js-location-label').innerText,
      };
    })
    .then(function({ location }) {
      console.log('\t Location:   ', location);
      if (location === 'Львов') {
        console.log('yes -> click');
        return nightmare.type('body', '1');
      } else {
        console.log('no -> click');
        return nightmare.type('body', '2');
      }
    })
    .catch(err => console.log('Error in the like function =>>>', err));
};
const auth = function*() {
  yield nightmare.goto('https://badoo.com/ru/signin/?f=top');
  yield nightmare.wait('.js-signin-password');
  yield nightmare
    .type('.js-signin-login', process.env.email)
    .type('.js-signin-password', process.env.password)
    .click('.sign-form__submit');
  yield nightmare
    .wait('.js-profile-layout-container')
    .catch(err => console.log('Error in the login function =>>>', err));
};

co(function*() {
  yield auth();
  for (let i = 0; i < 1000; i++) {
    yield like();
  }
}).then(() => console.log('finished!'), e => console.log(e));
