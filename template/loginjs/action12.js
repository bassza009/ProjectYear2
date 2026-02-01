function goToStep(stepNumber) {
    

    email = document.getElementById("email").value
    password = document.getElementById("password").value
    varifypass = document.getElementById("varifypass").value
    phone = document.getElementById("phone").value
    otpvarified = document.getElementById("isOTPVarified").value
    
    if (stepNumber === 2) {
        if(email ===""||password===''||otp ===""){
            alert("ใส่ข้อมูลให้ครบ")
            return
        }
        if(varifypass != password){
            alert("password not match")
            return
        }
        if(otpvarified === "false"){
            alert("OTP not varified")
            return
        }
        document.getElementById('circle2').classList.add('active');
        document.getElementById('line1').classList.add('active');
        //document.getElementById('circle3').classList.add('active');
        //document.getElementById('line2').classList.add('active');
    }
    document.getElementById('part1').style.display = 'none';
    document.getElementById('part2').style.display = 'none';

    document.getElementById('part' + stepNumber).style.display = 'block';
}

function goBack() {
    
    // หาว่าตอนนี้หน้าไหนกำลังแสดงอยู่ (ดูจาก display ที่ไม่ใช่ none)
    if (document.getElementById('part2').style.display === 'block') {
        goToStep(1);
        // ถอดสีม่วงออกจากวงกลม 2 และเส้น 1
        document.getElementById('circle2').classList.remove('active');
        document.getElementById('line1').classList.remove('active');
    }else{
        window.location.href = "/login"
        return
    }
    //else if (document.getElementById('part3').style.display === 'block') {
        //goToStep(2);
        // ถอดสีม่วงออกจากวงกลม 3 และเส้น 2
        //document.getElementById('circle3').classList.remove('active');
        //document.getElementById('line2').classList.remove('active');
    //}
}

function goBack_gen() {
    // หาว่าตอนนี้หน้าไหนกำลังแสดงอยู่ (ดูจาก display ที่ไม่ใช่ none)
    if (document.getElementById('p2').style.display === 'block') {
        goToStep_gen(1);
        // ถอดสีม่วงออกจากวงกลม 2 และเส้น 1
        document.getElementById('c2').classList.remove('active');
        document.getElementById('l1').classList.remove('active');
    }
}

// ฟังก์ชันพรีวิวรูปภาพ
function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('imagePreview');
        output.style.backgroundImage = `url('${reader.result}')`;
        output.innerText = ""; // ล้างข้อความออก
    }
    reader.readAsDataURL(event.target.files[0]);
}