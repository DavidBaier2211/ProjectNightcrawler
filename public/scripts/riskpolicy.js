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
      
      const contentDiv = document.getElementById('content');
      
      
      const obj = createRiskTableData(data);
      
      createTable(obj,['name', 'medium', 'high'], ['Predictor Score', 'Medium', 'High']);
      
      
      
      
    })
    .catch(err => console.log("getRiskPolicy: ", err))
  // })
}

function createTable(objectArray, fields, fieldTitles) {
  let body = document.getElementById('content');
  let tbl = document.createElement('table');
  let thead = document.createElement('thead');
  let thr = document.createElement('tr');
  let i=0;
  fieldTitles.forEach((fieldTitle) => {
    let th = document.createElement('th');
    if(i>0){
        th.style.cssText = 'text-align:center;';
    }
    else{
      th.style.cssText = 'width:50%;';
    }
    th.appendChild(document.createTextNode(fieldTitle));
    thr.appendChild(th);
    i++;
  });
  thead.appendChild(thr);
  tbl.appendChild(thead);

  let tbdy = document.createElement('tbody');
  let tr = document.createElement('tr');
  objectArray.forEach((object) => {
    let tr = document.createElement('tr');
    let j = 0;
    fields.forEach((field) => {
      var td = document.createElement('td');
      if(j>0){
        td.style.cssText = 'text-align:center;';
      }
      
      td.appendChild(document.createTextNode(object[field]));
      tr.appendChild(td);
      j++;
    });
    tbdy.appendChild(tr);    
  });
  tbl.appendChild(tbdy);
  body.appendChild(tbl)
  return tbl;
}

function createRiskTableData(data){
    const riskPol_high = data[0]._embedded.riskPolicySets[0].riskPolicies[0];
    const riskPol_medium = data[0]._embedded.riskPolicySets[0].riskPolicies[1];
    const predictorIDs = data[0]._embedded.riskPolicySets[0].evaluatedPredictors;
    const predictors = data[1];
  
    let output = [];
  
    let predTitles = [];
  
    predictorIDs.forEach( (elem) => {
      const json = jsonPath(predictors,'$._embedded.riskPredictors[?(@.id=="'+elem.id+'")]');
      predTitles.push(json[0].name);
    });
    
    let i = 0;
    riskPol_high.condition.aggregatedScores.forEach((elem) => {
      let obj = {};
      obj.name = predTitles[i];
      if(obj.name == 'New Device' || obj.name == 'Anonymous Network Detection' || obj.name == 'Geovelocity Anomaly')
        obj.medium = '--';
      else obj.medium = Math.round(elem.score/2);
      
      obj.high = elem.score;
      
      output.push(obj);
      
      i++;
    });
    
    return output;
}

function createThresholdData(data){
    const riskPol_high = data[0]._embedded.riskPolicySets[0].riskPolicies[0];
    const riskPol_medium = data[0]._embedded.riskPolicySets[0].riskPolicies[1];
    const predictorIDs = data[0]._embedded.riskPolicySets[0].evaluatedPredictors;
    const predictors = data[1];
  
    let output = [];
  
    let predTitles = [];
  
    predictorIDs.forEach( (elem) => {
      const json = jsonPath(predictors,'$._embedded.riskPredictors[?(@.id=="'+elem.id+'")]');
      predTitles.push(json[0].name);
    });
    
    let i = 0;
    riskPol_high.condition.aggregatedScores.forEach((elem) => {
      let obj = {};
      obj.name = predTitles[i];
      if(obj.name == 'New Device' || obj.name == 'Anonymous Network Detection' || obj.name == 'Geovelocity Anomaly')
        obj.medium = '--';
      else obj.medium = Math.round(elem.score/2);
      
      obj.high = elem.score;
      
      output.push(obj);
      
      i++;
    });
    
    return output;
}