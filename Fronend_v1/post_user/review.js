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