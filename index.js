const Nightmare = require('nightmare');
const nightmare = Nightmare({show: true});
const dotenv = require('dotenv').config({ silent: true });

nightmare
    .goto('https://badoo.com/ru/signin/?f=top')
    .wait('.js-signin-password')
    .type('.js-signin-login', process.env.email)
    .type('.js-signin-password', process.env.password)
    .click('.sign-form__submit')
    .wait('.js-profile-layout-container');

const addLike = () => {
    nightmare
        .click('.js-profile-header-toggle-layout')
        .wait('.scale-value')
        .evaluate(function () {
            return document.querySelector('.scale-value').innerText;
        })
        .then(function (value) {
            const rating = value.replace(/,/g, '.');
            console.log('rating', rating);
            if (6 < Number(rating)) {
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
addLike();
