/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const path = require("path");
const got = require("got");
const btoa = require("btoa");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

/******************************************
* PingOne Risk - Evaluation request
******************************************/
fastify.all("/getRiskDecision", (req, res) => {  
  
  //console.log(req)
  
  const username = req.body.username
  
  console.log("Getting Risk Eval for: ", username)
  
  // Get P1 Worker Token
  getPingOneToken(pingOneToken => {
    
    // URL must match the Risk EnvID used to create the payload
    const url="https://api.pingone.eu/v1/environments/"+process.env.envId+"/riskEvaluations"
    
    // Construct Risk headers
    const headers = {
        Authorization: "Bearer "+pingOneToken,
        "X-SDK-DATA-PAYLOAD": req.headers.sdkpayload // Signals SDK payload from Client
      }
    
    // Construct Risk Eval body
    const body = {
      event: {
        "targetResource": { 
            "id": "Signals SDK demo",
            "name": "Signals SDK demo"
        },
        "ip": req.headers['x-forwarded-for'].split(",")[0], 
        "flow": { 
            "type": "AUTHENTICATION" 
        },
        "user": {
          "id": username, // if P1, send in the UserId and set `type` to PING_ONE
          "name": username, // This is displayed in Dashboard and Audit
          "type": "EXTERNAL"
        },
        "sharingType": "PRIVATE", 
        "origin": "FACILE_DEMO" 
      },
      "riskPolicySet": {
        "id": "51f11de3-d6cb-0c8b-0b49-0e7e44ad6cf9" // This is the Policy your asking for a decision from
      }
    }
    
    // Make the call to PingOne Risk
    got(url, {
      headers: headers,
      method: "post",
      json: body
    })
      .json()
      .then(data => res.send(data))
      .catch(err => {console.log(err);res.send(err)}) 
  })
})

/**********************************************
* Get Worker token for P1 API call
***********************************************/

function getPingOneToken(cb) {
  const url="https://auth.pingone.eu/"+process.env.envId+"/as/token"
  const basicAuth=btoa(process.env.clientId+":"+process.env.clientSecret)
  const data = { client_id:process.env.clientId,
                client_secret:process.env.clientSecret,
                grant_type: "client_credentials"};
  var options = {
		  json: true, 
		  headers: {
		    'Content-type': 'application/json',
		  },
		  body: JSON.stringify({ description: `spotiforked from ${playlistUser}/${forkedFrom}`, name: `${playlistName}`, public : true})
		};
  // console.log(url)
  
  got.post(url, options)
    .json()
    .then(data => cb(data.access_token))
    .catch(err => console.log("getPingOneToken Error: ", err))
}


// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
