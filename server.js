/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

import got from "got";
import btoa from "btoa";

import Fastify from "fastify";

// Require the fastify framework and instantiate it
const fastify = Fastify({ logger: false });

// Formbody lets us parse incoming forms
//import fastifyFormbody from '@fastify/fastify-formbody';
//fastify.register(fastifyFormbody);

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//import fastifyStatic from 'fastify-static';
import fastifyStatic from '@fastify/static'

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public')
    //prefix: '/public/',
});

fastify.get('/', async (request, reply) => {
	return reply.sendFile("index.html")
})

// server.js
console.log(`Your port is ${process.env.PORT}`); // undefined
import dotenv from 'dotenv'
dotenv.config();
console.log(`Your port is ${process.env.PORT}`); // 8626

/******************************************
 * PingOne Risk - Evaluation request
 ******************************************/
fastify.all("/getRiskDecision", (req, res) => {
  //console.log(req)

  const username = req.body.username;

  console.log("Getting Risk Eval for: ", username);

  // Get P1 Worker Token
  getPingOneToken((pingOneToken) => {
    // URL must match the Risk EnvID used to create the payload
    const url =
      "https://api.pingone.eu/v1/environments/" +
      process.env.envId +
      "/riskEvaluations";

    // Construct Risk headers
    const headers = {
      Authorization: "Bearer " + pingOneToken,
    };

    const body = {
      event: {
        targetResource: {
          id: "My Demo",
          name: "My Demo",
        },
        ip: req.headers["x-forwarded-for"].split(",")[0],
        sdk: {
          signals: {
            data: req.headers.sdkpayload,
          },
        },
        flow: {
          type: "AUTHENTICATION",
        },
        /*session: {
          id: "1",
        },*/
        user: {
          id: username,
          name: username,
          type: "EXTERNAL",
          /*groups: [
            {
              name: "dev",
            },
            {
              name: "sre",
            },
          ],*/
        },
        sharingType: "PRIVATE",
        browser: {
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36",
        },
      },
      riskPolicySet: {
        id: "7a87b5da-449f-0bd0-14e3-4fd989a62b0c",
        name: "Default",
      },
    };

    // Make the call to PingOne Risk
    got(url, {
      headers: headers,
      method: "post",
      json: body,
    })
      .json()
      .then((data) => res.send(data))
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  });
});

/******************************************
 * PingOne Risk - Get Risk policy information
 ******************************************/
fastify.all("/getRiskPolicy", (req, res) => {
  //console.log(req)

  console.log("Get risk policy");

  // Get P1 Worker Token
  getPingOneToken((pingOneToken) => {
    // URL must match the Risk EnvID used to create the payload
    console.log(pingOneToken);
    const url_riskPol =
      "https://api.pingone.eu/v1/environments/" +
      process.env.envId +
      "/riskPolicySets";
    
    const url_riskPred =
      "https://api.pingone.eu/v1/environments/" +
      process.env.envId +
      "/riskPredictors";

    // Construct headers
    const headers = {
      Authorization: "Bearer " + pingOneToken,
    };
    
    /* Make the call to PingOne Protect endpoint*/
    got(url_riskPol, {
      headers: headers,
      method: "get"
    })
      .json()
      .then((data) => {
        const content = data
        
        
        //res.send(data);
      
        got(url_riskPred,{
          headers: headers,
          method: "get"
        })
          .json()
          .then((data) => {
            console.log(data);
            
            const out = [content,data]
            
            res.send(out);  
          
          })
          .catch((err) => {
            console.log(err);
            res.send(err);
          });
      
        
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  });
});


/**********************************************
 * Get Worker token for P1 API call
 ***********************************************/

function getPingOneToken(cb) {
  const url = "https://auth.pingone.eu/" + process.env.envId + "/as/token";
  const basicAuth = btoa(process.env.clientId + ":" + process.env.clientSecret);
  
  got.post(url, {
      headers: {
        Authorization: "Basic " + basicAuth,
      },
      form: {
        grant_type: "client_credentials",
      },
    })
    .then((data) => {
      cb(JSON.parse(data.body).access_token);
    })
    .catch((err) => console.log("getPingOneToken Error: ", err));
}

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "127.0.0.1" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
