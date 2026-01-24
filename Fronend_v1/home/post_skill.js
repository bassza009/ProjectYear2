// 1. แม่แบบสำหรับ "โพสต์รับงาน" (Skill Card)
function createSkillCard(item) {
    return `
        <div class="post">
            <div class="post_d">
                <div class="img_back"> 
                    <img src="${item.bgImage || '/photo/default_bg.png'}" alt="พื้นหลัง">
                </div>

                <div class="cover">
                    <div class="img_profile">
                        <img src="${item.profileImage || '/photo/default_profile.png'}" alt="โปรไฟล์">
                    </div>
                    <h5>${item.authorName}</h5>
                    <p>⭐${item.rating || '0.0'}</p>
                </div>

                <div class="content">
                    <h5>${item.title}</h5>
                    <p>${item.detail}</p>
                </div>
                
                <div class="money"> 
                    <h5>เริ่มต้น</h5>
                    <h3>${Number(item.price).toLocaleString()} บาท</h3>
                </div>
            </div>
        </div>`;
}

// 2. แม่แบบสำหรับ "แถวในตารางโพสต์งาน" (Job Row)
function createJobRow(job) {
    return `
        <tr>
            <td>${job.title}</td>
            <td>${job.category || 'งานทั่วไป'}</td>
            <td>${Number(job.price).toLocaleString()}</td>
            <td>${job.postDate || '-'}</td>
            <td>${job.deadline || '-'}</td>
        </tr>`;
}

function renderAllContent() {
    const skills = JSON.parse(localStorage.getItem('allSkills')) || [];
    const jobs = JSON.parse(localStorage.getItem('allJobs')) || [];

    // แสดงโพสต์รับงาน
    const skillContainer = document.getElementById('skillDisplay');
    if (skillContainer) {
        skillContainer.innerHTML = skills.map(skill => createSkillCard(skill)).join('');
    }

    // แสดงตารางงาน
    const jobTable = document.getElementById('jobTableBody');
    if (jobTable) {
        jobTable.innerHTML = jobs.map(job => createJobRow(job)).join('');
    }
}

// เรียกใช้งานเมื่อโหลดหน้า
window.addEventListener('DOMContentLoaded', renderAllContent);