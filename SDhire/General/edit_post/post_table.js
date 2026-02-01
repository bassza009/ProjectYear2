function submitwork() {
    const title = document.getElementById('title').value;
    const detail = document.getElementById('detail').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const deadline = document.getElementById('deadline').value;
/*
    if (!title || !category || !price) {
        alert("กรุณากรอกข้อมูล ชื่องาน, ประเภท และงบประมาณ ให้ครบถ้วน");
        return;
    }
    */

    const newJob = {
        id: Date.now(),
        title,
        detail,
        category,
        price,
        deadline,
        postDate: new Date().toLocaleDateString('th-TH')
    };

    let myJobs = JSON.parse(localStorage.getItem('myPostedJobs')) || [];
    myJobs.push(newJob);
    localStorage.setItem('myPostedJobs', JSON.stringify(myJobs));
    window.location.href = '../home/home_gen.html'; 
}
