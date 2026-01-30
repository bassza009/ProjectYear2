/* =========================================
   1. INITIALIZATION & STATS
   ========================================= */

let isShowingAll = false; // เก็บสถานะว่ากำลังดูรีวิวทั้งหมดอยู่หรือไม่
let currentFilter = 'all';
const MAX_INITIAL_REVIEWS = 3;

const categoryNames = {
    "0": "งานทั่วไป",
    "1": "เรียนพิเศษ",
    "2": "ภาพถ่าย-วิดีโอ",
    "3": "ออกแบบกราฟิก"
};

document.addEventListener('DOMContentLoaded', () => {
    // โหลดข้อมูลพื้นฐาน
    const userNameElem = document.getElementById('user-name');
    if (userNameElem) userNameElem.innerText = "Kanjana Baothong";
    
    updateReviewStats();
    loadReviews('all');
    displayUserJobs();
});

/* =========================================
   3. JOB MANAGEMENT (ลบ/แก้ไข งานเดิมของคุณ)
   ========================================= */
function displayUserJobs() {
    const jobContainer = document.getElementById('job-container');
    const jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
    if (!jobContainer) return;

    if (jobs.length > 0) {
        document.getElementById('no-job-msg').style.display = 'none';
        jobContainer.innerHTML = ''; 
        jobs.forEach((job) => {
            const jobCard = document.createElement('div');
            jobCard.className = 'work-card';
            jobCard.innerHTML = `
                <div class="card-image"><img src="${job.image}"></div>
                <div class="card-body">
                    <h4>${job.title}</h4>
                    <ul class="work-details">
                        <li><strong>ประเภทงาน:</strong>${categoryNames[job.category] || job.category || 'ยังไม่เลือก'}</li>
                        <li><strong>ราคา:</strong> ${job.price} บาท</li>
                        <li class="job-description-text">
                            <strong>รายละเอียด:</strong> ${job.detail}
                        </li>
                    </ul>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="editJob(${job.id})">✏️ แก้ไข</button>
                        <button class="btn-delete" onclick="deleteJob(${job.id})">🗑️ ลบ</button>
                    </div>
                </div>`;
            jobContainer.appendChild(jobCard);
        });
    }
}

function deleteJob(jobId) {
    if (confirm("ลบโพสต์นี้หรือไม่?")) {
        let jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
        jobs = jobs.filter(job => job.id !== jobId);
        localStorage.setItem('allJobs', JSON.stringify(jobs));
        displayUserJobs();
    }
}

function editJob(jobId) {
    localStorage.setItem('editingJobId', jobId);
    window.location.href = '../edit_post/post_skill.html'; 
}

/* =========================================
   4. CONTACT MANAGEMENT (แก้ไขข้อมูลติดต่อ)
   ========================================= */
let isEditingContact = false;

function toggleEdit() {
    const btn = document.getElementById('edit-btn');
    // ดึง <span> ทั้งหมดที่มีคลาส contact-value
    const fields = ['val-email', 'val-phone', 'val-line', 'val-ig'];

    if (!isEditingContact) {
        // --- เปลี่ยนเป็นโหมดแก้ไข (Input) ---
        fields.forEach(id => {
            const span = document.getElementById(id);
            const currentValue = span.innerText;
            span.innerHTML = `<input type="text" id="input-${id}" value="${currentValue}" style="width:100%;">`;
        });
        btn.innerText = "บันทึก";
        btn.classList.add('btn-save'); // เพิ่ม class เพื่อเปลี่ยนสีปุ่ม (ถ้ามี CSS)
        isEditingContact = true;
    } else {
        // --- บันทึกข้อมูล (Save) ---
        const updatedData = {};
        fields.forEach(id => {
            const input = document.getElementById(`input-${id}`);
            const newValue = input.value;
            document.getElementById(id).innerText = newValue;
            updatedData[id] = newValue;
        });

        // บันทึกลง LocalStorage เพื่อให้ข้อมูลไม่หาย
        localStorage.setItem('userContact', JSON.stringify(updatedData));
        
        btn.innerText = "แก้ไข";
        btn.classList.remove('btn-save');
        isEditingContact = false;
    }
}

// เพิ่มฟังก์ชันนี้เข้าไปใน document.addEventListener('DOMContentLoaded', ...) ของคุณด้วย
function loadContactData() {
    const savedData = JSON.parse(localStorage.getItem('userContact'));
    if (savedData) {
        Object.keys(savedData).forEach(id => {
            const elem = document.getElementById(id);
            if (elem) elem.innerText = savedData[id];
        });
    }
}

/* =========================================
   ADDITIONAL CONTROLS
   ========================================= */

// ฟังก์ชันเปิดแสดงรีวิวทั้งหมด
function showFullReviews() {
    loadReviews(currentFilter, true);
}

// ฟังก์ชันเลื่อนหน้าจอไปที่ส่วนรีวิว (แถมให้เผื่ออยากใช้)
function scrollToReviews() {
    const element = document.getElementById("reviewContainer");
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
}






//localStorage.clear();