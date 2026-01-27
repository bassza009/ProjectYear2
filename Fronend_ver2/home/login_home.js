document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close-modal');
    const stayGuest = document.getElementById('stayGuest');

    // 1. ฟังก์ชันเปิด Modal
    function openLoginModal() {
        modal.style.display = 'flex';
    }

    // 2. ดักจับการคลิกทั้งหน้าจอ (Event Delegation)
    document.addEventListener('click', function(e) {
        // ตรวจสอบว่าสิ่งที่คลิกคือ ปุ่มโพสต์, ปุ่มเข้าสู่ระบบ หรือ การ์ดงาน
        if (
            e.target.closest('.btn-post') || 
            e.target.closest('header button') || 
            e.target.closest('.card') ||      // เพิ่มการดักจับคลิกที่ Card งาน
            e.target.closest('.post_d')       // เพิ่มการดักจับคลิกที่ Card แบบ Skill
        ) {
            e.preventDefault();
            e.stopPropagation();
            openLoginModal();
        }
    });

    // 3. ส่วนการปิด Modal (เหมือนเดิม)
    stayGuest.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
    };
});