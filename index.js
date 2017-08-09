const Nightmare = require('nightmare');
const _ = require('lodash');
const co = require('co');
const nightmare = Nightmare({ show: true });
const dotenv = require('dotenv').config({ silent: true });

const addLike = function*() {
  yield nightmare.wait(500);
  yield nightmare.click('.js-profile-header-toggle-layout');
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
    .catch(err => console.log('error like function =>>>', err));
};
const loading = function*() {
  yield nightmare.goto('https://badoo.com/ru/signin/?f=top');
  yield nightmare.wait('.js-signin-password');
  yield nightmare
    .type('.js-signin-login', process.env.email)
    .type('.js-signin-password', process.env.password)
    .click('.sign-form__submit');
  yield nightmare
    .wait('.js-profile-layout-container')
    .catch(err => console.log('error =>>>', err));
};

co(function*() {
  yield loading();
  for (let i = 0; i < 500; i++) {
    yield addLike();
  }
}).then(() => console.log('finished!'), e => console.log(e));
