
fetch('http://127.0.0.1:3003/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: "carl.spiller3+agenttest2@gmail.com",
        interest: "AgentVerification",
        referralCode: ""
    })
})
    .then(res => res.json())
    .then(data => console.log("Response:", data))
    .catch(err => console.error("Error:", err));
