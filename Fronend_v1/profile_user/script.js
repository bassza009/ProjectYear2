/* =========================================
   1. INITIALIZATION & STATS
   ========================================= */
let currentFilter = 'all';
const MAX_INITIAL_REVIEWS = 3;
let isShowingAll = false; // เก็บสถานะว่ากำลังดูรีวิวทั้งหมดอยู่หรือไม่

document.addEventListener('DOMContentLoaded', () => {
    // โหลดข้อมูลพื้นฐาน
    const userNameElem = document.getElementById('user-name');
    if (userNameElem) userNameElem.innerText = "Kanjana Baothong";
    
    updateReviewStats();
    loadReviews('all');
    displayUserJobs();
});

// ฟังก์ชันอัปเดตสถิติและตัวเลข Summary
function updateReviewStats() {
    const reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    const total = reviews.length;
    let counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, hasImage: 0 };
    let sum = 0;

    reviews.forEach(r => {
        let star = Math.round(parseFloat(r.rating));
        if (counts[star] !== undefined) counts[star]++;
        if (r.reviewImg) counts.hasImage++;
        sum += parseFloat(r.rating);
    });

    const avgScore = total > 0 ? (sum / total).toFixed(1) : "0.0";
    
    if (document.getElementById('total-reviews-count')) document.getElementById('total-reviews-count').innerText = `จาก ${total} รีวิว`;
    if (document.getElementById('avg-score')) document.getElementById('avg-score').innerText = avgScore;
    if (document.getElementById('avg-stars')) document.getElementById('avg-stars').innerHTML = renderStars(avgScore);

    // อัปเดตตัวเลขใน Filter Tags และ Progress Bars
    if (document.getElementById('f-img')) document.getElementById('f-img').innerText = counts.hasImage;
    for (let i = 1; i <= 5; i++) {
        if (document.getElementById(`f-${i}`)) document.getElementById(`f-${i}`).innerText = counts[i];
        if (document.getElementById(`count-${i}`)) document.getElementById(`count-${i}`).innerText = counts[i];
        let percent = total > 0 ? (counts[i] / total) * 100 : 0;
        if (document.getElementById(`bar-${i}`)) document.getElementById(`bar-${i}`).style.width = percent + '%';
    }
}


/* =========================================
   2. REVIEWS & INTERACTION (Like, Reply, Sort)
   ========================================= */

function loadReviews(filter, showAll = false) {
    const container = document.getElementById('reviewContainer');
    if (!container) return;

    let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];

    // --- กรองข้อมูล ---
    if (filter === 'hasImage') {
        reviews = reviews.filter(r => r.reviewImg);
    } else if (filter !== 'all') {
        reviews = reviews.filter(r => Math.round(parseFloat(r.rating)) === filter);
    }

    // --- เรียงลำดับ: ยอด Like มากที่สุดขึ้นก่อน (ตามโจทย์) ---
    reviews.sort((a, b) => (b.likes || 0) - (a.likes || 0));

    // ควบคุมจำนวนการแสดงผล
    const viewMoreBtn = document.getElementById('show-all-reviews-btn');
    if (!showAll && reviews.length > MAX_INITIAL_REVIEWS) {
        if (viewMoreBtn) viewMoreBtn.style.display = 'block';
        reviews = reviews.slice(0, MAX_INITIAL_REVIEWS);
    } else {
        if (viewMoreBtn) viewMoreBtn.style.display = 'none';
    }

    container.innerHTML = reviews.length ? '' : '<p style="text-align:center;color:#999;padding:20px;">ไม่มีรีวิวในหมวดนี้</p>';

    reviews.forEach((rev) => {
        // สร้าง ID จำลองหากไม่มี เพื่อใช้อ้างอิงการ Like/Reply
        const revId = rev.id || rev.name + rev.comment; 

        const html = `
                    <div class="review-card">
                        <img src="${rev.profilePic || '/photo/pro_G.jpg'}" class="user-pic">
                        <div class="review-content">
                            <h5>${rev.name}</h5>
                            <div class="stars">${renderStars(rev.rating)}</div>
                            <p class="quote">${rev.comment || 'ไม่มีข้อความรีวิว'}</p> 
                            ${rev.reviewImg ? `<div class="review-images"><img src="${rev.reviewImg}"></div>` : ''}

                            <div class="review-actions">
                                <button class="action-btn ${rev.isLiked ? 'active' : ''}" onclick="handleLike('${revId}')">
                                    มีประโยชน์ 👍(<span class="like-count">${rev.likes || 0}</span>)
                                </button>
                                <button class="action-btn" onclick="toggleCommentInput(this)">
                                    💬 ตอบกลับ
                                </button>
                            </div>

                            <div class="comment-area" style="display:none;">
                                <div class="comment-list">
                                    ${(rev.replies || []).map(reply => `
                                        <div class="reply-item">
                                            <strong>คุณ:</strong> ${reply}
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="reply-input-group">
                                    <input type="text" placeholder="เขียนข้อความตอบกลับ...">
                                    <button class="btn-send-reply" onclick="postComment(this, '${revId}')">ส่ง</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// ระบบกด Like และบันทึกค่า
function handleLike(revId) {
    let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    const index = reviews.findIndex(r => (r.id || r.name + r.comment) === revId);

    if (index !== -1) {
        if (!reviews[index].isLiked) {
            reviews[index].likes = (reviews[index].likes || 0) + 1;
            reviews[index].isLiked = true;
        } else {
            reviews[index].likes = (reviews[index].likes || 0) - 1;
            reviews[index].isLiked = false;
        }
        localStorage.setItem('userReviews', JSON.stringify(reviews));
        loadReviews(currentFilter); // โหลดใหม่เพื่อ Re-sort ตาม Like
    }
}

// ระบบส่งคำตอบกลับ
function postComment(btn, revId) {
    const input = btn.previousElementSibling;
    if (input.value.trim() === "") return;

    let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    const index = reviews.findIndex(r => (r.id || r.name + r.comment) === revId);

    if (index !== -1) {
        if (!reviews[index].replies) reviews[index].replies = [];
        reviews[index].replies.push(input.value.trim());
        localStorage.setItem('userReviews', JSON.stringify(reviews));
        input.value = "";
        loadReviews(currentFilter);
    }
}

function toggleCommentInput(btn) {
    const commentArea = btn.closest('.review-content').querySelector('.comment-area');
    commentArea.style.display = (commentArea.style.display === 'none' || commentArea.style.display === '') ? 'block' : 'none';
}

function renderStars(r) {
    let s = '';
    let rating = Math.round(parseFloat(r));
    for (let i = 1; i <= 5; i++) s += (i <= rating) ? '★' : '☆';
    return s;
}

function filterReviews(type) {
    currentFilter = type;
    document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    loadReviews(type);
}



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
                <div class="card-image"><img src="${job.image || '/photo/pro_G.jpg'}"><span class="badge">Open</span></div>
                <div class="card-body">
                    <h4>${job.title}</h4>
                    <ul class="work-details">
                        <li><strong>ราคา:</strong> ${job.price} บาท</li>
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
    window.location.href = '../create_post/post_skill.html'; 
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

localStorage.clear();