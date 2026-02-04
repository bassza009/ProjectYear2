/* ฟังก์ชันเปิด Modal */
function openCommentModal() {
    const modal = document.getElementById('commentModal');
    modal.style.display = 'flex'; // สั่งให้แสดงผลแบบ flex
}

/* ฟังก์ชันปิด Modal */
function closeCommentModal() {
    const modal = document.getElementById('commentModal');
    modal.style.display = 'none'; // สั่งให้หายไป
    document.getElementById('commentText').value = ""; // ล้างข้อความ
}

/* ฟังก์ชันเปิด Modal ดูทั้งหมด */
function openAllComments() {
    renderFullList(); // โหลดรายการก่อนเปิด
    document.getElementById('allCommentsModal').style.display = 'flex';
}

function closeAllComments() {
    document.getElementById('allCommentsModal').style.display = 'none';
}

/* คลิกข้างนอกกล่องให้ปิดอัตโนมัติ */
window.addEventListener('click', function(event) {
    const modal1 = document.getElementById('commentModal');
    const modal2 = document.getElementById('allCommentsModal');
    if (event.target == modal1) closeCommentModal();
    if (event.target == modal2) closeAllComments();
});