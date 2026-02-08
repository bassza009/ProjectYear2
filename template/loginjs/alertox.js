const url_param = new URLSearchParams(window.location.search)
        const error_code = url_param.get('error')
        const edit_success = url_param.get("edit_success")      //const error_element = document.getElementById('error_text')
        const post_success = url_param.get("post_success")
        const success = url_param.get("success")
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
        else if(error_code === "103"){
            Swal.fire({
                icon: 'error',
                title: 'สมัครไม่สำเร็จ',
                text: 'อีเมลนี้มีอยู่ในระบบแล้ว',
                confirmButtonColor: '#d33' // สีปุ่มแดง
            })
        }
    if(edit_success==="101"){
        Swal.fire({
            icon: 'success',
            title: 'แก้ไขสำเร็จ',
            text: 'โพสความสามารถของคุณถูกแก้ไขแล้ว',
            confirmButtonColor: 'rgb(57, 221, 51)' // สีปุ่มแดง
            })
    }else if(post_success ==="101"){
        Swal.fire({
            icon: 'success',
            title: 'โพสสำเร็จ',
            text: 'โพสความสามารถของคุณถูกโพสแล้ว',
            confirmButtonColor: 'rgb(57, 221, 51)' // สีปุ่มแดง
            })
    }
    else if(success ==="102"){
        Swal.fire({
            icon: 'success',
            title: 'ลบโพสสำเร็จ',
            text: 'โพสความสามารถของคุณถูกลบแล้ว',
            confirmButtonColor: 'rgb(57, 221, 51)' // สีปุ่มแดง
            })
    }