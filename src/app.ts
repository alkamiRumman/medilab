import {Server} from "./server"

new Server().start().then((d) => {
	console.log(
		"\tApp is running at http://localhost:%d in %s mode",
		process.env.PORT,
		process.env.NODE_ENV
	);
	console.log(
		"\tApp is running at https://localhost:%d in %s mode",
		process.env.HTTPS_PORT,
		process.env.NODE_ENV
	);
	console.log("\tPress CTRL-C to stop\n");
}).catch((err) => {
	console.error(err);
});