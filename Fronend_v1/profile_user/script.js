// จำลองข้อมูลจากระบบ (เช่น ดึงมาจาก Database)
const userData = {
    name: "Kanjana Baothong",
    jobCount: 10
};

// เริ่มต้นโหลดข้อมูล
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('user-name').innerText = userData.name;
});

let isEditing = false;

function toggleEdit() {
    const btn = document.getElementById('edit-btn');
    const valueContainers = document.querySelectorAll('.contact-value');
    
    if (!isEditing) {
        // --- เข้าสู่โหมดแก้ไข ---
        valueContainers.forEach(container => {
            const currentText = container.innerText;
            // สร้าง input field ขึ้นมาแทนที่ text เดิม
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.className = 'edit-input';
            
            container.innerHTML = '';
            container.appendChild(input);
        });

        btn.innerText = "บันทึก";
        btn.classList.add('btn-save');
        isEditing = true;
    } else {
        // --- บันทึกข้อมูล ---
        valueContainers.forEach(container => {
            const inputField = container.querySelector('input');
            if (inputField) {
                const newValue = inputField.value;
                container.innerText = newValue;
                // ตรงนี้สามารถเพิ่ม Code เพื่อส่งข้อมูล (fetch API) ไปเซฟที่ Server ได้
            }
        });

        btn.innerText = "แก้ไข";
        btn.classList.remove('btn-save');
        isEditing = false;
        
        console.log("บันทึกข้อมูลเรียบร้อยแล้ว!");
    }
}