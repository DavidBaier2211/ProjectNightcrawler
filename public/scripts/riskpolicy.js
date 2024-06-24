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
    .catch(err => console.log("getRiskPolicy: ", err))
  // })
}

