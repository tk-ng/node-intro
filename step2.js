const fs = require("fs");
const axios = require("axios");

function cat(path) {
	fs.readFile(path, "utf8", (err, data) => {
		if (err) {
			console.log(`Error reading ${path}:`, err.message);
			process.exit(1);
		}
		console.log(data);
	});
}

async function webCat(url) {
	try {
		let res = await axios.get(url);
		console.log(res.data);
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

let path = process.argv[2];

if (isValidHttpUrl(path)) {
	webCat(path);
} else {
	cat(path);
}
