 <h1 align="center">SDhire กลุ่ม 5 sec.2</h1>
    <h3 align="center">พื้นที่รวมงานฟรีแลนซ์ สำหรับเด็กมหาลัยรวมทุกโอกาสงานสำหรับนักศึกษา ไม่ว่าจะหาคนทำงานหรือหางานเอง พร้อมระบบโปรไฟล์ที่ช่วยสร้างพอร์ตให้เติบโต</h3>
    <hr>
    sec.1 <b>แนะนำสมาชิก</b>
    <table >
        <tr>
            <th>ชื่อ-นามสกุล</th><br>
            <th>รหัสนิสิต</th>
            <th>หน้าที่</th>
        </tr>
        <tr>
            <td>นางสาวกาญจนา เบ้าทอง</td>
            <td>67021398</td>
            <td>front end</td>
        </tr>
        <tr>
            <td>นายณัฐภัทร สุคันธมาลา</td>
            <td>67021714</td>
            <td>front end</td>
        </tr>
        <tr>
            <td>นายปรเมศร์ พันธ์ไชย</td>
            <td>67021905</td>
            <td>front end</td>
        </tr>
        <tr>
            <td>นายภาวิต ปากเกร็ด</td>
            <td>67022063</td>
            <td>back end</td>
        </tr>
         <tr>
            <td>นายจิรกิตติ์ พลทอง</td>
            <td>67021799</td>
            <td>back end</td>
        </tr>
    </table>
    sec.2 <b>แนะนำวิธีการเข้าและลงDependency</b>
    <h3>1.Clone project</h1>
    <pre><code>gh repo clone https://github.com/bassza009/ProjectYear2.git </code></pre>
    <h3>2.ติดตั้ง Dependency</h1>
    เข้าถึง Folder project
    <br>
    <pre><code>cd ProjectYear2</code></pre>
    <br>
    <pre><code>npm i</code></pre>
    <hr>
    <h3>3.Load sql ไฟล์</h3>
    <ol>
        <li>เปิดโปรแกรม heidi(ทำการ start ก่อนในโปรแกรม XAMPP)</li>
        <li>โหลด sql file จาก folder databasefile</li>
        <li>run query ชื่อไฟล์ว่า"New_databasesdhire.sql"</li>
        <li>เข้าหน้า Manage user</li>
        <li>ทำการ add และใส่ username,password ตามที่ต้องการ(จะพ่วงไปกับขั้นตอนที่4ใหญ่)</li>
        <li>เพิ่มสิทธิ์เข้าถึงให้สามารถเข้าถึง database SDhire</li>
    </ol>
    <h3>4.ตั้งค่า Enviroment Varibel</h3>  
    <ol>
        <li>เข้าไฟล์ .env</li>
        <li>กรอกข้อมูล user และ pass จะต้องตรงกับหัวข้อ3.5
            <pre><code>
                host = localhost 
                user = ?
                pass = ?
                dbname = sdhire
                secret = nklasdo322as
            </code></pre>
        </li>
    </ol>
    <h3>5.Run website</h3>
    <pre><code>npm run start</code></pre>
    <h3>6.คู่มือการใช้งาน Web site</h3>
    <a href="https://github.com/bassza009/ProjectYear2/blob/main/Guidebook/%E0%B8%84%E0%B8%B9%E0%B9%88%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%99%E0%B8%B4%E0%B8%AA%E0%B8%B4%E0%B8%95%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%97%E0%B8%B1%E0%B9%88%E0%B8%A7%E0%B9%84%E0%B8%9B.pdf">Guide book</a>
    <br>
    หรือสามารถเข้าโฟลเดอและกดเข้าไฟล์ชื่อ"คู่มือใช้งานสำหรับนิสิตหรือบุคคลทั่วไป"
<hr>
ตัว Account สำหรับ test อยู่ในโฟลเดอ guidebook ชื่อไฟล์ว่า "Account.txt"
