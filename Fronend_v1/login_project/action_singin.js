document.addEventListener("DOMContentLoaded", () => {

    const student = document.querySelector(".student");
    const general = document.querySelector(".general");

    const btnToGeneral = document.querySelector(".toGeneral");
    const btnToStudent = document.querySelector(".toStudent");

    // ไปหน้าบุคคลทั่วไป
    if (btnToGeneral) {
        btnToGeneral.addEventListener("click", () => {
            student.style.display = "none";
            general.style.display = "flex";
        });
    }

    // กลับมาหน้านิสิต
    if (btnToStudent) {
        btnToStudent.addEventListener("click", () => {
            general.style.display = "none";
            student.style.display = "flex";
        });
    }
});
