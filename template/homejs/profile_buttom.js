function toggleDropdown() {
    // เลือกตัวแปร data_box มาเก็บไว้
    const dropdown = document.getElementById("myDropdown");

    // ใช้ toggle เพื่อสลับคลาส 'show' (ถ้ามีให้เอาออก ถ้าไม่มีให้ใส่เข้าไป)
    dropdown.classList.toggle("show");
}

// โค้ดสำหรับปิดเมนูอัตโนมัติ เมื่อเราคลิกที่อื่นที่ไม่ใช่ปุ่มโปรไฟล์
window.onclick = function (event) {
    // ตรวจสอบว่าจุดที่คลิก ไม่ใช่ปุ่ม profile และไม่ใช่ข้างในเมนู data_box
    if (!event.target.closest('.profile_container')) {
        const dropdown = document.getElementById("myDropdown");

        // ถ้าเมนูเปิดอยู่ ให้ลบคลาส show เพื่อปิดเมนู
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
}


/*--------------------------------------- */

// 1. ประกาศตัวแปรอ้างอิงถึงปุ่มและส่วนเนื้อหา
const btnSkill = document.querySelector('.toggle_skill');
const btnJob = document.querySelector('.toggle_job');
const skillSection = document.querySelector('.post_skill');
const jobSection = document.querySelector('.post_job');
const skillPagination = document.getElementById('pagination');
const jobPagination = document.getElementById('jobPagination');

// 2. ฟังก์ชันสลับไปหน้า "โพสต์รับงาน" (แสดง Card)
if (btnSkill && btnJob && skillSection && jobSection) {
    btnSkill.addEventListener('click', () => {
        // จัดการปุ่ม
        btnSkill.classList.add('active');
        btnJob.classList.remove('active');

        // จัดการเนื้อหา
        skillSection.style.display = ''; // Revert to CSS (grid)
        jobSection.style.display = 'none';

        // จัดการ Pagination
        if (skillPagination) skillPagination.style.display = ''; // Revert to CSS (flex)
        if (jobPagination) jobPagination.style.display = 'none';
    });

    // 3. ฟังก์ชันสลับไปหน้า "โพสต์งาน" (แสดง Table)
    btnJob.addEventListener('click', () => {
        // จัดการปุ่ม
        btnJob.classList.add('active');
        btnSkill.classList.remove('active');

        // จัดการเนื้อหา
        jobSection.style.display = ''; // Revert to CSS (flex)
        skillSection.style.display = 'none';

        // จัดการ Pagination
        if (jobPagination) jobPagination.style.display = ''; // Revert to CSS
        if (skillPagination) skillPagination.style.display = 'none';
    });

    // 4. กำหนดสถานะเริ่มต้น (ตัวอย่างเช่น ให้เริ่มที่หน้าโพสต์รับงาน)
    // ตรวจสอบ url query parameters ถ้ามี table_type หรือ table_search ให้เปิด tab job
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('table_type') || urlParams.has('table_search')) {
        btnJob.click();
    } else {
        btnSkill.click();
    }
}