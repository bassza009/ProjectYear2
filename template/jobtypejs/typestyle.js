//const url = require("url")
document.addEventListener("DOMContentLoaded", () => {

  const categoryPath = document.getElementById("categoryPath");
  const categoryTabs = document.querySelectorAll(".category-scroll .tab");
  const priceTabs = document.querySelectorAll(".price-tabs .tab");
  const filterBtn = document.querySelector(".filter-btn");
  const filterPanel = document.getElementById("filterPanel");

  // ===== ฟังก์ชันเปลี่ยนหมวดหมู่ (ใช้ร่วมกันทุกที่) =====
  function setActiveCategory(category, label) {

    // active tab
    // categoryTabs.forEach(t => t.classList.remove("active"));
    // categoryTabs.forEach(t => {
    //   if (t.dataset.category === category) {
    //     t.classList.add("active");
    //   }
    // });
    // const path =window.location.pathname
    // const segment = path.split("/")
    // const jobType = segment.pop()

    // const 
    // path ด้านบน
    //categoryPath.innerHTML = `ประเภทงาน : ติวเตอร์ &gt; ${label}`;

    // (อนาคต) ใส่ logic กรอง card ได้ตรงนี้
    // filterCards(category);
  }

  // ===== Category Tabs (ทั้งแทบบน + กล่องคัดกรอง) =====
  categoryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      setActiveCategory(
        tab.dataset.category,
        tab.textContent.trim()
      );

      // ปิดกล่องคัดกรองหลังเลือก
      filterPanel.classList.remove("show");
    });
  });

  // ===== ปุ่มคัดกรอง =====
  filterBtn.addEventListener("click", () => {
    filterPanel.classList.toggle("show");
    filterBtn.classList.toggle("active");
  });

  // ===== Price Tabs =====
  priceTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      priceTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

});
