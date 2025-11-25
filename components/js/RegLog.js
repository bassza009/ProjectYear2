const { json } = require("body-parser")

async function login(){
    const email = document.getElementById("log_email").value
    const password = document.getElementById('log_password').value
    const respone = await fetch ("http://localhost:3000/login",{
        method : "GET",
        headers:{"Content-type":"applicaton/json"}, 
        body: JSON.stringify({email: email ,password : password})
        
    })
    const text = await respone.text()
    alert(text)
}
async function register(){
    const username = document.getElementById("reg_username").value
    const email = document.getElementById("reg_email").value
    const password = document.getElementById('reg_password').value
    const respone = await fetch("http://localhost:3000/register",{
        method:"GET",
        headers:{"Content-type":"applicaton/json"},
        body: JSON.stringify({username : username ,email: email ,password : password})

    })
    const data = await respone.json()
    alert(data.messege)
}