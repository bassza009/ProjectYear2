/*-------------  Create Student---*/
function goToStep_stu(stepNumber) {
    // 1. ซ่อนทุกส่วนก่อน
    document.getElementById('part1').style.display = 'none';
    document.getElementById('part2').style.display = 'none';
    document.getElementById('part3').style.display = 'none';

    // 2. แสดงส่วนที่เลือก
    document.getElementById('part' + stepNumber).style.display = 'block';

    // 3. อัปเดตสถานะของ Progress Bar
    if (stepNumber === 2) {
        document.getElementById('circle2').classList.add('active');
        document.getElementById('line1').classList.add('active');
    } 
    if (stepNumber === 3) {
        document.getElementById('circle2').classList.add('active');
        document.getElementById('line1').classList.add('active');
        document.getElementById('circle3').classList.add('active');
        document.getElementById('line2').classList.add('active');
    }
}

function goBack_stu() {
    // หาว่าตอนนี้หน้าไหนกำลังแสดงอยู่ (ดูจาก display ที่ไม่ใช่ none)
    if (document.getElementById('part2').style.display === 'block') {
        goToStep_stu(1);
        // ถอดสีม่วงออกจากวงกลม 2 และเส้น 1
        document.getElementById('circle2').classList.remove('active');
        document.getElementById('line1').classList.remove('active');
    } 
    else if (document.getElementById('part3').style.display === 'block') {
        goToStep_stu(2);
        // ถอดสีม่วงออกจากวงกลม 3 และเส้น 2
        document.getElementById('circle3').classList.remove('active');
        document.getElementById('line2').classList.remove('active');
    }
}
 /*--------------  Create Genneral -----------------*/

 function goToStep_gen(stepNumber) {

    document.getElementById('p1').style.display = 'none';
    document.getElementById('p2').style.display = 'none';

    document.getElementById('p' + stepNumber).style.display = 'block';

    if (stepNumber === 2) {
        document.getElementById('c2').classList.add('active');
        document.getElementById('l1').classList.add('active');
    }
}
function goBack_gen() {
    // หาว่าตอนนี้หน้าไหนกำลังแสดงอยู่ (ดูจาก display ที่ไม่ใช่ none)
    if (document.getElementById('p2').style.display === 'block') {
        goToStep_gen(1);
        // ถอดสีม่วงออกจากวงกลม 2 และเส้น 1
        document.getElementById('c2').classList.remove('active');
        document.getElementById('l1').classList.remove('active');
    }
}