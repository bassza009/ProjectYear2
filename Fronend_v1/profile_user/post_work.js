document.addEventListener('DOMContentLoaded', function() {
    renderMyJobs();
});

function renderMyJobs() {
    const postLayout = document.getElementById('postList');
    if (!postLayout) return;

    const myJobs = JSON.parse(localStorage.getItem('myPostedJobs')) || [];
    postLayout.innerHTML = "";

    if (myJobs.length === 0) {
        postLayout.innerHTML =
            "<p style='padding:20px; color:gray;'>ยังไม่มีโพสต์งาน</p>";
        return;
    }

    myJobs.slice().reverse().forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'post-main';

        jobCard.innerHTML = `
            <div class="post_text">
                <h3>${job.title}</h3>
                <p>${job.detail || "รายละเอียด..."}</p>
                <div class="post-info-meta">
                    <span class="budget">💰 งบประมาณ: <strong>${job.price} บาท</strong></span>
                    <span class="deadline">📅 กำหนดส่ง: <strong>${job.deadline}</strong></span>
                </div>
            </div>
                <a href="/Fronend_v1/post_user/post_gen.html?id=${job.id}">
                    <button class="btn-read">เข้าไปดูโพสต์</button>
                </a>
        `;

        postLayout.appendChild(jobCard);
    });
}
