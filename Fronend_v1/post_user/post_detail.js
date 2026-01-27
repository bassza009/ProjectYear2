// ดึงงานทั้งหมด
const jobs = JSON.parse(localStorage.getItem("myPostedJobs")) || [];

// เอางานล่าสุด
const job = jobs[jobs.length - 1];

if (!job) {
    document.getElementById("displayTitle").innerText = "ไม่พบข้อมูลงาน";
} else {
    document.getElementById("displayTitle").innerText = job.title || "";
    document.getElementById("displayDetail").innerText = job.detail || "";

    const categoryMap = {
        "0": "งานทั่วไป",
        "1": "เรียนพิเศษ",
        "2": "ภาพถ่าย-วิดีโอ",
        "3": "ออกแบบกราฟิก"
    };

    document.getElementById("displayCategory").innerText =
        "ประเภทงาน : " + (categoryMap[job.category] || "");

    document.getElementById("displayPrice").innerText =
        job.price ? job.price + " บาท" : "";

    document.getElementById("displayDeadline").innerText =
        job.deadline || "";
}
