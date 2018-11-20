/*Primary API File*/

//depends
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

//Respond to all http requests with a string

//Start the server on port 3000
httpServer = http.createServer(function(req,res){
	unifiedServer(req,res);
});

httpServer.listen(config.httpPort,function(){
console.log("server is listening on Port "+config.httpPort+" in "+config.envName+ " mode");
});	

//Instantiate https server
var httpsServerOptions = {
	'key' : fs.readFileSync('./https/key.pem'),
	'cert' : fs.readFileSync('./https/cert.pem')	
}

httpsServer = https.createServer(httpsServerOptions,function(req,res){
	unifiedServer(req,res);
});


//Start the https server
httpsServer.listen(config.httpsPort,function(){
console.log("server is listening on Port "+config.httpsPort+" in "+config.envName+ " mode");
});	

//All Server logic for both http and s
var unifiedServer = function(req,res)
{
	//Set the URL and parse
	parsedUrl = url.parse(req.url,true);
	
	//get the path
	path = parsedUrl.pathname;	
	trimmedPath = path.replace(/^\/+|\/+$/g,'');
	
	//Get the query string as an Object problem code is queryStringObject = parsedUrl.query;
	queryStringObject = parsedUrl.query;
	
	//Get the http method
	var method = req.method.toLowerCase();
	
	//Get the Headers as an Object
	headers = req.headers;	
	
	//Get the payload if there is one
	var decoder = new StringDecoder('utf-8');
	var buffer = '';	
	req.on('data',function(data){
		buffer += decoder.write(data);
	});	
	req.on('end',function(){
		buffer +=decoder.end();	
		//Choose handler. If none that use notfound
		chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath]: handlers.notFound;
		//Construct dataObject to send to handler
		var data ={
			'trimmedPath' :trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : buffer			
		};
		
		//Route request to handler
		chosenHandler(data,function(statusCode,payload)
		{
			//USe the status code called by handler to 200;
			statusCode = typeof(statusCode) == 'number' ? statusCode :200;
			
			//use the payload returned or an empty object
			payload = typeof(payload) == 'object' ? payload :{}; 
			
			//Convert to a string
			payloadString = JSON.stringify(payload);
			
			//Return response			
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);			
			res.end(payloadString);
			
			console.log('Returning this response ',statusCode,payloadString);	
		});			
	});
}

//define handlers
var handlers = {};

handlers.ping = function(data,callback){
	callback(400);
}

handlers.hello = function(data,callback){
	
	callback(302,{'Message': "Hello Pirple people, this is the homework from Paul"});
}

handlers.notFound = function(data,callback){
	callback(404);	
};
	
//define a request router
router ={
	'ping' : handlers.ping,
	'hello' : handlers.hello
};
