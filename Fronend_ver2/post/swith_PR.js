function toggleDropdown() {
    // เลือกตัวแปร data_box มาเก็บไว้
    const dropdown = document.getElementById("myDropdown");
    
    // ใช้ toggle เพื่อสลับคลาส 'show' (ถ้ามีให้เอาออก ถ้าไม่มีให้ใส่เข้าไป)
    dropdown.classList.toggle("show");
}

// โค้ดสำหรับปิดเมนูอัตโนมัติ เมื่อเราคลิกที่อื่นที่ไม่ใช่ปุ่มโปรไฟล์
window.onclick = function(event) {
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
// 1. อ้างอิงปุ่มตามชื่อ Class ใหม่ที่คุณส่งมา
const btnPost = document.querySelector('.toggle_post');
const btnReview = document.querySelector('.toggle_review');

// 2. อ้างอิงเนื้อหาตาม ID ใน HTML
const postSection = document.getElementById('post_sw');
const reviewSection = document.getElementById('review_sw');

// 3. ฟังก์ชันสลับไปหน้า "โพสต์ของคุณ"
btnPost.addEventListener('click', () => {
    btnPost.classList.add('active');
    btnReview.classList.remove('active');
    
    postSection.style.display = 'flex';   // แสดงหน้าโพสต์ (ใช้ flex ตาม CSS ของคุณ)
    reviewSection.style.display = 'none'; // ซ่อนหน้ารีวิว
});

// 4. ฟังก์ชันสลับไปหน้า "รีวิว"
btnReview.addEventListener('click', () => {
    btnReview.classList.add('active');
    btnPost.classList.remove('active');
    
    reviewSection.style.display = 'flex'; // แสดงหน้ารีวิว
    postSection.style.display = 'none';   // ซ่อนหน้าโพสต์
});

// 5. กำหนดให้เริ่มต้นที่หน้า "โพสต์ของคุณ"
btnPost.click();

/*--------------------------------------- */