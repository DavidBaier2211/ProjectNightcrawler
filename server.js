/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const path = require("path");
const got = require("got");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Load and parse SEO data
const seo = require("./src/seo.json");
if (seo.url === "glitch-default") {
  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
}

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
// fastify.get("/", function (request, reply) {
//   // params is an object we'll pass to our handlebars template
//   let params = { seo: seo };

//   // If someone clicked the option for a random color it'll be passed in the querystring
//   if (request.query.randomize) {
//     // We need to load our color data file, pick one at random, and add it to the params
//     const colors = require("./src/colors.json");
//     const allColors = Object.keys(colors);
//     let currentColor = allColors[(allColors.length * Math.random()) << 0];

//     // Add the color properties to the params object
//     params = {
//       color: colors[currentColor],
//       colorError: null,
//       seo: seo,
//     };
//   }

//   // The Handlebars code will be able to access the parameter values and build them into the page
//   return reply.view("/src/pages/index.hbs", params);
// });

/**
 * Our POST route to handle and react to form submissions
 *
 * Accepts body data indicating the user choice
 */
fastify.post("/", function (request, reply) {
  // Build the params object to pass to the template
  let params = { seo: seo };

  // If the user submitted a color through the form it'll be passed here in the request body
  let color = request.body.color;

  // If it's not empty, let's try to find the color
  if (color) {
    // ADD CODE FROM TODO HERE TO SAVE SUBMITTED FAVORITES

    // Load our color data file
    const colors = require("./src/colors.json");

    // Take our form submission, remove whitespace, and convert to lowercase
    color = color.toLowerCase().replace(/\s/g, "");

    // Now we see if that color is a key in our colors object
    if (colors[color]) {
      // Found one!
      params = {
        color: colors[color],
        colorError: null,
        seo: seo,
      };
    } else {
      // No luck! Return the user value as the error property
      params = {
        colorError: request.body.color,
        seo: seo,
      };
    }
  }

  // The Handlebars template will use the parameter values to update the page with the chosen color
  return reply.view("/src/pages/index.hbs", params);
});


/***
* PingOne Risk - Evaluation request
***/
fastify.post("/getRiskDecision", (req, res) => {
  
  // Get P1 Worker Token
  getPingOneToken(pingOneToken => {
    
    // URL must match the Risk EnvID used to create the payload
    const url="https://api.pingone.com/v1/environments/"+process.env.riskEnvId+"/riskEvaluations"
    
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
          "id": "facile-user", // if P1, send in the UserId
          "name": "facile-user", // This is displayed in Dashboard and Audit
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

function getPingOneToken(cb) {
  const url="https://auth.pingone.com/"+process.env.riskEnvId+"/as/token"
  const basicAuth=btoa(process.env.riskClientId+":"+process.env.riskClientSecret)
  
  // console.log(url)
  
  got.post(url, {
    headers: {
      Authorization: "Basic "+basicAuth
    },
    form: {
      grant_type: "client_credentials"
    }
  })
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
