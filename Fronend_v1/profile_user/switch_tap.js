function switchTab(tabName) {
    const postSection = document.getElementById('post_sw');
    const reviewSection = document.getElementById('review_sw');
    const btnPost = document.querySelector('.toggle_post');
    const btnReview = document.querySelector('.toggle_review');

    if (tabName === 'post') {
        // การแสดงผลเนื้อหา
        if (postSection) postSection.style.display = 'flex'; 
        if (reviewSection) reviewSection.style.display = 'none';

        // การจัดการสีปุ่ม
        btnPost.classList.add('active');       // ใส่สีม่วงที่ปุ่มโพสต์
        btnReview.classList.remove('active');  // ถอดสีม่วงออกจากปุ่มรีวิว
    } else {
        // การแสดงผลเนื้อหา
        if (postSection) postSection.style.display = 'none';
        if (reviewSection) reviewSection.style.display = 'flex'; // ใช้ flex ตาม CSS review

        // การจัดการสีปุ่ม
        btnPost.classList.remove('active');    // ถอดสีม่วงออกจากปุ่มโพสต์
        btnReview.classList.add('active');     // ใส่สีม่วงที่ปุ่มรีวิว
    }
}

// เพิ่มบรรทัดนี้เพื่อให้หน้าเว็บเริ่มมาที่ปุ่ม "โพสต์ของคุณ" เป็นสีม่วงทันที
document.addEventListener("DOMContentLoaded", function() {
    switchTab('post');
});
/*------------ดึงโพสต์------------------ */

document.addEventListener("DOMContentLoaded", function() {
    // 1. ดึงข้อมูลจากตู้ allJobs ที่หน้าโพสต์สร้างไว้
    const jobs = JSON.parse(localStorage.getItem('allJobs')) || [];

    if (jobs.length > 0) {
        // 2. เอางานชิ้นล่าสุด (ตัวสุดท้ายของ Array)
        const lastJob = jobs[jobs.length - 1];

        // 3. นำข้อมูลไปเปลี่ยนในหน้าโปรไฟล์
        const titleEl = document.getElementById('pro_title');
        const detailEl = document.getElementById('pro_detail');
        const imgEl = document.getElementById('pro_img');

        if (titleEl) titleEl.innerText = lastJob.title;
        if (detailEl) detailEl.innerText = lastJob.detail;
        if (imgEl && lastJob.image) imgEl.src = lastJob.image;
        
        console.log("ดึงงานล่าสุดมาโชว์ที่โปรไฟล์แล้ว!");
    }
});

//รีวิว
const reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
const profileReviewContainer = document.getElementById('review_sw'); 

if (reviews.length > 0 && profileReviewContainer) {
    profileReviewContainer.innerHTML = ''; 

    reviews.reverse().forEach(item => {
        // ใช้รูปจาก item.profilePic ที่เราเซฟไว้ ถ้าไม่มีให้ใช้รูปสำรอง
        const userImg = item.profilePic || "/photo/mimm.jpg";
        
        const html = `
            <div class="review-item" style="display: flex; gap: 15px; margin-bottom: 20px; padding: 10px; border-bottom: 1px solid #eee;">
                <div class="general">
                    <img src="${userImg}" alt="โปรไฟล์" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
                </div>
                <div class="comment">
                    <h5 style="margin:0; font-size: 16px;">${item.name}</h5>
                    <div class="stars" style="color: #FFD700; font-size: 18px; margin: 2px 0;">
                        ${"★".repeat(item.rating)}
                    </div>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #555;">${item.comment}</p>
                </div>
            </div>
        `;
        profileReviewContainer.insertAdjacentHTML('beforeend', html);
    });
}