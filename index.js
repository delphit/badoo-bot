const Nightmare = require("nightmare");
const _ = require("lodash");
const co = require("co");
const nightmare = Nightmare({ show: true });
const dotenv = require("dotenv").config({ silent: true });
const { email, password, location, score } = process.env;

const selectors = [
  { key: "name", selector: ".profile-header__name .ellipsis" },
  { key: "location", selector: ".js-location-label" },
  { key: "score", selector: ".scale-value" },
  { key: "interests", selector: ".js-interests-board" }
];

const getContents = (selectors) => {
  let userInfo = {};
  selectors.map(sel => {
    const ele = document.querySelector(sel.selector);
    return (userInfo[sel.key] = ele && ele.innerHTML);
  });
  return userInfo;
}

const like = function*() {
  yield nightmare.wait(500);
  yield nightmare.click(".js-profile-header-toggle-layout");
  yield nightmare.wait(".js-profile-location-container");
  yield nightmare
    .evaluate(getContents, selectors)
    .then(userInfo => {
      if (
        userInfo &&
        (userInfo.location === location || userInfo.score < score)
      ) {
        console.log(`\t yes -> click -- Info:   Name: ${userInfo.name}, "Score: ${userInfo.score}, Interests": ${userInfo.interests}`);
        return nightmare.type("body", "1");
      } else {
        console.log(`\t no -> click -- Info:   Name: ${userInfo.name}, "Score: ${userInfo.score}, Interests": ${userInfo.interests}`);
        return nightmare.type("body", "2");
      }
    })
    .catch(e => console.log(e));
};

const auth = function*() {
  yield nightmare.goto("https://badoo.com/ru/signin/?f=top");
  yield nightmare.wait(".js-signin-password");
  yield nightmare
    .type(".js-signin-login", email)
    .type(".js-signin-password", password)
    .click(".sign-form__submit");
  yield nightmare
    .wait(".js-profile-layout-container")
    .catch(e => console.log(e));
};

co(function*() {
  yield auth();
  for (let i = 0; i < 1000; i++) {
    yield like();
  }
}).then(() => console.log("finished!"), e => console.log(e));
