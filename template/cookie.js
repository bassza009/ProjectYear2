function checkCookieConsent() {
        // เช็คว่ามี Cookie ชื่อ "user_consent" หรือยัง
        const consent = getCookie("user_consent");
        
        if (consent === "") {
            // ถ้ายังไม่มี (คือมาครั้งแรก) ให้แสดง Banner
            document.getElementById("cookie-banner").style.display = "block";
        }
    }

    // ฟังก์ชันเมื่อกดปุ่ม "ยอมรับ"
    function acceptCookies() {
        // บันทึก Cookie ไว้ว่ายอมรับแล้ว (อยู่ได้ 365 วัน)
        setCookie("user_consent", "accepted", 365);
        // ซ่อน Banner
        document.getElementById("cookie-banner").style.display = "none";
    }

    // --- Helper Functions สำหรับจัดการ Cookie ในฝั่ง Client ---
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // รันฟังก์ชันตรวจสอบทันทีที่โหลดหน้าเว็บ
    checkCookieConsent();