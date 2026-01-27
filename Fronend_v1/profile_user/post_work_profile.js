
////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    renderMyJobs();
});

function renderMyJobs() {
    const postLayout = document.getElementById('postList');
    if (!postLayout) return;

    // ดึงข้อมูลจาก localStorage
    const myJobs = JSON.parse(localStorage.getItem('myPostedJobs')) || [];

    postLayout.innerHTML = ""; // ล้างที่ว่างก่อนเริ่มวาด

    if (myJobs.length === 0) {
        postLayout.innerHTML = "<p style='padding:20px; color:gray;'>ยังไม่มีโพสต์งาน</p>";
        return;
    }

    // วนลูปสร้าง "กล่องใหม่" ทุกครั้งที่มีข้อมูลงาน
    myJobs.reverse().forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'post-main'; // สร้างก้อน post-main แยกออกจากกัน
        
        jobCard.innerHTML = `
            <div class="post_text">
                <h3>${job.title}</h3>
                <p>${job.detail || "รายละเอียด..."}</p>
                <div class="post-info-meta">
                    <span class="budget">💰 งบประมาณ: <strong>${job.price} บาท</strong></span>
                    <span class="deadline">📅 กำหนดส่ง: <strong>${job.deadline}</strong></span>
                </div>
            </div>
            <button class="btn-read" onclick="toggleComments()">เข้าไปดูโพสต์</button>
        `;
        
        // แปะก้อนงานที่สร้างใหม่ลงในที่ว่าง
        postLayout.appendChild(jobCard);
    });
}