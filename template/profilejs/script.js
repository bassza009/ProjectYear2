/* =========================================
   1. INITIALIZATION & STATS
   ========================================= */

// const { json } = require("body-parser");
const MAX_INITIAL_REVIEWS = 3;
let isShowingAll = false; // เก็บสถานะว่ากำลังดูรีวิวทั้งหมดอยู่หรือไม่
let currentFilter = 'all';


const categoryNames = {
    "0": "งานทั่วไป",
    "1": "เรียนพิเศษ",
    "2": "ภาพถ่าย-วิดีโอ",
    "3": "ออกแบบกราฟิก"
};

// document.addEventListener('DOMContentLoaded', () => {
//     // โหลดข้อมูลพื้นฐาน

//     updateReviewStats();
//     loadReviews('all');
//     displayUserJobs();
// });

// /* =========================================
//    3. JOB MANAGEMENT (ลบ/แก้ไข งานเดิมของคุณ)
//    ========================================= */
// function displayUserJobs() {
//     const jobContainer = document.getElementById('job-container');
//     const jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
//     if (!jobContainer) return;

//     if (jobs.length > 0) {
//         document.getElementById('no-job-msg').style.display = 'none';
//         jobContainer.innerHTML = ''; 
//         jobs.forEach((job) => {
//             const jobCard = document.createElement('div');
//             jobCard.className = 'work-card';
//             jobCard.innerHTML = `
//                 <div class="card-image"><img src="${job.image}"></div>
//                 <div class="card-body">
//                     <h4>${job.title}</h4>
//                     <ul class="work-details">
//                         <li><strong>ประเภทงาน:</strong>${categoryNames[job.category] || job.category || 'ยังไม่เลือก'}</li>
//                         <li><strong>ราคา:</strong> ${job.price} บาท</li>
//                         <li class="job-description-text">
//                             <strong>รายละเอียด:</strong> ${job.detail}
//                         </li>
//                     </ul>
//                     <div class="action-buttons">
//                         <button class="btn-edit" onclick="editJob(${job.id})">✏️ แก้ไข</button>
//                         <button class="btn-delete" onclick="deleteJob(${job.id})">🗑️ ลบ</button>
//                     </div>
//                 </div>`;
//             jobContainer.appendChild(jobCard);
//         });
//     }
// }

// function deleteJob(jobId) {
//     if (confirm("ลบโพสต์นี้หรือไม่?")) {
//         let jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
//         jobs = jobs.filter(job => job.id !== jobId);
//         localStorage.setItem('allJobs', JSON.stringify(jobs));
//         displayUserJobs();
//     }
// }

// function editJob(jobId) {
//     localStorage.setItem('editingJobId', jobId);
//     window.location.href = '../create_post/post_skill.html'; 
// }

/* =========================================
   4. CONTACT MANAGEMENT (แก้ไขข้อมูลติดต่อ)
   ========================================= */

let isEditingContact = false;
async function toggleEdit() {

    const btn = document.getElementById('edit-btn');
    // ดึง <span> ทั้งหมดที่มีคลาส contact-value
    const fields = ['val-phone', 'val-line', 'val-ig'];

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

        const val_phone = document.getElementById("input-val-phone")
        const val_line = document.getElementById("input-val-line")
        const val_ig = document.getElementById("input-val-ig")
        const payload = {
            phone: val_phone ? val_phone.value : "",
            line: val_line ? val_line.value : "",
            ig: val_ig ? val_ig.value : ""
        }
        try {
            const response = await fetch("/student/update", {
                method: "POST",
                headers: { "CONTENT-TYPE": "application/json" },
                body: JSON.stringify(payload)
            })
            const results = await response.json()
            if (results.success) {
                fields.forEach((id) => {
                    const input = document.getElementById(`input-${id}`)
                    if (input) {
                        const newval = input.value
                        const span = document.getElementById(id)
                        span.innerText = newval || "-"
                    }
                })
                btn.innerText = "แก้ไข";
                btn.classList.remove('btn-save');
                isEditingContact = false;
            } else {
                throw new Error("Save failed")
            }
        } catch (err) {
            console.error(err)

        }
    }
}
//เพิ่มฟังก์ชันนี้เข้าไปใน document.addEventListener('DOMContentLoaded', ...) ของคุณด้วย
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
async function edit_profile(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0]
        const img = document.getElementById("profile_")


        const render = new FileReader()
        render.onload = function (e) {
            if (img) img.src = e.target.result //เปลี่ยนรูปเดิมเป็นรูปใหม่
        }
        render.readAsDataURL(file)

        const formData = new FormData()
        formData.append("file_input", file)
        try {
            const response = await fetch("/student/changeAvatar", {
                method: "POST",

                body: formData
            })
            const result = await response.json()
            if (result.success) {
                console.log("upload avatar complete")
            } else {
                //error
            }
        } catch (error) {
            console.error(error)

        }

    }

}

async function edit_profile_gen(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0]
        const img = document.getElementById("profile_")


        const render = new FileReader()
        render.onload = function (e) {
            if (img) img.src = e.target.result //เปลี่ยนรูปเดิมเป็นรูปใหม่
        }
        render.readAsDataURL(file)

        const formData = new FormData()
        formData.append("file_input", file)
        try {
            const response = await fetch("/general/changeAvatar", {
                method: "POST",

                body: formData
            })
            const result = await response.json()
            if (result.success) {
                console.log("upload avatar complete")
            } else {
                console.error("upload failed:", result.message)
            }
        } catch (error) {
            console.error(error)

        }

    }

}





//localStorage.clear();