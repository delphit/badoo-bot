const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const dotenv = require('dotenv').config({ silent: true });

const addLike = () => {
  nightmare
    .click('.js-profile-header-toggle-layout')
    .wait('.scale-value')
    .evaluate(function() {
      return {
        rating: document.querySelector('.scale-value').innerText,
        location: document.querySelector('.js-location-label').innerText,
      };
    })
    .then(function({ rating: value, location }) {
      const rating = value.replace(/,/g, '.');
      console.log('\t rating', rating, 'location', location);
      if (rating && 6 < Number(rating) && location === 'Львов') {
        console.log('yes -> click');
        return nightmare.type('body', '1');
      } else {
        console.log('no -> click');
        return nightmare.type('body', '2');
      }
    })
    .then(() => {
      return addLike();
    });
};
const loading = () => {
  nightmare
    .goto('https://badoo.com/ru/signin/?f=top')
    .wait('.js-signin-password')
    .type('.js-signin-login', process.env.email)
    .type('.js-signin-password', process.env.password)
    .click('.sign-form__submit')
    .wait('.js-profile-layout-container')
    .then(() => {
      return addLike();
    });
};
loading();
