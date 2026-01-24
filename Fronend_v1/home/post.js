   // ฟังก์ชันหลักสำหรับวาด Card งานบนหน้าจอ
    function renderJobs(filterType = 'all', searchTerm = '') {
        const jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
        const display = document.getElementById('jobDisplay');
        
        // กรองข้อมูลตามประเภทและคำค้นหา
        const filteredJobs = jobs.filter(job => {
            const matchesType = (filterType === 'all' || job.category === filterType);
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 (job.detail && job.detail.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesType && matchesSearch;
        });

        if (filteredJobs.length === 0) {
            display.innerHTML = "<p style='grid-column: 1/-1; text-align:center; padding: 50px; color: #999;'>ไม่พบงานที่ตรงกับการค้นหา</p>";
            return;
        }

        let html = "";
        // เรียงจากใหม่ไปเก่า (ตัวที่เพิ่งโพสต์จะอยู่บนสุด)
        filteredJobs.slice().reverse().forEach(job => {
            const jobImage = job.image ? job.image : 'https://via.placeholder.com/300x160?text=No+Image';
            
            html += `
                <div class="card">
                    <img src="${jobImage}" class="card-img">
                    <div class="card-content">
                        <div class="profile-area">
                            <img src="https://ui-avatars.com/api/?name=${job.authorName || 'User'}&background=9b59b6&color=fff" class="avatar" style="border-radius: 50%; width: 50px; height: 50px; object-fit:cover;">
                            <div style="margin-left:10px; font-size: 0.90rem;">
                                <b>${job.authorName || 'ผู้ใช้งานทั่วไป'}</b><br>
                                <small style="color:#888;">${job.category || 'งานทั่วไป'}</small>
                            </div>
                        </div>
                        <div class="title" style="margin-top:10px; font-weight:bold;">${job.title}</div>
                        <div class="desc" style="font-size:0.85rem; color:#666; height: 40px; overflow: hidden;">${job.detail || 'ไม่มีรายละเอียดงาน'}</div>
                        <div class="price" style="margin-top:10px; color:#2ecc71; font-weight:bold;">
                            <span>เริ่มต้น</span><br>
                            <b style="color:#2baf2b">${Number(job.price).toLocaleString()} บาท</b> 
                        </div>
                    </div>
                </div>`;
        });
        display.innerHTML = html;
    }

    // เมื่อโหลดหน้าเว็บ
    window.onload = function() {
        renderJobs(); // แสดงงานทั้งหมดตอนเริ่ม

        const searchForm = document.getElementById('searchForm');
        const typeSelect = document.getElementById('typew');
        const searchInput = document.getElementById('search');

        // เมื่อกดปุ่มค้นหา
        searchForm.onsubmit = function(e) {
            e.preventDefault(); // กันหน้าเว็บ Refresh
            renderJobs(typeSelect.value, searchInput.value);
        };

        // เมื่อกดปุ่ม Reset
        searchForm.onreset = function() {
            setTimeout(() => renderJobs(), 10); // รอให้ค่าใน Input เคลียร์ก่อนแล้วค่อยโหลดใหม่
        };
    };
