// ฟังก์ชันแสดงข้อมูลในตาราง
function renderJobTable() {
    const tableBody = document.getElementById('jobTableBody');
    if (!tableBody) return; // กัน Error ถ้าหน้าอื่นเรียกใช้ไฟล์นี้แต่ไม่มีตาราง

    // ดึงข้อมูลจาก LocalStorage
    const myJobs = JSON.parse(localStorage.getItem('myPostedJobs')) || [];

    // ล้างข้อมูลเก่าในตารางก่อน
    tableBody.innerHTML = "";

    if (myJobs.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">ยังไม่มีงานที่คุณประกาศ</td></tr>';
        return;
    }

    // วนลูปข้อมูลมาสร้างแถวตาราง (แสดงงานใหม่ล่าสุดไว้ข้างบนสุด)
    myJobs.slice().reverse().forEach(job => {
        const row = `        
           <tr onclick="window.location.href='/Fronend_v1/post_user/view_post_gen.html?id=${job.id}'"
            style="cursor:pointer;">
            <td>${job.title}</td>
            <td>${job.category}</td>
            <td>${Number(job.price).toLocaleString()}</td>
            <td>${job.postDate}</td>
            <td>${job.deadline || '-'}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// ฟังก์ชันลบงาน
function deleteJob(id) {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?")) {
        let myJobs = JSON.parse(localStorage.getItem('myPostedJobs')) || [];
        
        // กรองเอาเฉพาะอันที่ ID ไม่ตรงกับที่กดลบเก็บไว้
        myJobs = myJobs.filter(job => job.id !== id);
        
        // บันทึกกลับ
        localStorage.setItem('myPostedJobs', JSON.stringify(myJobs));
        
        // วาดตารางใหม่
        renderJobTable();
    }
}

// เมื่อโหลดหน้าเว็บ ให้ดึงตารางออกมาแสดงทันที
document.addEventListener('DOMContentLoaded', renderJobTable);