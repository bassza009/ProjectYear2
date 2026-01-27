const jobItemsPerPage = 10;
let jobCurrentPage = 1;

// ===============================
// วาดตารางงาน
// ===============================
function renderJobTable() {
    const tableBody = document.getElementById("jobTableBody");
    if (!tableBody) return;

    const myJobs = JSON.parse(localStorage.getItem("myPostedJobs")) || [];
    tableBody.innerHTML = "";

    // ไม่มีงาน
    if (myJobs.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    ยังไม่มีงานที่คุณประกาศ
                </td>
            </tr>
        `;
        renderJobPagination(0);
        return;
    }

    // เรียงงานใหม่ไว้บน
    const jobs = myJobs.slice().reverse();

    const start = (jobCurrentPage - 1) * jobItemsPerPage;
    const end = start + jobItemsPerPage;
    const pageJobs = jobs.slice(start, end);

    pageJobs.forEach(job => {
        const row = `
            <tr onclick="window.location.href='/Fronend_v1/post_user/post_gen.html?id=${job.id}'"
                style="cursor:pointer;">
                <td>${job.title}</td>
                <td>${job.category}</td>
                <td>${Number(job.price).toLocaleString()}</td>
                <td>${job.postDate}</td>
                <td>${job.deadline || "-"}</td>
                <td>-</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    renderJobPagination(jobs.length);
}

// ===============================
// สร้าง pagination 1 2 3
// ===============================
function renderJobPagination(totalItems) {
    const pagination = document.getElementById("jobPagination");
    if (!pagination) return;

    pagination.innerHTML = "";

    const totalPages = Math.ceil(totalItems / jobItemsPerPage);
    if (totalPages <= 1) return;

    const createBtn = (text, page, active = false, disabled = false) => {
        const btn = document.createElement("button");
        btn.textContent = text;
        btn.className = "page-btn";

        if (active) btn.classList.add("active");
        btn.disabled = disabled;

        btn.onclick = () => {
            jobCurrentPage = page;
            renderJobTable();
        };

        return btn;
    };

    // ปุ่มก่อนหน้า
    pagination.appendChild(
        createBtn("«", jobCurrentPage - 1, false, jobCurrentPage === 1)
    );

    // ปุ่มเลขหน้า
    for (let i = 1; i <= totalPages; i++) {
        pagination.appendChild(
            createBtn(i, i, i === jobCurrentPage)
        );
    }

    // ปุ่มถัดไป
    pagination.appendChild(
        createBtn("»", jobCurrentPage + 1, false, jobCurrentPage === totalPages)
    );
}

// ===============================
// โหลดหน้าแล้วแสดงทันที
// ===============================
document.addEventListener("DOMContentLoaded", renderJobTable);
