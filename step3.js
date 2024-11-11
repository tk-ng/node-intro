const fs = require("fs");
const axios = require("axios");

function outputData(data, out) {
	if (out) {
		fs.writeFile(out, data, "utf8", (err) => {
			if (err) {
				console.log(`Couldn't write ${out}:`, err.message);
				process.exit(1);
			}
		});
	} else {
		console.log(data);
	}
}

function cat(path, out) {
	fs.readFile(path, "utf8", (err, data) => {
		if (err) {
			console.log(`Error reading ${path}:`, err.message);
			process.exit(1);
		}
		outputData(data, out);
	});
}

async function webCat(url, out) {
	try {
		let res = await axios.get(url);
		outputData(res.data, out);
	} catch (err) {
		console.log(`Error fetching ${url}:`, err.message);
		process.exit(1);
	}
}

function isValidHttpUrl(string) {
	let url;

	try {
		url = new URL(string);
	} catch {
		return false;
	}

	return url.protocol === "http:" || url.protocol === "https:";
}

let path;
let output;

if (process.argv[2] === "--out") {
	path = process.argv[process.argv.length - 1];
	output = process.argv[process.argv.length - 2];
} else {
	path = process.argv[2];
}

if (isValidHttpUrl(path)) {
	webCat(path, output);
} else {
	cat(path, output);
}
