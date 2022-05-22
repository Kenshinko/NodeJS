const colors = require("colors/safe");

"use strict";

const isPrime = (number) => {
	if (number < 2) return false;

	for (let i = 2; i <= number / 2; i++) {
		if (number % i === 0) return false;
	}

	primes++;
	return true;
};

let count = 1;
let primes = 0;

const from = +process.argv[2];
const to = +process.argv[3];

if (Number.isNaN(from) || Number.isNaN(to)) {
	process.exit(console.error(colors.red.bold("One of the arguments is not a number")));
}

for (let number = from; number <= to; number++) {
	let colorer = colors.green;

	if (isPrime(number)) {
		if (count % 2 === 0) {
			colorer = colors.yellow;
			count += 1;
		} else if (count % 3 === 0) {
			colorer = colors.red;
			count = 1;
		} else {
			count += 1;
		}

		console.log(colorer(number));
	}
}

if (primes === 0) {
	console.log((colors.red.bold("There are no prime numbers in the given range")));
}