// ฟังก์ชันบันทึกข้อมูลงาน
function submitwork() {
    // 1. ดึงค่าจาก HTML ID
    const title = document.getElementById('title').value;
    const detail = document.getElementById('detail').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const deadline = document.getElementById('deadline').value;

    // 2. ตรวจสอบว่ากรอกครบไหม
    if (!title || !category || !price) {
        alert("กรุณากรอกข้อมูล ชื่องาน, ประเภท และงบประมาณ ให้ครบถ้วน");
        return;
    }

    // 3. สร้าง Object ข้อมูล
    const newJob = {
        id: Date.now(), // ใช้ timestamp เป็น ID เพื่อใช้ตอนสั่งลบ
        title: title,
        detail: detail,
        category: category,
        price: price,
        deadline: deadline,
        postDate: new Date().toLocaleDateString('th-TH'), // วันที่ลงประกาศ
    };

    // 4. บันทึกลง LocalStorage
    // ดึงข้อมูลเดิมที่มีอยู่ก่อน ถ้าไม่มีให้เริ่มเป็น Array ว่าง []
    let myJobs = JSON.parse(localStorage.getItem('myPostedJobs')) || [];
    
    // เพิ่มงานใหม่เข้าไปในรายการ
    myJobs.push(newJob);
    
    // บันทึกกลับลงไป
    localStorage.setItem('myPostedJobs', JSON.stringify(myJobs));

    alert("ลงประกาศงานสำเร็จ!");
    
    // 5. ย้ายหน้าไปที่หน้าหลัก (เช็คชื่อไฟล์ของคุณให้ดีว่าชื่ออะไร)
    window.location.href = 'home_stu.html'; 
}