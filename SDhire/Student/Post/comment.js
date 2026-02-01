// ดึง jobId จาก URL (ใช้ร่วมกันทุกฟังก์ชัน)
const params = new URLSearchParams(window.location.search);
const jobId = params.get('id') || 'default';

/* =========================================
   MODAL CONTROL
   ========================================= */
function openCommentModal() {
    document.getElementById('commentModal').style.display = 'flex';
}

function closeCommentModal() {
    document.getElementById('commentModal').style.display = 'none';
    document.getElementById('commentText').value = "";
}

function openAllComments() {
    renderFullList();
    document.getElementById('allCommentsModal').style.display = 'flex';
}

function closeAllComments() {
    document.getElementById('allCommentsModal').style.display = 'none';
}

/* =========================================
   CORE LOGIC
   ========================================= */
function submitComment() {
    const textInput = document.getElementById('commentText');
    
    if (textInput.value.trim() === "") {
        alert("กรุณาพิมพ์ข้อความก่อนครับ");
        return;
    }

    // ดึงข้อมูลโปรไฟล์จากหน้าเว็บ
    const img = document.querySelector('.photo_profile img').src;
    const name = document.querySelector('.user_name h1').innerText;
    const msg = textInput.value;
    const date = new Date().toLocaleString('th-TH');

    // บันทึกแบบแยก jobId
    let allComments = JSON.parse(localStorage.getItem('jobComments')) || {};
    if (!allComments[jobId]) allComments[jobId] = [];
    
    const newComment = { img, name, msg, date };
    allComments[jobId].push(newComment); // เพิ่มเข้าท้าย Array (ตามปกติของ JS)
    localStorage.setItem('jobComments', JSON.stringify(allComments));

    // อัปเดตการแสดงผลทันที
    loadCommentsPreview(); 
    closeCommentModal();
    textInput.value = "";
}

// 1. โหลดคอมเมนต์โชว์หน้าหลัก (จำกัดแค่ 3 อันล่าสุด เรียงจากใหม่ไปเก่า)
function loadCommentsPreview() {
    const allComments = JSON.parse(localStorage.getItem('jobComments')) || {};
    const comments = allComments[jobId] || [];
    const container = document.getElementById('commentContainer');
    const viewAllBtn = document.querySelector('.btn-view-all'); 
    
    container.innerHTML = "";

    if (comments.length === 0) {
        container.innerHTML = "<p style='color:gray; font-size:14px; text-align:center; padding: 10px;'>ยังไม่มีความคิดเห็น</p>";
        if (viewAllBtn) viewAllBtn.style.display = 'none';
        return;
    }

    // แสดงปุ่ม "อ่านทั้งหมด" พร้อมจำนวนคอมเมนต์
    if (viewAllBtn) {
        viewAllBtn.style.display = 'block';
        viewAllBtn.innerText = `อ่านทั้งหมด (${comments.length})`;
    }

    // เรียงจากใหม่ไปเก่า: กลับด้าน Array แล้วตัดเอาแค่ 3 ตัวแรก
    const preview = [...comments].reverse().slice(0, 3);
    
    preview.forEach(comment => {
        container.appendChild(createCommentElement(comment));
    });
}

// 2. แสดงคอมเมนต์ "ทั้งหมด" ใน Modal (เรียงจากใหม่ไปเก่า)
function renderFullList() {
    const allComments = JSON.parse(localStorage.getItem('jobComments')) || {};
    const comments = allComments[jobId] || [];
    const container = document.getElementById('fullCommentList');
    
    container.innerHTML = "";
    
    if (comments.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:gray; padding:20px;'>ยังไม่มีความคิดเห็น</p>";
        return;
    }

    // แสดงทั้งหมดโดยเรียงจากใหม่ไปเก่า
    const sortedAll = [...comments].reverse();
    sortedAll.forEach(comment => {
        container.appendChild(createCommentElement(comment));
    });
}

// ฟังก์ชันสร้างโครงสร้าง HTML
function createCommentElement(comment) {
    const div = document.createElement('div');
    div.className = 'comment-item';
    div.style.padding = "15px 0";
    div.style.borderBottom = "1px solid #f0f0f0";
    div.innerHTML = `
        <div style="display: flex; gap: 12px; align-items: flex-start;">
            <img src="${comment.img}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border: 1px solid #eee;">
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h4 style="margin:0; font-size:14px; color:#333;">${comment.name}</h4>
                    <small style="color:#999; font-size:11px;">${comment.date}</small>
                </div>
                <p style="margin:4px 0; font-size:14px; color:#555; line-height:1.4;">${comment.msg}</p>
            </div>
        </div>`;
    return div;
}

// เริ่มต้นทำงาน
document.addEventListener('DOMContentLoaded', () => {
    loadCommentsPreview();
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeCommentModal();
            closeAllComments();
        }
    });
});