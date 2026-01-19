// สร้างตัวแปรกลางไว้บนสุดเพื่อเก็บข้อมูลรูปภาพ
let imageData = ""; 

const uploadArea = document.getElementById('uploadBtn'); 
const fileInput = document.getElementById('fileInput');  
const previewImg = document.getElementById('preview');   
const placeholder = document.getElementById('placeholder'); 

// คลิกกล่องเพื่อเลือกไฟล์
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// ประมวลผลภาพเมื่อเลือกไฟล์เสร็จ
fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result; // เก็บค่า Base64 ลงในตัวแปรกลาง
            previewImg.src = imageData;
            previewImg.style.display = 'block';
            if(placeholder) {
                placeholder.style.display = 'none'; 
            }
        }
        reader.readAsDataURL(file);
    }
});

// ฟังก์ชันกดโพสต์
function submitJob() {
    // 1. ดึงค่า (ต้องเช็ค ID ให้ตรงกับ HTML)
    const title = document.getElementById('title').value;
    const price = document.getElementById('peice').value; // ใน HTML ของคุณใช้ id="peice"
    const detail = document.getElementById('detail').value;
    const category = document.getElementById('category').value;

    // 2. ตรวจสอบข้อมูลเบื้องต้น
    if (!title || !price || !imageData) {
        alert("กรุณากรอกชื่องาน ราคา และอัปโหลดรูปภาพให้ครบถ้วน");
        return;
    }

    // 3. สร้างก้อนข้อมูล
    const newJob = {
        id: Date.now(),
        title: title,
        price: price,
        detail: detail,
        category: category,
        image: imageData // ใช้ตัวแปรที่เก็บค่ารูปไว้
    };

    // 4. บันทึกลง LocalStorage
    let jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
    jobs.push(newJob);
    localStorage.setItem('allJobs', JSON.stringify(jobs));

    // 5. ไปหน้าหลัก (เช็คชื่อไฟล์หน้าหลักของคุณให้ดี index.html หรือ index1.html)
    alert("ลงประกาศสำเร็จ!");
    window.location.href = 'index1.html'; 
}