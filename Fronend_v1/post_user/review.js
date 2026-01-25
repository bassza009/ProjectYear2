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

    // --- 3. ฟังค์ชั่นกด ตกลง (สร้าง Template) ---
    submitBtn.onclick = () => {
        const text = document.getElementById('reviewText').value;

        if (selectedRating == 0) {
            alert("กรุณาเลือกดาวก่อนครับ");
            return;
        }

        // สร้าง HTML รีวิว
        const reviewHTML = `
            <div class="box_review">
                <div class="general">
                    <img src="/photo/pro_G.jpg" alt="โปรไฟล์">
                </div>
                <div class="comment">
                    <h5>FirstName LastName</h5>
                    <div class="stars">${"⭐".repeat(selectedRating)}</div>
                    <p>${text}</p>
                </div>
            </div>
        `;

        // แปะรีวิวใหม่ไว้ข้างบนสุด
        reviewContainer.insertAdjacentHTML('afterbegin', reviewHTML);
        
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