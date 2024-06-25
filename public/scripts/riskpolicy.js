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
      
      
      const obj = createTableObject(data);
      
      createTable([
        {name: 'Banana', price: '3.04'},
        {name: 'Orange', price: '2.56'},
        {name: 'Apple', price: '1.45'}
      ],
      ['name', 'medium', 'high'], ['Predictor Score', 'Medium', 'High']);
      
      
    })
    .catch(err => console.log("getRiskPolicy: ", err))
  // })
}

function createTable(objectArray, fields, fieldTitles) {
  let body = document.getElementById('content');
  let tbl = document.createElement('table');
  let thead = document.createElement('thead');
  let thr = document.createElement('tr');
  fieldTitles.forEach((fieldTitle) => {
    let th = document.createElement('th');
    th.appendChild(document.createTextNode(fieldTitle));
    thr.appendChild(th);
  });
  thead.appendChild(thr);
  tbl.appendChild(thead);

  let tbdy = document.createElement('tbody');
  let tr = document.createElement('tr');
  objectArray.forEach((object) => {
    let tr = document.createElement('tr');
    fields.forEach((field) => {
      var td = document.createElement('td');
      td.appendChild(document.createTextNode(object[field]));
      tr.appendChild(td);
    });
    tbdy.appendChild(tr);    
  });
  tbl.appendChild(tbdy);
  body.appendChild(tbl)
  return tbl;
}

function createTableObject(data){
    const riskPol_high = data[0]._embedded.riskPolicySets[0].riskPolicies[0];
    const riskPol_medium = data[0]._embedded.riskPolicySets[0].riskPolicies[1];
    const predictorIDs = data[0]._embedded.riskPolicySets[0].evaluatedPredictors;
    const predictors = data[1];
  
    let output = [];
  
    let predTitles = [];
  
    predictorIDs.forEach( (elem) => {
      const json = jsonPath(predictors,'$._embedded.riskPredictors[?(@.id=="'+elem.id+'")]');
      const obj = JSON.parse(json)
      predTitles.push(obj.name);
    });
    
    let i = 0;
    riskPol_high.condition.aggregatedScores.forEach((elem) => {
      let obj = {};
      obj.name = predTitles[i];
      obj.medium = elem.score/2;
      obj.high = elem.score;
      
      output.push(obj);
      
      i++;
    });
    
    console.log(output);
}