

/* =========================================
REVIEWS & INTERACTION (Like, Reply, Sort)
   ========================================= */

function loadReviews(filter, showAll = false) {
    const container = document.getElementById('reviewContainer');
    if (!container) return;

    let reviews = [];
    if (typeof window !== 'undefined' && window.serverReviews && window.serverReviews.length > 0) {
        reviews = window.serverReviews.map(r => ({
            id: r.review_id,
            reviewerId: r.reviewer_id,
            role: r.roles,
            name: (r.firstname && r.lastname) ? `${r.firstname} ${r.lastname}` : (r.username || 'User'),
            profilePic: r.profile_image ? `/imageForTest/${r.profile_image}` : `https://ui-avatars.com/api/?name=${r.username || 'User'}`,
            rating: r.rating,
            comment: r.comment,
            reviewImg: r.review_image ? `/imageForTest/${r.review_image}` : null,
            likes: r.likes || 0,
            isLiked: r.is_liked > 0, // is_liked from SQL is 0 or 1
            replies: []
        }));
    } else {
        reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    }

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
        const revId = rev.id;
        // Determine profile link based on role
        let profileLink = '#';
        if (rev.role === 'student') {
            profileLink = `/home/profilestudent/${rev.reviewerId}`;
        } else {
            profileLink = `/home/profilegeneral/${rev.reviewerId}`;
        }

        const html = `
                    <div class="review-card">
                        <a href="${profileLink}" style="text-decoration:none;">
                            <img src="${rev.profilePic}" class="user-pic">
                        </a>
                        <div class="review-content">
                            <h5>${rev.name}</h5>
                            <div class="stars">${renderStars(rev.rating)}</div>
                            <p class="quote">${rev.comment || 'ไม่มีข้อความรีวิว'}</p> 
                            ${rev.reviewImg ? `<div class="review-images"><img src="${rev.reviewImg}"></div>` : ''}

                            <div class="review-actions">
                                <button class="action-btn ${rev.isLiked ? 'active' : ''}" onclick="handleLike('${revId}')">
                                    มีประโยชน์ 👍(<span id="like-count-${revId}">${rev.likes || 0}</span>)
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
async function handleLike(revId) {
    if (!revId) return;

    try {
        const response = await fetch('/student/review/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ review_id: revId })
        });

        const result = await response.json();

        if (result.success) {
            // Update UI directly without full reload
            // Find the button and specific like count span
            const likeCountSpan = document.getElementById(`like-count-${revId}`);
            if (likeCountSpan) {
                likeCountSpan.innerText = result.likes;
                const btn = likeCountSpan.closest('button');
                if (result.liked) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }

            // Also update the global reviews data to reflect change for sorting next time
            if (window.serverReviews) {
                const review = window.serverReviews.find(r => r.review_id == revId);
                if (review) {
                    review.likes = result.likes;
                    review.is_liked = result.liked ? 1 : 0;
                }
            }
        } else {
            alert(result.message || "เกิดข้อผิดพลาด");
        }
    } catch (err) {
        console.error("Like error:", err);
    }
}

// ระบบส่งคำตอบกลับ
function postComment(btn, revId) {
    const input = btn.previousElementSibling;
    if (input.value.trim() === "") return;

    // For now keeping local storage for comments as originally requested only like was db
    let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    const index = reviews.findIndex(r => r.id == revId);

    if (index !== -1) {
        if (!reviews[index].replies) reviews[index].replies = [];
        reviews[index].replies.push(input.value.trim());
        localStorage.setItem('userReviews', JSON.stringify(reviews));
        input.value = "";
        loadReviews(currentFilter);
        // If modal is open, reload modal reviews too
        if (document.getElementById('allReviewsModal') && document.getElementById('allReviewsModal').style.display === 'flex') {
            loadModalReviews(currentModalFilter);
        }
    }
}

function toggleCommentInput(btn) {
    const commentArea = btn.closest('.review-content').querySelector('.comment-area');
    commentArea.style.display = (commentArea.style.display === 'none' || commentArea.style.display === '') ? 'block' : 'none';
}

/* =========================================
   FULL REVIEWS MODAL LOGIC
   ========================================= */
let currentModalFilter = 'all';

function showFullReviews() {
    const modal = document.getElementById('allReviewsModal');
    if (modal) {
        modal.style.display = 'flex';
        loadModalReviews('all');
        updateModalStats(); // Update counts in modal filter buttons
    }
}

function closeAllReviewsModal() {
    const modal = document.getElementById('allReviewsModal');
    if (modal) modal.style.display = 'none';
}

function filterModalReviews(type) {
    currentModalFilter = type;
    const modalTags = document.querySelectorAll('#allReviewsModal .tag');
    modalTags.forEach(t => t.classList.remove('active'));

    // Find the tag inside the modal that was clicked (approximate match by text or onclick attr)
    // Simpler: use event.currentTarget if passed, or just re-render active class based on type
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    loadModalReviews(type);
}

function loadModalReviews(filter) {
    const container = document.getElementById('allReviewsContainer');
    if (!container) return;

    let reviews = [];
    if (typeof window !== 'undefined' && window.serverReviews && window.serverReviews.length > 0) {
        reviews = window.serverReviews.map(r => ({
            id: r.review_id,
            reviewerId: r.reviewer_id,
            role: r.roles,
            name: (r.firstname && r.lastname) ? `${r.firstname} ${r.lastname}` : (r.username || 'User'),
            profilePic: r.profile_image ? `/imageForTest/${r.profile_image}` : `https://ui-avatars.com/api/?name=${r.username || 'User'}`,
            rating: r.rating,
            comment: r.comment,
            reviewImg: r.review_image ? `/imageForTest/${r.review_image}` : null,
            likes: r.likes || 0,
            isLiked: r.is_liked > 0,
            replies: []
        }));
    } else {
        reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    }

    // --- Filter ---
    if (filter === 'hasImage') {
        reviews = reviews.filter(r => r.reviewImg);
    } else if (filter !== 'all') {
        reviews = reviews.filter(r => Math.round(parseFloat(r.rating)) === filter);
    }

    // --- Sort ---
    reviews.sort((a, b) => (b.likes || 0) - (a.likes || 0));

    container.innerHTML = reviews.length ? '' : '<p style="text-align:center;color:#999;padding:20px;">ไม่มีรีวิวในหมวดนี้</p>';

    reviews.forEach((rev) => {
        const revId = rev.id;
        // Determine profile link based on role
        let profileLink = '#';
        if (rev.role === 'student') {
            profileLink = `/home/profilestudent/${rev.reviewerId}`;
        } else {
            profileLink = `/home/profilegeneral/${rev.reviewerId}`;
        }

        const html = `
                    <div class="review-card">
                        <a href="${profileLink}" style="text-decoration:none;">
                            <img src="${rev.profilePic}" class="user-pic">
                        </a>
                        <div class="review-content">
                            <h5>${rev.name}</h5>
                            <div class="stars">${renderStars(rev.rating)}</div>
                            <p class="quote">${rev.comment || 'ไม่มีข้อความรีวิว'}</p> 
                            ${rev.reviewImg ? `<div class="review-images"><img src="${rev.reviewImg}"></div>` : ''}

                            <div class="review-actions">
                                <button class="action-btn ${rev.isLiked ? 'active' : ''}" onclick="handleLike('${revId}')">
                                    มีประโยชน์ 👍(<span id="modal-like-count-${revId}">${rev.likes || 0}</span>)
                                </button>
                            </div>
                        </div>
                    </div>`;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function updateModalStats() {
    let reviews = [];
    if (typeof window !== 'undefined' && window.serverReviews && window.serverReviews.length > 0) {
        // ... (Reuse parsing logic or just pass raw length if okay)
        // Better to reuse the parsing logic to be consistent
        reviews = window.serverReviews.map(r => ({
            rating: r.rating,
            reviewImg: r.review_image
        }));
    }
    // ... logic same as updateReviewStats but target m-f-* IDs
    let counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, hasImage: 0 };
    reviews.forEach(r => {
        let star = Math.round(parseFloat(r.rating));
        if (counts[star] !== undefined) counts[star]++;
        if (r.reviewImg) counts.hasImage++;
    });

    if (document.getElementById('m-f-img')) document.getElementById('m-f-img').innerText = counts.hasImage;
    for (let i = 1; i <= 5; i++) {
        if (document.getElementById(`m-f-${i}`)) document.getElementById(`m-f-${i}`).innerText = counts[i];
    }
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

// ฟังก์ชันอัปเดตสถิติและตัวเลข Summary
function updateReviewStats() {
    let reviews = [];
    if (typeof window !== 'undefined' && window.serverReviews && window.serverReviews.length > 0) {
        reviews = window.serverReviews.map(r => ({
            id: r.review_id,
            name: (r.firstname && r.lastname) ? `${r.firstname} ${r.lastname}` : (r.username || 'User'),
            profilePic: r.profile_image ? `/imageForTest/${r.profile_image}` : `https://ui-avatars.com/api/?name=${r.username || 'User'}`,
            rating: r.rating,
            comment: r.comment,
            reviewImg: r.review_image ? `/imageForTest/${r.review_image}` : null,
            likes: r.likes || 0,
            isLiked: false,
            replies: []
        }));
    } else {
        reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    }
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
/*-----------------------------------------------------------------------------------------------------------------
============================================  ส่วนนี้คือตัวสร้างตัวรีวิว =============================================================
-----------------------------------------------------------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('reviewModal');
    const openBtn = document.getElementById('openReview');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');
    const reviewContainer = document.getElementById('reviewContainer');

    if (typeof loadReviews === 'function') {
        loadReviews('all');
    } else {
        updateReviewUI();
    }

    if (openBtn) openBtn.onclick = () => { modal.style.display = 'flex'; };
    if (cancelBtn) cancelBtn.onclick = () => { closeAndReset(); };
    window.onclick = (e) => { if (e.target == modal) closeAndReset(); };

    window.previewImage = (input) => {
        const container = document.getElementById('image-preview-container');
        container.innerHTML = '';
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                container.innerHTML = `<img src="${e.target.result}" style="width:80px; height:80px; object-fit:cover; border-radius:8px;">`;
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    if (submitBtn) {
        submitBtn.onclick = (e) => {

            e.preventDefault();

            const text = document.getElementById('reviewText').value;
            const ratingInput = document.querySelector('input[name="rating"]:checked');
            const imgFile = document.getElementById('reviewImgInput').files[0];

            if (!ratingInput) {
                const err = document.getElementById("error-msg");
                err.innerText = "⚠ กรุณาเลือกคะแนนดาว";
                err.style.display = "block";
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerText = "กำลังบันทึก...";

            const selectedRating = parseInt(ratingInput.value);
            const currentUserName = document.querySelector('.user_infor h1')?.innerText || "FirstName LastName";
            const currentUserImg = document.querySelector('.user_infor img')?.src || "/photo/mimm.jpg";

            const saveProcess = (base64Img = null) => {
                const newReview = {
                    id: Date.now(),
                    name: currentUserName,
                    profilePic: currentUserImg,
                    rating: selectedRating,
                    comment: text,
                    reviewImg: base64Img,
                    likes: 0,
                    isLiked: false,
                    replies: [],
                    timestamp: new Date().getTime()
                };

                let allReviews = JSON.parse(localStorage.getItem('userReviews')) || [];
                allReviews.push(newReview);
                localStorage.setItem('userReviews', JSON.stringify(allReviews));

                // --- แก้ปัญหาการเด้งซ้ำตรงนี้ ---
                closeAndReset(); // 1. ปิด Modal และล้างค่าฟอร์มก่อน

                // 2. ใช้ replace เพื่อโหลดหน้าใหม่โดยไม่ค้างสถานะ Modal เดิม
                window.location.replace(window.location.href);
            };

            if (imgFile) {
                const reader = new FileReader();
                reader.onload = (ev) => saveProcess(ev.target.result);
                reader.readAsDataURL(imgFile);
            } else {
                saveProcess();
            }
        };
    }

    function renderStars(r) {
        let s = '';
        for (let i = 1; i <= 5; i++) s += (i <= r) ? '★' : '☆';
        return s;
    }

    function closeAndReset() {
        if (modal) modal.style.display = 'none';
        if (document.getElementById('reviewText')) document.getElementById('reviewText').value = "";
        if (document.getElementById('reviewImgInput')) document.getElementById('reviewImgInput').value = "";
        if (document.getElementById('image-preview-container')) document.getElementById('image-preview-container').innerHTML = "";
        const checked = document.querySelector('input[name="rating"]:checked');
        if (checked) checked.checked = false;
        if (document.getElementById("error-msg")) document.getElementById("error-msg").style.display = "none";
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "ส่งรีวิว";
        }
    }
});

// Initialize reviews on page load
document.addEventListener('DOMContentLoaded', () => {
    if (typeof updateReviewStats === 'function') updateReviewStats();
    if (typeof loadReviews === 'function') loadReviews('all');
});

//localStorage.clear();

