
/* =========================================
   CORE FUNCTIONS
   ========================================= */

function renderStars(r) {
    let s = '';
    let rating = Math.round(parseFloat(r));
    for (let i = 1; i <= 5; i++) s += (i <= rating) ? '★' : '☆';
    return s;
}

// สร้าง HTML สำหรับรีวิวแต่ละใบ (ใช้ร่วมกันทั้งหน้าหลักและ Modal)
function createReviewCardHTML(rev, index) {
    const revId = rev.id || (rev.name + rev.comment).trim();
    // เพิ่มเหรียญรางวัลสำหรับ Top 3 เมื่ออยู่ใน Modal
    let badge = "";
    const isModal = document.getElementById('fullReviewModal').style.display === 'flex';
    if (isModal && currentFilter === 'all') {
        if (index === 0 && (rev.likes > 0)) badge = "🥇 ";
        else if (index === 1 && (rev.likes > 0)) badge = "🥈 ";
        else if (index === 2 && (rev.likes > 0)) badge = "🥉 ";
    }

    return `
        <div class="review-card">
            <img src="${rev.profilePic}" class="user-pic">
            <div class="review-content">
                <h5>${badge}${rev.name}</h5>
                <div class="stars">${renderStars(rev.rating)}</div>
                <p class="quote">${rev.comment || 'ไม่มีข้อความรีวิว'}</p> 
                ${rev.reviewImg ? `<div class="review-images"><img src="${rev.reviewImg}"></div>` : ''}
                <div class="review-actions">
                    <button class="action-btn ${rev.isLiked ? 'active' : ''}" onclick="handleLike('${revId}')">
                        มีประโยชน์ 👍(<span class="like-count">${rev.likes || 0}</span>)
                    </button>
                </div>
            </div>
        </div>`;
}

/* =========================================
   REVIEWS & INTERACTION
   ========================================= */

function loadReviews(filter, showAll = false) {
    const container = document.getElementById('reviewContainer');
    if (!container) return;

    let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];

    // กรองข้อมูล
    if (filter === 'hasImage') {
        reviews = reviews.filter(r => r.reviewImg);
    } else if (filter !== 'all') {
        reviews = reviews.filter(r => Math.round(parseFloat(r.rating)) === parseInt(filter));
    }

    // เรียงตาม Like (มากไปน้อย)
    reviews.sort((a, b) => (b.likes || 0) - (a.likes || 0));

    // จัดการปุ่ม "ดูรีวิวทั้งหมด"
    const viewMoreBtn = document.getElementById('show-all-reviews-btn');
    if (!showAll && reviews.length > MAX_INITIAL_REVIEWS) {
        if (viewMoreBtn) viewMoreBtn.style.display = 'block';
        reviews = reviews.slice(0, MAX_INITIAL_REVIEWS);
    } else if (viewMoreBtn) {
        viewMoreBtn.style.display = 'none';
    }

    container.innerHTML = reviews.length ? '' : '<p style="text-align:center;color:#999;padding:20px;">ไม่มีรีวิวในหมวดนี้</p>';
    reviews.forEach((rev, idx) => {
        container.insertAdjacentHTML('beforeend', createReviewCardHTML(rev, idx));
    });

    updateReviewStats(); 
}

function handleLike(revId) {
    let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    const index = reviews.findIndex(r => String(r.id || (r.name + r.comment).trim()) === String(revId));

    if (index !== -1) {
        if (!reviews[index].isLiked) {
            reviews[index].likes = (reviews[index].likes || 0) + 1;
            reviews[index].isLiked = true;
        } else {
            reviews[index].likes = Math.max(0, (reviews[index].likes || 0) - 1);
            reviews[index].isLiked = false;
        }
        localStorage.setItem('userReviews', JSON.stringify(reviews));

        // อัปเดตทั้งหน้าหลักและ Modal
        loadReviews(currentFilter);
        if (document.getElementById('fullReviewModal').style.display === 'flex') {
            showReviews(); 
        }
    }
}

function filterReviews(type) {
    currentFilter = type;
    // เปลี่ยนสถานะปุ่ม Tag (Active) ทุกที่
    document.querySelectorAll('.tag').forEach(t => {
        t.classList.remove('active');
        const onclickAttr = t.getAttribute('onclick');
        if (onclickAttr && (onclickAttr.includes(`'${type}'`) || onclickAttr.includes(`${type}`))) {
            t.classList.add('active');
        }
    });

    loadReviews(type);
    if (document.getElementById('fullReviewModal').style.display === 'flex') {
        showReviews(); 
    }
}


/* =========================================
   SYSTEM: MODAL SHOW ALL
   ========================================= */

function showReviews() {
    const modal = document.getElementById('fullReviewModal');
    const modalList = document.getElementById('modalReviewList');
    
    if (modal && modalList) {
        let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];

        // กรองและเรียงตาม Like
        if (currentFilter === 'hasImage') {
            reviews = reviews.filter(r => r.reviewImg);
        } else if (currentFilter !== 'all') {
            reviews = reviews.filter(r => Math.round(parseFloat(r.rating)) === parseInt(currentFilter));
        }
        reviews.sort((a, b) => (b.likes || 0) - (a.likes || 0));

        modalList.innerHTML = reviews.length ? '' : '<p style="text-align:center;color:#999;padding:20px;">ไม่มีรีวิวในหมวดนี้</p>';
        reviews.forEach((rev, idx) => {
            modalList.insertAdjacentHTML('beforeend', createReviewCardHTML(rev, idx));
        });

        modal.style.display = 'flex'; 
        document.body.style.overflow = 'hidden'; 
        updateReviewStats(); // อัปเดตตัวเลขใน Modal ทันทีที่เปิด
    }
}

function closeReviews() {
    const modal = document.getElementById('fullReviewModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

/* =========================================
   STATS & INITIALIZATION
   ========================================= */

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

    // อัปเดตตัวเลขหน้าหลัก
    if (document.getElementById('f-img')) document.getElementById('f-img').innerText = counts.hasImage;
    for (let i = 1; i <= 5; i++) {
        if (document.getElementById(`f-${i}`)) document.getElementById(`f-${i}`).innerText = counts[i];
        if (document.getElementById(`count-${i}`)) document.getElementById(`count-${i}`).innerText = counts[i];
        if (document.getElementById(`mf-${i}`)) document.getElementById(`mf-${i}`).innerText = counts[i]; // อัปเดตใน Modal
        
        let percent = total > 0 ? (counts[i] / total) * 100 : 0;
        if (document.getElementById(`bar-${i}`)) document.getElementById(`bar-${i}`).style.width = percent + '%';
    }
    if (document.getElementById('mf-img')) document.getElementById('mf-img').innerText = counts.hasImage;

    const avgScore = total > 0 ? (sum / total).toFixed(1) : "0.0";
    if (document.getElementById('avg-score')) document.getElementById('avg-score').innerText = avgScore;
    if (document.getElementById('avg-stars')) document.getElementById('avg-stars').innerHTML = renderStars(avgScore);
    if (document.getElementById('total-reviews-count')) document.getElementById('total-reviews-count').innerText = `จาก ${total} รีวิว`;
}

// ผูกเหตุการณ์เมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    loadReviews('all');
    
    // คลิกพื้นหลังเพื่อปิด
    window.addEventListener('click', (e) => {
        if (e.target.id === 'fullReviewModal') closeReviews();
    });
});

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

//localStorage.clear();

