/* =========================================
REVIEW SYSTEM - Using Database API
   ========================================= */

let currentFilter = 'all';
let allReviews = [];
let reviewStats = {};

// Load reviews from API
async function loadReviews(filter = 'all') {
    // Check if modal is open
    const modal = document.getElementById('fullReviewModal');
    const isModalOpen = modal && modal.style.display === 'flex';

    const containerId = isModalOpen ? 'modalReviewList' : 'reviewContainer';
    const container = document.getElementById(containerId);
    if (!container) return;

    // Get student ID: First try hidden input (most accurate), then fallback to URL
    const studentInput = document.querySelector('input[name="student_id"]');
    let studentId = studentInput ? studentInput.value : null;

    if (!studentId) {
        const pathParts = window.location.pathname.split('/');
        studentId = pathParts.filter(part => part !== '').pop();
    }

    try {
        const response = await fetch(`/api/reviews/${studentId}`);
        const data = await response.json();

        if (data.success) {
            allReviews = data.reviews;
            reviewStats = data.stats;

            // Update statistics display
            updateReviewStats();

            // Filter reviews
            let reviews = filterReviewsByType(allReviews, filter);

            // Render logic
            if (isModalOpen) {
                // In modal: Show all filtered reviews
                renderReviews(reviews, container);
            } else {
                // In main page: Limit to 3
                const showAllBtn = document.getElementById('show-all-reviews-btn');

                if (reviews.length > 3) {
                    renderReviews(reviews.slice(0, 3), container);
                    if (showAllBtn) showAllBtn.style.display = 'block';
                } else {
                    renderReviews(reviews, container);
                    if (showAllBtn) showAllBtn.style.display = 'none';
                }
            }
        }
    } catch (error) {
        container.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">ไม่สามารถโหลดรีวิวได้</p>';
    }
}

// Filter reviews by rating
function filterReviewsByType(reviews, filter) {
    if (filter === 'all') {
        return reviews;
    } else if (filter === 'hasImage') {
        return reviews.filter(r => r.reviewImg);
    } else if (typeof filter === 'number') {
        return reviews.filter(r => Math.round(parseFloat(r.rating)) === filter);
    }
    return reviews;
}

// Render reviews to DOM
function renderReviews(reviews, container) {
    if (reviews.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">ไม่มีรีวิวในหมวดนี้</p>';
        return;
    }

    container.innerHTML = '';

    reviews.forEach((rev) => {
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
                    ${rev.reviewImg ? `<div class="review-images"><img src="${rev.reviewImg}" style="max-width: 200px; border-radius: 8px; margin-top: 10px;"></div>` : ''}
                    
                    <div class="review-actions" style="margin-top: 10px;">
                        <button class="action-btn ${rev.isLiked ? 'active' : ''}" onclick="handleLike('${rev.id}')" style="background: none; border: 1px solid #ddd; padding: 5px 10px; border-radius: 20px; cursor: pointer; transition: all 0.3s; color: #666;">
                            มีประโยชน์ 👍(<span id="like-count-${rev.id}">${rev.likes || 0}</span>)
                        </button>
                    </div>

                    <p style="font-size: 12px; color: #999; margin-top: 8px;">
                        ${new Date(rev.timestamp).toLocaleDateString('th-TH')}
                    </p>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// Handle Like Button Click
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
            // Update UI directly
            const likeCountSpan = document.getElementById(`like-count-${revId}`);
            if (likeCountSpan) {
                likeCountSpan.innerText = result.likes;
                const btn = likeCountSpan.closest('button');
                if (result.liked) {
                    btn.classList.add('active');
                    btn.style.color = '#007bff';
                    btn.style.borderColor = '#007bff';
                    btn.style.background = '#e6f2ff';
                } else {
                    btn.classList.remove('active');
                    btn.style.color = '#666';
                    btn.style.borderColor = '#ddd';
                    btn.style.background = 'none';
                }
            }
        } else {
            // If failed (e.g. not logged in), show message
            if (result.message) alert(result.message);
        }
    } catch (err) {
        console.error("Like error:", err);
    }
}

