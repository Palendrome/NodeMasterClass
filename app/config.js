/*
*Create and export config vars
*/

//Container for all environments
var environments = {};

//Staging Object
environments.staging = {
	'httpPort' :3000,
	'httpsPort' :3001,
	'envName' : 'staging'
};

environments.production = {
	'httpPort' :5000,
	'httpsPort' :5001,
	'envName' : 'production'
};

//Determine which one
var currentEnvironment = typeof(process.env.NODE_ENV) ==  'string' ? process.env.NODE_ENV.toLowerCase() : '';
//console.log("Config says the enviro is "+process.env.NODE_ENV);

//Check that the current Environment is one we have made above, if not default to staging.
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment]: environments.staging;


//export module
module.exports = environmentToExport;

