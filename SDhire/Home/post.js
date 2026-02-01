/* ================================
   GLOBAL STATE
================================ */
const itemsPerPage = 10;
let currentPage = 1;
let currentType = 'all';
let currentSearch = '';


const categoryNames = {
    "0": "งานทั่วไป",
    "1": "เรียนพิเศษ",
    "2": "ภาพถ่าย-วิดีโอ",
    "3": "ออกแบบกราฟิก"
};
/* ================================
   RENDER JOBS (มี pagination)
================================ */
function renderJobs() {
    const jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
    const display = document.getElementById('jobDisplay');

    // filter + search
    let filteredJobs = jobs.filter(job => {
        const matchType = currentType === 'all' || job.category === currentType;
        const matchSearch =
            job.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
            (job.detail && job.detail.toLowerCase().includes(currentSearch.toLowerCase()));
        return matchType && matchSearch;
    });

    // เรียงใหม่ → เก่า
    filteredJobs = filteredJobs.reverse();

    // pagination slice
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageJobs = filteredJobs.slice(start, end);

    if (pageJobs.length === 0) {
        display.innerHTML = `
          <p style="grid-column:1/-1;text-align:center;padding:50px;color:#999;">
            ไม่พบงาน
          </p>`;
        renderPagination(0);
        return;
    }

    let html = "";
    pageJobs.forEach(job => {
        const img = job.image || "https://via.placeholder.com/300x160?text=No+Image";

        html += `
         <a href="../Post/post_jop.html?id=${job.id}" class="card-link">
            <div class="card">
                <img src="${img}" class="card-img">

                <div class="card-content">
                    <div class="profile-area">
                        <img src="https://ui-avatars.com/api/?name=${job.authorName || 'User'}"
                            class="avatar">
                        <div>
                            <b>${job.authorName || 'ผู้ใช้งานทั่วไป'}</b><br>
                            <small>${categoryNames[job.category] || job.category || 'ยังไม่เลือก'}</small>
                        </div>
                    </div>

                    <div class="title">${job.title}</div>
                    <div class="desc">${job.detail || 'ไม่มีรายละเอียด'}</div>

                    <div class="price">
                        <span>เริ่มต้น</span><br>
                        <b>${Number(job.price).toLocaleString()} บาท</b>
                    </div>
                </div>
            </div>
        </a>`;
    });

    display.innerHTML = html;
    renderPagination(filteredJobs.length);
}

/* ================================
   PAGINATION (แบบ Google)
================================ */
function renderPagination(totalItems) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return;

    const createBtn = (text, page, active = false, disabled = false) => {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.className = "page-btn";
        if (active) btn.classList.add("active");
        btn.disabled = disabled;
        btn.onclick = () => {
            currentPage = page;
            renderJobs();
        };
        return btn;
    };

    // prev
    pagination.appendChild(
        createBtn("«", currentPage - 1, false, currentPage === 1)
    );

    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            Math.abs(i - currentPage) <= 1
        ) {
            pagination.appendChild(
                createBtn(i, i, i === currentPage)
            );
        } else if (
            i === currentPage - 2 ||
            i === currentPage + 2
        ) {
            pagination.appendChild(document.createTextNode(" ... "));
        }
    }

    // next
    pagination.appendChild(
        createBtn("»", currentPage + 1, false, currentPage === totalPages)
    );
}

/* ================================
   EVENTS
================================ */
window.onload = () => {
    renderJobs();

    const form = document.getElementById("searchForm");
    const type = document.getElementById("typew");
    const search = document.getElementById("search");

    form.onsubmit = e => {
        e.preventDefault();
        currentType = type.value;
        currentSearch = search.value;
        currentPage = 1;
        renderJobs();
    };

    form.onreset = () => {
        setTimeout(() => {
            currentType = 'all';
            currentSearch = '';
            currentPage = 1;
            renderJobs();
        }, 10);
    };
};

//localStorage.clear();