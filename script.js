"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Omar Yousry",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 0, // %
  pin: 2007,

  movementsDates: [
    "2025-01-18T21:31:17.178Z",
    "2025-01-15T07:42:02.383Z",
    "2025-01-08T09:15:04.904Z",
    "2025-01-01T10:17:24.185Z",
    "2025-01-16T22:00:00.000Z",
    "2025-01-19T17:01:17.194Z",
    "2025-01-11T23:36:17.929Z",
    "2025-01-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "en-US", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Mohamed Salah",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 0,
  pin: 1995,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "EGP",
  locale: "ar-EG",
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions

const formatCurrency = (acc, value) =>
  new Intl.NumberFormat(acc?.locale, {
    style: "currency",
    currency: acc.currency,
  }).format(value);

const formatMovementsDate = function (date, locale) {
  const now = new Date();

  const daysPassed = function (date1, date2) {
    const days = (date2 - date1) / (1000 * 60 * 60 * 24);
    return Math.round(Math.abs(days));
  };

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  if (daysPassed(date, now) === 0) return "Today";
  if (daysPassed(date, now) === 1) return "Yesterday";
  if (daysPassed(date, now) <= 7) return `${daysPassed(date, now)} days ago`;
  return new Intl.DateTimeFormat(locale, options).format(date);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // We can also sort dates by making a and array of objects with both values of the movement and the date and then sort it by the movement value (This is what Jonas did in the course)
  const dates = sort
    ? acc.movementsDates
        .slice()
        .sort(
          (a, b) =>
            acc.movements[acc.movementsDates.indexOf(a)] -
            acc.movements[acc.movementsDates.indexOf(b)]
        )
    : acc.movementsDates;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const displayDate = formatMovementsDate(new Date(dates[i]), acc.locale);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formatCurrency(acc, mov)}</div>
    </div>
    `;

    // SOLUTION 1
    // containerMovements.innerHTML = html + containerMovements.innerHTML;
    // SOLUTION 2
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Computing usernames
const getUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(" ")
      .map(word => word[0])
      .join("");
  });
};
getUsernames(accounts);

const getBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCurrency(acc, acc.balance);
};

const calcDisplaySummary = function (acc) {
  const totalDeposits = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const totalwithdrawals = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const totalInterest = acc.movements
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCurrency(acc, totalDeposits);
  labelSumOut.textContent = formatCurrency(acc, Math.abs(totalwithdrawals));
  labelSumInterest.textContent = formatCurrency(acc, totalInterest);
};

const updateUI = function (acc) {
  // Display balance
  getBalance(acc);
  // Display movements
  displayMovements(acc);
  // Display summary
  calcDisplaySummary(acc);
};

const startTimer = function (acc) {
  // 1. set timer when logging in
  // 2. make it work
  // 3. when it reaches 0 => log out
  // 4. reset the timer when logging out
  // 5. reset the timer when doing any activity

  const displayTimer = function (time) {
    return new Intl.DateTimeFormat(acc.locale, {
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(time));
  };

  const availableTime = 5 * 60 * 1000;
  let time = availableTime;

  labelTimer.textContent = displayTimer(time);
  time -= 1000;

  timer = setInterval(() => {
    labelTimer.textContent = displayTimer(time);

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
      time = availableTime;
    }

    time -= 1000;
  }, 1000);

  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// Appearing the application
// containerApp.style.opacity = 1;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from reload
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value.toLowerCase()
  );

  // Starting timer
  if (timer) clearInterval(timer);
  timer = startTimer(currentAccount);

  if (+inputLoginPin.value === currentAccount?.pin) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 1;

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "2-digit",
      year: "numeric",
      month: "2-digit",
    };

    // labelDate.textContent = `${formatDate(now)}, ${now
    //   .getHours()
    //   .toString()
    //   .padStart(2, 0)}:${now.getMinutes().toString().padStart(2, 0)}`;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    updateUI(currentAccount);

    // Get rid of user data
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;

  const recipient = accounts.find(
    acc => acc.username === inputTransferTo.value.toLowerCase()
  );
  // console.log(recipient);

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    recipient.username !== currentAccount.username
  ) {
    // Update movements
    currentAccount.movements.push(-1 * amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    recipient?.movements.push(amount);
    recipient?.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    // reset timer
    clearInterval(timer);
    timer = startTimer(currentAccount);
  }

  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();
  inputTransferTo.blur();
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  // if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
  // currentAccount.movements.push(amount);
  // currentAccount.movementsDates.push(new Date().toISOString());
  // updateUI(currentAccount);
  // }

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // reset timer
    clearInterval(timer);
    timer = startTimer(currentAccount);

    const gettingLoan = setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 2000);
  }

  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value.toLowerCase() === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    labelWelcome.textContent = `Log in to get started`;
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = "";
    inputCloseUsername.blur();
    inputClosePin.blur();
  }
});

