document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('reviewModal');
    const openBtn = document.getElementById('openReview');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');
    const stars = document.querySelectorAll('.star');
    const reviewContainer = document.getElementById('reviewContainer');
    
    let selectedRating = 0;
    // --- 1. ฟังค์ชั่นเปิด/ปิด Modal ---
    if (openBtn) {
        openBtn.onclick = () => {
            modal.style.display = 'flex'; // แสดง Modal
        };
    }
    cancelBtn.onclick = () => {
        closeAndReset();
    };
    // ปิดเมื่อคลิกข้างนอกกล่อง Modal
    window.onclick = (event) => {
        if (event.target == modal) closeAndReset();
    };
    // --- 2. ฟังค์ชั่นเลือกดาว ---
    stars.forEach(star => {
        star.onclick = function() {
            selectedRating = this.getAttribute('data-value');
            // ลบสีดาวเก่าและใส่สีดาวใหม่
            stars.forEach(s => s.classList.remove('selected'));
            for (let i = 0; i < selectedRating; i++) {
                stars[i].classList.add('selected');
            }
        };
    });

    // --- 3. ฟังค์ชั่นกด ตกลง (สร้าง Template + บันทึกลง LocalStorage) ---
submitBtn.onclick = () => {
    const text = document.getElementById('reviewText').value;

    // --- เพิ่ม 2 บรรทัดนี้เพื่อดึงชื่อและรูปจากหน้าเว็บมาใช้งาน ---
    const currentUserName = document.querySelector('.user_infor h1')?.innerText || "FirstName LastName";
    const currentUserImg = document.querySelector('.user_infor img')?.src || "/photo/mimm.jpg";

    if (selectedRating == 0) {
        alert("กรุณาเลือกดาวก่อนครับ");
        return;
    }

    // --- ส่วนที่ 1: บันทึกลง LocalStorage ---
    const newReview = {
        name: currentUserName, // ใช้ตัวแปรที่ดึงมา
        profilePic: currentUserImg, // ใช้ตัวแปรที่ดึงมา
        rating: selectedRating,
        comment: text,
        timestamp: new Date().getTime()
    };

    let allReviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    allReviews.push(newReview);
    localStorage.setItem('userReviews', JSON.stringify(allReviews));


    // --- ส่วนที่ 2: แสดงผลบนหน้าจอ ---
    const reviewHTML = `
        <div class="box_review">
            <div class="general">
                <img src="${currentUserImg}" alt="โปรไฟล์">
            </div>
            <div class="comment">
                <h5>${currentUserName}</h5>
                <div class="stars" style="color: #FFD700; font-size: 18px; margin: 2px 0;">
                    ${"★".repeat(selectedRating)}
                </div>
                <p>${text}</p>
            </div>
        </div>
    `;

    reviewContainer.insertAdjacentHTML('afterbegin', reviewHTML);
    alert("ส่งรีวิวเรียบร้อย ข้อมูลจะไปแสดงที่โปรไฟล์ด้วยครับ!");
    closeAndReset();
};


    function closeAndReset() {
        modal.style.display = 'none';
        selectedRating = 0;
        document.getElementById('reviewText').value = "";
        stars.forEach(s => s.classList.remove('selected'));
    }
});
document.getElementById('openReview').onclick = () => {
    document.getElementById('reviewModal').style.display = 'flex'; // ต้องเป็น flex เพื่อให้จัดกลาง
};
