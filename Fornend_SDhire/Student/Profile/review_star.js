document.addEventListener('DOMContentLoaded', function() {
    // ดึง Element ต่างๆ
    const modal = document.getElementById('reviewModal');
    const openBtn = document.getElementById('openReview');
    const cancelBtn = document.getElementById('cancelBtn');

    // ฟังก์ชันเปิด Modal
    if (openBtn) {
        openBtn.onclick = function() {
            modal.style.display = 'flex';
        };
    }

    // ฟังก์ชันปิด Modal เมื่อกด "ยกเลิก"
    if (cancelBtn) {
        cancelBtn.onclick = function() {
            modal.style.display = 'none';
        };
    }

    // ปิด Modal เมื่อคลิกพื้นหลัง (พื้นที่ว่างนอกหน้าต่างรีวิว)
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});
/*------------------------------------------------------------------------*/
// เลือกปุ่ม tag ทั้งหมดที่มีในหน้าเว็บ
const tags = document.querySelectorAll('.tag');

tags.forEach(tag => {
    tag.addEventListener('click', function() {
        tags.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});