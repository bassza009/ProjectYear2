document.addEventListener("DOMContentLoaded", () => {

  const categoryPath = document.getElementById("categoryPath");

  const categoryTabs = document.querySelectorAll(".category-scroll .tab");
  const priceTabs = document.querySelectorAll(".price-tabs .tab");

  function setActiveCategory(category, label) {
    categoryTabs.forEach(tab => {
      tab.classList.toggle(
        "active",
        tab.dataset.category === category
      );
    });

    categoryPath.innerHTML =
      `ประเภทงาน : ติวเตอร์ &gt; ${label}`;
  }

  // ===== Category Tabs =====
  categoryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      setActiveCategory(
        tab.dataset.category,
        tab.textContent.trim()
      );
    });
  });

  // ===== Price Tabs =====
  priceTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      priceTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

});