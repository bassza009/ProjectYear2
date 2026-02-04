


/*--------------------------------------- */

// 1. ประกาศตัวแปรอ้างอิงถึงปุ่มและส่วนเนื้อหา
const btnSkill = document.querySelector('.toggle_skill');
const btnJob = document.querySelector('.toggle_job');
const skillSection = document.querySelector('.post_skill');
const jobSection = document.querySelector('.post_job');

// 2. ฟังก์ชันสลับไปหน้า "โพสต์รับงาน" (แสดง Card)
btnSkill.addEventListener('click', () => {
    // จัดการปุ่ม: เพิ่มคลาส active ให้ปุ่มที่กด และเอาออกจาอีกปุ่ม
    btnSkill.classList.add('active');
    btnJob.classList.remove('active');
    
    // จัดการเนื้อหา: แสดงส่วน Card และซ่อนส่วน Table
    skillSection.style.display = 'block'; 
    jobSection.style.display = 'none';
});

// 3. ฟังก์ชันสลับไปหน้า "โพสต์งาน" (แสดง Table)
btnJob.addEventListener('click', () => {
    // จัดการปุ่ม: เพิ่มคลาส active ให้ปุ่มที่กด และเอาออกจากอีกปุ่ม
    btnJob.classList.add('active');
    btnSkill.classList.remove('active');
    
    // จัดการเนื้อหา: แสดงส่วน Table และซ่อนส่วน Card
    jobSection.style.display = 'block';
    skillSection.style.display = 'none';
});

// 4. กำหนดสถานะเริ่มต้น (ตัวอย่างเช่น ให้เริ่มที่หน้าโพสต์รับงาน)
btnSkill.click();

/*--------------------------------------------------------------*/