// let sorting = 0;
let sorted = false;
btnSort.addEventListener("click", () => {
  // Solution 1
  // displayMovements(currentAccount.movements, sorting % 2 === 1 ? false : true);
  // sorting++;

  // Solution 2
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
console.log(7 === 7.0);

// Base 10 - 0 to 9
// Binary base 2 - 0 1
console.log(0.1 + 0.2);
// For these ERROR we can not do a scientific calculations in JavaScript
console.log(0.1 + 0.2 === 0.3);

console.log(Number("7"));
console.log(+"7");

console.log(Number("7omar"));
console.log(Number.parseInt("7omar", 10));
console.log(Number.parseInt("7oma7r7", 10));
console.log(Number.parseInt("o7", 10));

console.log(Number.parseInt("   2.5px   "));
// Very useful to get the value from a string (e.x from css)
console.log(Number.parseFloat("   2.5px   "));

// console.log(parseFloat("2.5px"));

// Checking if the value is a NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN(+"7omar"));

// Checking if the value is a number (commonly used)
console.log(Number.isFinite(20));
console.log(Number.isFinite("20"));
console.log(Number.isFinite(20 / 0));

console.log(Number.isInteger("20"));
console.log(Number.isInteger(20));
console.log(Number.isInteger(20.0));
console.log(Number.isInteger(20.2));

console.log(Math.sqrt(64));
console.log(Math.round(64 ** (1 / 3)));

console.log(Math.max(1, 3, -5, 29, "83", -7));
console.log(Math.min(1, 3, -5, 29, 83, -7));

console.log(Math.PI * Number.parseFloat("10px") ** 2);

console.log(Math.trunc(Math.random() * 7) + 1);

const randomInt = (min = 1, max) =>
  Math.trunc(Math.random() * (max - min + 1)) + min;
console.log(randomInt(0, 100));

console.log(Math.ceil(7.3));
console.log(Math.ceil(7.9));

console.log(Math.trunc(-7.5));
console.log(Math.floor(-7.5));

console.log(randomInt(-5, -7));

console.log(+(8.3235).toFixed(5));

// REMAINDER OPERATOR
const isEven = num => num % 2 === 0;
console.log(isEven(2));
console.log(isEven(-2));

btnTransfer.addEventListener("click", () => {
  [...document.querySelectorAll(".movements__row")].forEach((row, i) => {
    if (i % 2 === 0) row.style.backgroundColor = "red";
    if (i % 3 === 0) row.style.backgroundColor = "blue";
  });
});


// NUMERIC SEPARATOR
const num = 323_235_532_89;
console.log(num);

console.log(2325_53890_345809);

// console.log(7._593); // ERROR
// console.log(7_.593); // ERROR
// console.log(312__35); // ERROR

console.log(Number("329_834")); // NaN
console.log(Number.parseInt("329_834"));

// BIGINT

// Integers => 64 bit (53 for number + 11 fro the position)
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);

console.log(2 ** 53 + 1);
console.log(2 ** 53);
console.log(2 ** 53 + 0);

console.log(BigInt(2893654));
console.log(238956298365908236509623408951689456789347598348596389n);
console.log(2389562983659082365096236389n * 100000n);

const huge = 2089759823465708926596230985609283467n;
const small = 299;
console.log(huge * BigInt(small));

// Exceptions
console.log(20n > 23);
console.log(20n > 13);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == 20);

console.log(huge + " is really big !!");

// DATES IN JavaScript

// Creating a date
const now = new Date();
console.log(now);

console.log(new Date("Aug 2 2022 8:35 GMT+01:00"));

console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2024, 9, 15, 8, 53, 12)); // Months is 0 based
console.log(new Date(2024, 10, 31));

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));

// Working with dates
const birthday = new Date(2007, 6, 7, 5);

console.log(birthday);
console.log(birthday.getFullYear());
console.log(birthday.getMonth() + 1);
console.log(birthday.getDate());
console.log(birthday.getDay());
console.log(birthday.getHours());
console.log(birthday.getMinutes());
console.log(birthday.getSeconds());
console.log(birthday.toISOString());
console.log(birthday.getTime());

console.log(new Date(1183773600000));
console.log(Date.now());
console.log(new Date(1723701956833));

// Operations with dates
const future = new Date(2027, 11, 7, 5, 0);

const daysPassed = function (date1, date2) {
  const days = (date1 - date2) / (1000 * 60 * 60 * 24);
  return Math.floor(Math.abs(days));
};
console.log(daysPassed("2020-07-11T23:36:17.929Z", future));


// Internationalizing dates
const now = new Date();
const options = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  Month: "numeric",
  year: "numeric",
  weekday: "long",
};
const date = new Intl.DateTimeFormat(nag, options).format(now);
console.log(date);


// Internationalizing numbers
const num = 232234.234;
const options = {
  style: "currency",
  // maximumSignificantDigits: 3,
  // useGrouping: true,
  // unit: "kilometer",
  // unitDisplay: "long",
  currency: account2.currency,
  currencyDisplay: "symbol",
};
console.log(new Intl.NumberFormat(navigator.language, options).format(num));

// setTimeouT
const names = ["mar", "hany", "sayad"];
const printNames = setTimeout(
  (name1, name2) => {
    console.log(name1, name2);
  },
  1000,
  ...names
);
if (names.includes("omar")) {
  clearTimeout(printNames);
  console.error("ERROR!");
}
console.log("Waiting...");

// setInterval
const clock = setInterval(function () {
  const options = {
    hour: "numeric",
    second: "numeric",
    minute: "numeric",
  };
  const now = new Intl.DateTimeFormat(navigator.language, options).format(
    new Date()
  );
  console.log(now);
}, 1000);


*/
