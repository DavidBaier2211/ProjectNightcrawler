function getRiskPolicy() {
    
    
    // Pass payload to Server-side to perform the Risk Eval call
    // Server contains the P1 Worker secrets to make the Eval call
    fetch("/getRiskPolicy", {
      method: "post",
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
    })
    .catch(err => console.log("getRiskDecision: ", err))
  // })
}

/* Below functions used to parse and display the Evaluation response */
function showRiskResult() {
  document.getElementById("cardPayload").classList.remove("d-none")
  
  document.getElementById("navResult").classList.add("active")
  document.getElementById("riskResult").classList.remove("d-none")
  document.getElementById("navHigh").classList.remove("d-none")
  document.getElementById("navMed").classList.remove("d-none")
  document.getElementById("navLow").classList.remove("d-none")
  
  document.getElementById("navDetails").classList.remove("active")
  document.getElementById("riskDetails").classList.add("d-none")
  
  document.getElementById("navHigh").classList.remove("active")
  document.getElementById("predictorsHigh").classList.add("d-none")
  
  document.getElementById("navMed").classList.remove("active")
  document.getElementById("predictorsMed").classList.add("d-none")
  
  document.getElementById("navLow").classList.remove("active")
  document.getElementById("predictorsLow").classList.add("d-none")
}

function showRiskDetails() {
  document.getElementById("navDetails").classList.add("active")
  document.getElementById("riskDetails").classList.remove("d-none")
  
  document.getElementById("navResult").classList.remove("active")
  document.getElementById("riskResult").classList.add("d-none")
  
  document.getElementById("navHigh").classList.remove("active")
  document.getElementById("predictorsHigh").classList.add("d-none")
  
  document.getElementById("navMed").classList.remove("active")
  document.getElementById("predictorsMed").classList.add("d-none")
  
  document.getElementById("navLow").classList.remove("active")
  document.getElementById("predictorsLow").classList.add("d-none")
}

function showHighResults() {
  document.getElementById("navHigh").classList.add("active")
  document.getElementById("predictorsHigh").classList.remove("d-none")
  
  document.getElementById("navResult").classList.remove("active")
  document.getElementById("riskResult").classList.add("d-none")
  
  document.getElementById("navDetails").classList.remove("active")
  document.getElementById("riskDetails").classList.add("d-none")
  
  document.getElementById("navMed").classList.remove("active")
  document.getElementById("predictorsMed").classList.add("d-none")
  
  document.getElementById("navLow").classList.remove("active")
  document.getElementById("predictorsLow").classList.add("d-none")
}

function showMedResults() {
  document.getElementById("navMed").classList.add("active")
  document.getElementById("predictorsMed").classList.remove("d-none")
  
  document.getElementById("navResult").classList.remove("active")
  document.getElementById("riskResult").classList.add("d-none")
  
  document.getElementById("navDetails").classList.remove("active")
  document.getElementById("riskDetails").classList.add("d-none")
  
  document.getElementById("navHigh").classList.remove("active")
  document.getElementById("predictorsHigh").classList.add("d-none")
  
  document.getElementById("navLow").classList.remove("active")
  document.getElementById("predictorsLow").classList.add("d-none")
}

function showLowResults() {
  document.getElementById("navLow").classList.add("active")
  document.getElementById("predictorsLow").classList.remove("d-none")
  
  document.getElementById("navResult").classList.remove("active")
  document.getElementById("riskResult").classList.add("d-none")
  
  document.getElementById("navDetails").classList.remove("active")
  document.getElementById("riskDetails").classList.add("d-none")
  
  document.getElementById("navHigh").classList.remove("active")
  document.getElementById("predictorsHigh").classList.add("d-none")
  
  document.getElementById("navMed").classList.remove("active")
  document.getElementById("predictorsMed").classList.add("d-none")
}

