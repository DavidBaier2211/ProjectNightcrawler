function getRiskPolicy() {
    
    console.log("started")
    
    // Pass payload to Server-side to perform the Risk Eval call
    // Server contains the P1 Worker secrets to make the Eval call
    fetch("/getRiskPolicy", {
      method: "get",
    })
    .then(res => res.json())
    .then(data => {
      console.log("Server data: "+data);
      
      const riskPol_high = data[0]._embedded.riskPolicySets[0];
      const riskPol_medium = data[0]._embedded.riskPolicySets[1];
      const predictorIDs = data[0]._embedded.evaluatedPredictors;
      const predictors = data[1];
      
      const contentDiv = document.getElementById('content');
      
      
      
    })
    .catch(err => console.log("getRiskPolicy: ", err))
  // })
}

