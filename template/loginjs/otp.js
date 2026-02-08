function sendOTP(){
    const email = document.getElementById("email").value
    if(!email){
        Swal.fire({
                icon: "error",
                title: "OTP status",
                text: "ใส่ email",
                confirmButtonColor: 'rgb(221, 51, 51)' // สีปุ่มแดง
            })
        //alert(data.message)
        return 
    }
    fetch("/send-otp",{
        method : "POST",
        headers : {"CONTENT-TYPE":"application/json"},
        body : JSON.stringify({email:email})

    })
    .then(res=>res.json())
    .then(data=>{
        
        
        if(data.success){
            Swal.fire({
                icon: "success",
                title: "OTP status",
                text: data.message,
                confirmButtonColor: 'rgb(65, 221, 51)' // สีปุ่มแดง
            })
            document.getElementById("otpSection").style.display="flex"
        }else if(data.error){
            Swal.fire({
                icon: "error",
                title: "OTP status",
                text: data.message,
                confirmButtonColor: 'rgb(221, 51, 51)' // สีปุ่มแดง
            })

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