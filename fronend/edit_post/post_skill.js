// 1. สร้างตัวแปรกลางไว้บนสุด
let imageData = ""; 

const uploadArea = document.getElementById('uploadBtn'); 
const fileInput = document.getElementById('fileInput');   
const previewImg = document.getElementById('preview');    
const placeholder = document.getElementById('placeholder'); 

document.addEventListener('DOMContentLoaded', () => {
    const editingId = localStorage.getItem('editingJobId');
    
    if (editingId) {
        // เปลี่ยนหัวข้อหน้า
        const headerTitle = document.querySelector('.container h1');
        if(headerTitle) headerTitle.innerText = "แก้ไขรายละเอียดงาน";

        // ดึงข้อมูลเดิมมาเติมลงในช่อง Input
        const jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
        const jobToEdit = jobs.find(j => j.id == editingId);

        if (jobToEdit) {
            document.getElementById('title').value = jobToEdit.title;
            document.getElementById('peice').value = jobToEdit.price;
            document.getElementById('detail').value = jobToEdit.detail;
            document.getElementById('category').value = jobToEdit.category;
            
            if (jobToEdit.image) {
                imageData = jobToEdit.image; // เก็บรูปเดิมไว้ในตัวแปรกลาง
                previewImg.src = imageData;
                previewImg.style.display = 'block';
                if(placeholder) placeholder.style.display = 'none';
            }
        }
    }
    // ห้ามใส่ window.location.href ตรงนี้ เพราะจะทำให้หน้าเด้งหนีตอนกำลังจะแก้งาน
});

// คลิกกล่องเพื่อเลือกไฟล์
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// ประมวลผลภาพ
fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result; 
            previewImg.src = imageData;
            previewImg.style.display = 'block';
            if(placeholder) placeholder.style.display = 'none'; 
        }
        reader.readAsDataURL(file);
    }
});

// ฟังก์ชันกดโพสต์ (ตัวที่แก้ไขแล้ว)
function submitJob() {
    const title = document.getElementById('title').value;
    const price = document.getElementById('peice').value;
    const detail = document.getElementById('detail').value;
    const category = document.getElementById('category').value;
    
    // ดึง editingId มาเช็ค
    const editingId = localStorage.getItem('editingJobId');
    let jobs = JSON.parse(localStorage.getItem('allJobs')) || [];

    if (editingId) {
        // --- กรณี: แก้ไขงานเดิม ---
        const index = jobs.findIndex(j => j.id == editingId);
        if (index !== -1) {
            jobs[index] = {
                ...jobs[index], // รักษา ID เดิมไว้
                title: title,
                price: price,
                detail: detail,
                category: category,
                image: imageData // ใช้รูปใหม่หรือรูปเดิมที่โหลดมา
            };
        }
        localStorage.removeItem('editingJobId'); // สำคัญมาก: ล้างสถานะแก้ไขทิ้ง
    } else {
        // --- กรณี: เพิ่มงานใหม่ ---
        const newJob = {
            id: Date.now(),
            title: title,
            price: price,
            detail: detail,
            category: category,
            image: imageData
        };
        jobs.push(newJob);
    }

    localStorage.setItem('allJobs', JSON.stringify(jobs));
    alert(editingId ? "อัปเดตข้อมูลสำเร็จ!" : "โพสต์งานสำเร็จ!");
    
    // ย้ายไปหน้าแสดงผล (เช็ค Path ให้ตรงกับโปรเจกต์คุณ)
    window.location.href = '../profile_user/profile_user.html'; 
}

// ฟังก์ชันยกเลิก (เผื่ออยากกดกลับโดยไม่เซฟ)
function cancelEdit() {
    localStorage.removeItem('editingJobId');
    window.location.href = '../profile_user/profile.html';
}