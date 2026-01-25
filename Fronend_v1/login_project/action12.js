function goToStep(stepNumber) {
    if (stepNumber === 2) {
        // ซ่อนหน้า 1 แสดงหน้า 2
        document.getElementById('part1').style.display = 'none';
        document.getElementById('part2').style.display = 'block';
        
        // อัปเดต Progress Bar
        document.getElementById('circle2').classList.add('active');
        document.getElementById('line1').classList.add('active');
    }
}

function goBack() {
    // ถ้าอยู่หน้า 2 ให้กลับไปหน้า 1
    if (document.getElementById('part2').style.display === 'block') {
        document.getElementById('part2').style.display = 'none';
        document.getElementById('part1').style.display = 'block';
        
        // คืนค่า Progress Bar
        document.getElementById('circle2').classList.remove('active');
        document.getElementById('line1').classList.remove('active');
    } else {
        // ถ้าอยู่หน้า 1 อาจจะสั่ง redirect กลับไปหน้า login
        console.log("Back to login");
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