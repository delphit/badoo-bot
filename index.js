const Nightmare = require("nightmare");
const _ = require("lodash");
const co = require("co");
const nightmare = Nightmare({ show: true });
const dotenv = require("dotenv").config({ silent: true });
const { email, password, location, score } = process.env;

const selectors = [
  { key: "location", selector: ".js-location-label" },
  { key: "score", selector: ".js-profile-score" },
  { key: "interests", selector: ".js-interests-board" }
];

const getUserInfo = function(selector) {
  return nightmare
    .exists(selector)
    .then(element => {
      if (element) {
        nightmare.evaluate(function(selector) {
          return document.querySelector(selector).innerText;
        }, selector);
      }
      return false;
    })
    .catch(e => console.log("fffffffffffffffffffffff", e));
};

const like = function*() {
  yield nightmare.wait(500);
  yield nightmare.click(".js-profile-header-toggle-layout");
  yield nightmare.wait("body");
  const userInfo = yield selectors.map(url => {
    return {
      [url.key]: getUserInfo(url.selector)
    };
  });
  yield nightmare
    .evaluate(() => {
      console.log(
        "\t Location:",
        userInfo, // тут ніхера немає...
        "Score",
        userInfo.score,
        "Interests",
        userInfo.interests
      );
      if (
        userInfo || // тут ніхера немає...
        userInfo.location === location ||
        userInfo.score < score
      ) {
        console.log("yes -> click");
        return nightmare.type("body", "1");
      } else {
        console.log("no -> click");
        return nightmare.type("body", "2");
      }
    })
    .catch(e => console.log(e));
  console.log("llloooggg", userInfo);
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
