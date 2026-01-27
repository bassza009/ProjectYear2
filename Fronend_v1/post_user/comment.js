function toggleCommentForm() {
    const form = document.getElementById('commentForm');
    form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
}

function submitComment() {
    const textInput = document.getElementById('commentText');
    const container = document.getElementById('commentContainer');
    
    // ดึง jobId จาก URL เพื่อให้รู้ว่าคอมเมนต์งานไหน
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get('id');

    if (textInput.value.trim() === "") {
        alert("กรุณาพิมพ์ข้อความก่อนครับ");
        return;
    }

    // ดึงข้อมูลโปรไฟล์ (ชื่อและรูป) จากหน้าเว็บ
    const img = document.querySelector('.photo_profile img').src;
    const name = document.querySelector('.user_name h1').innerText;
    const msg = textInput.value;
    const date = new Date().toLocaleString();

    // --- การบันทึกแบบแยก ID ---
    let allComments = JSON.parse(localStorage.getItem('jobComments')) || {};
    if (!allComments[jobId]) allComments[jobId] = []; // ถ้างานนี้ยังไม่มีคอมเมนต์ให้สร้าง Array ว่าง
    
    const newComment = { img, name, msg, date };
    allComments[jobId].push(newComment);
    localStorage.setItem('jobComments', JSON.stringify(allComments));

    // แสดงคอมเมนต์ทันที
    renderSingleComment(newComment);

    textInput.value = "";
    toggleCommentForm();
}

function loadComments(jobId) {
    const allComments = JSON.parse(localStorage.getItem('jobComments')) || {};
    const comments = allComments[jobId] || []; // ดึงเฉพาะคอมเมนต์ของงานนี้
    const container = document.getElementById('commentContainer');
    container.innerHTML = ""; // ล้างค่าเก่าก่อนโหลด

    // แสดงผลจากใหม่ไปเก่า
    comments.reverse().forEach(comment => {
        renderSingleComment(comment);
    });
}

function renderSingleComment(comment) {
    const container = document.getElementById('commentContainer');
    const div = document.createElement('div');
    div.className = 'comment';
    div.style.borderBottom = "1px solid #eee";
    div.style.padding = "10px 0";
    div.innerHTML = `
        <div style="display: flex; gap: 10px;">
            <div class="avatar"><img src="${comment.img}" style="width:40px; border-radius:50%;"></div>
            <div class="comment-content">
                <h4 style="margin:0;">${comment.name}</h4>
                <p style="margin:5px 0;">${comment.msg}</p>
                <small style="color:gray;">${comment.date}</small>
            </div>
        </div>`;
    container.prepend(div);
}