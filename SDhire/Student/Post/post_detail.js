/* =========================================
   1. CONFIG & GLOBAL VARIABLES
   ========================================= */
const categoryNames = {
    "0": "งานทั่วไป", "1": "เรียนพิเศษ", "2": "ภาพถ่าย-วิดีโอ", "3": "ออกแบบกราฟิก"
};
let currentFilter = 'all';
const MAX_INITIAL_REVIEWS = 3;

/* =========================================
   2. ฟังก์ชันแสดงข้อมูลงาน (Display Job)
   ========================================= */
function displaySingleJob() {
    const jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
    const currentId = localStorage.getItem('viewingJobId');
    const job = jobs.find(j => j.id == currentId) || jobs[jobs.length - 1];

    if (job) {
        if(document.getElementById('jobPrice')) {
            const actualPrice = job.price || job.peice || '0';
            document.getElementById('jobPrice').innerText = `฿${actualPrice}`;
        }
        if(document.getElementById('jobTitle')) document.getElementById('jobTitle').innerText = job.title;
        if(document.getElementById('jobDetail')) document.getElementById('jobDetail').innerText = job.detail;
        if(document.getElementById('jobImage')) document.getElementById('jobImage').src = job.image;
        if(document.getElementById('jobCategory')) {
            document.getElementById('jobCategory').innerText = "ประเภทงาน : " + (categoryNames[job.category] || "ทั่วไป");
        }
    }
}

/* =========================================
   3. ระบบรีวิว (Review System)
   ========================================= */

// ฟังก์ชันโหลดรีวิวมาแสดง
function loadReviews(filter, showAll = false) {
    currentFilter = filter;
    const container = document.getElementById('reviewContainer');
    if (!container) return;

    let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];

    // กรองข้อมูล
    if (filter === 'hasImage') {
        reviews = reviews.filter(r => r.reviewImg);
    } else if (filter !== 'all') {
        reviews = reviews.filter(r => Math.round(parseFloat(r.rating)) === parseInt(filter));
    }

    // เรียงตาม Like มากไปน้อย
    reviews.sort((a, b) => (b.likes || 0) - (a.likes || 0));

    // จัดการปุ่ม "ดูทั้งหมด"
    const viewMoreBtn = document.getElementById('show-all-reviews-btn');
    if (!showAll && reviews.length > MAX_INITIAL_REVIEWS) {
        if (viewMoreBtn) viewMoreBtn.style.display = 'block';
        reviews = reviews.slice(0, MAX_INITIAL_REVIEWS);
    } else {
        if (viewMoreBtn) viewMoreBtn.style.display = 'none';
    }

    // วาด HTML (นำโค้ด RenderStars มาใช้ในนี้ด้วย)
    container.innerHTML = reviews.length ? '' : '<p>ไม่มีรีวิวในหมวดนี้</p>';
    reviews.forEach(rev => {
        // ... (ใส่โค้ด HTML Template ของรีวิวตรงนี้เหมือนที่คุณมีก่อนหน้า) ...
        const html = `<div class="review-card">...</div>`; // ยึดตามโครงเดิมของคุณ
        container.insertAdjacentHTML('beforeend', html);
    });
}

// *** ฟังก์ชันที่หายไป: กดเพื่อดูรีวิวทั้งหมด ***
function showFullReviews() {
    loadReviews(currentFilter, true); // ส่งค่า true เพื่อบอกว่าไม่ต้อง slice ข้อมูล
}

// ฟังก์ชันกรอง (เรียกใช้จากปุ่ม Tag)
function filterReviews(type) {
    currentFilter = type;
    // ลบ class active จากปุ่มอื่น
    document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
    // เพิ่ม class active ให้ปุ่มที่กด (ใช้ event)
    if (window.event) window.event.currentTarget.classList.add('active');
    
    loadReviews(type);
}

function renderStars(rating) {
    let s = '';
    for (let i = 1; i <= 5; i++) s += (i <= Math.round(rating)) ? '★' : '☆';
    return s;
}

/* =========================================
   4. INITIALIZATION (รวมจุดรันไว้ที่เดียว)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // 1. แสดงข้อมูลงาน
    displaySingleJob();

    // 2. จัดการ Modal รีวิว
    const modal = document.getElementById('reviewModal');
    const openBtn = document.getElementById('openReview');
    const cancelBtn = document.getElementById('cancelBtn');

    if (openBtn) openBtn.onclick = () => modal.style.display = 'flex';
    if (cancelBtn) cancelBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    // 3. โหลดข้อมูลรีวิวและสถิติครั้งแรก
    loadReviews('all');
    if (typeof updateReviewStats === 'function') {
        updateReviewStats(); 
    }
});