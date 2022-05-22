// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	mount: {
		"public": "/public",
		"src": "/src",
		"css": "/css"
	},
	plugins: [
		/* ... */
	],
	packageOptions: {
		/* ... */
	},
	devOptions: {
		/* ... */
	},
	buildOptions: {},
};
