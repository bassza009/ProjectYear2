// 1. ฟังก์ชันสลับการโชว์/ซ่อน ช่องพิมพ์ (เหมือนเดิม)
function toggleCommentForm() {
    const form = document.getElementById('commentForm');
    // ตรวจสอบค่าแสดงผลปัจจุบัน
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

// 2. ฟังก์ชันส่งคอมเมนต์
function submitComment() {
    const textInput = document.getElementById('commentText');
    const container = document.getElementById('commentContainer');

    // ดึงข้อมูลจากแอคเคาท์ปัจจุบันที่แสดงอยู่บนหน้าจอ
    // ดึงรูปจากตัว Button Profile หรือ Dropdown
    const currentUserImg = document.querySelector('.photo_profile img').src;
    const currentUserName = document.querySelector('.user_name h1').innerText;

    if (textInput.value.trim() === "") {
        alert("กรุณาพิมพ์ข้อความก่อนครับ");
        return;
    }

    // สร้าง Element คอมเมนต์ใหม่
    const newComment = document.createElement('div');
    newComment.className = 'comment';
    
    // ใส่ Template โดยใช้ข้อมูลจากตัวแปรที่เราดึงมา
    newComment.innerHTML = `
        <div class="avatar">
            <img src="${currentUserImg}" alt="profile">
        </div>
        <div class="comment-content">
            <h4>${currentUserName}</h4>
            <p>${textInput.value}</p>
        </div>
    `;

    // เอาไปแปะไว้บนสุด
    container.prepend(newComment);

    // ล้างข้อมูลและซ่อนฟอร์ม
    textInput.value = "";
    toggleCommentForm();
}