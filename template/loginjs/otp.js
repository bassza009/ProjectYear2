function sendOTP(){
    const email = document.getElementById("email").value
    if(!email){
        return alert("ใส่ email ก่อน")
    }
    fetch("/send-otp",{
        method : "POST",
        headers : {"CONTENT-TYPE":"application/json"},
        body : JSON.stringify({email:email})

    })
    .then(res=>res.json())
    .then(data=>{
        alert(data.message)
        if(data.success){
            document.getElementById("otpSection").style.display="flex"
        }
    })
}
function varifyOTP(){
    const email = document.getElementById("email").value
    const otp = document.getElementById("otp").value

    fetch("/verifyOTP",{
        method : "POST",
        headers : {"CONTENT-TYPE":"application/json"},
        body : JSON.stringify({email:email,otp:otp})

    })
    .then(res=>res.json())
    .then(data=>{
        const status = document.getElementById("otpStatus")
        if(data.success){
            status.style.color = 'green'
            status.innerText = "ยืนยันเรียบร้อย"
            document.getElementById('email').readOnly = true;
            document.getElementById('otpSection').style.display = 'none';
            
            document.getElementById("isOTPVarified").value = "true"
        }else{
            status.style.color = "red"
            status.innerText = "รหัส OTP ผิด"
        }

    })
}