// Render stars
function renderStars(rating) {
    let stars = '';
    const r = Math.round(parseFloat(rating));
    for (let i = 1; i <= 5; i++) {
        stars += (i <= r) ? '★' : '☆';
    }
    return stars;
}

// Filter reviews by star rating
function filterReviews(type) {
    currentFilter = type;
    document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    loadReviews(type);
}

// Show all reviews (Open Modal)
function showReviews() {
    const modal = document.getElementById('fullReviewModal');
    if (modal) {
        modal.style.display = 'flex';
        // Reset filter to all when opening? Or keep current? Let's keep 'all' or current.
        // Usually good to show 'all' initially in modal or sync with page.
        // Let's reload to be sure we render into the modal.
        loadReviews(currentFilter);
    }
}

// Close reviews modal
function closeReviews() {
    const modal = document.getElementById('fullReviewModal');
    if (modal) {
        modal.style.display = 'none';
        // Optional: reload main page reviews if needed, or just leave them.
        // loadReviews(currentFilter); // Update main page if something changed?
    }
}

// Update review statistics
function updateReviewStats() {
    const { total, avgScore, counts } = reviewStats;

    // Calculate image review count client-side
    const imgCount = allReviews.filter(r => r.reviewImg).length;
    if (document.getElementById('f-img')) document.getElementById('f-img').innerText = imgCount;
    if (document.getElementById('mf-img')) document.getElementById('mf-img').innerText = imgCount;

    // Update summary
    if (document.getElementById('total-reviews-count')) {
        document.getElementById('total-reviews-count').innerText = `จาก ${total} รีวิว`;
    }
    if (document.getElementById('avg-score')) {
        document.getElementById('avg-score').innerText = avgScore;
    }
    if (document.getElementById('avg-stars')) {
        document.getElementById('avg-stars').innerHTML = renderStars(avgScore);
    }

    // Update filter tags (Main Page & Modal)
    for (let i = 1; i <= 5; i++) {
        // Main page tags
        if (document.getElementById(`f-${i}`)) {
            document.getElementById(`f-${i}`).innerText = counts[i] || 0;
        }
        // Modal tags
        if (document.getElementById(`mf-${i}`)) {
            document.getElementById(`mf-${i}`).innerText = counts[i] || 0;
        }

        if (document.getElementById(`count-${i}`)) {
            document.getElementById(`count-${i}`).innerText = counts[i] || 0;
        }

        // Update progress bars
        const percent = total > 0 ? ((counts[i] || 0) / total) * 100 : 0;
        if (document.getElementById(`bar-${i}`)) {
            document.getElementById(`bar-${i}`).style.width = percent + '%';
        }
    }
}

/* =========================================
   REVIEW SUBMISSION
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('reviewModal');
    const openBtn = document.getElementById('openReview');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Load reviews on page load
    loadReviews('all');

    // Open review modal
    if (openBtn) {
        openBtn.onclick = () => {
            if (modal) {
                modal.style.display = 'flex';
            }
        };
    }

    // Cancel button
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            closeAndReset();
        };
    }

    // Close modal when clicking outside
    window.onclick = (e) => {
        if (e.target == modal) {
            closeAndReset();
        }
    };

    // Form submission is handled by the form action="/general/reviewStudent"
    // No need for custom submit handler as we're using traditional form POST

    function closeAndReset() {
        if (modal) modal.style.display = 'none';
        if (document.getElementById('reviewText')) document.getElementById('reviewText').value = "";
        const checked = document.querySelector('input[name="rating"]:checked');
        if (checked) checked.checked = false;
        if (document.getElementById("error-msg")) document.getElementById("error-msg").style.display = "none";
    }
});

/* =========================================
   IMAGE PREVIEW FUNCTION
   ========================================= */
function previewImage(input) {
    const previewContainer = document.getElementById('image-preview-container');
    if (!previewContainer) return;

    previewContainer.innerHTML = '';
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '200px';
            img.style.borderRadius = '8px';
            img.style.marginTop = '10px';
            previewContainer.appendChild(img);
        }
        reader.readAsDataURL(file);
    }
}
