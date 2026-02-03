const url_param = new URLSearchParams(window.location.search)
        const error_code = url_param.get('error')
        //const error_element = document.getElementById('error_text')

        if(error_code === "108"){
            Swal.fire({
                icon: 'error',
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: 'โปรดเข้าสู่ระบบแบบนิสิต',
                confirmButtonColor: '#d33' // สีปุ่มแดง
            })
        }
        else if(error_code === "104"){
            Swal.fire({
                icon: 'error',
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: 'โปรดเข้าสู่ระบบแบบบุคคลทั่วไป',
                confirmButtonColor: '#d33' // สีปุ่มแดง
            })
        }
        else if(error_code === "102"){
            Swal.fire({
                icon: 'error',
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: 'รหัสหรืออีเมลของคุณผิดพลาด',
                confirmButtonColor: '#d33' // สีปุ่มแดง
            })
        }