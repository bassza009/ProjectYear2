// const role_url = new URLSearchParams(window.location.search)
//         const role = role_url.get("role")
//         if(role){
//             document.getElementById("role").value = role
//         }
//         if(document.getElementById("role").value == 'student'){
//             document.getElementById("button_sd").style.display='block'
//         }
//         fetch('/api/user_info').then(response=>response.json()).then(data=>{
            
//             if(data.loggedIn){
                
//                 if(data.role==='student'||data.role==='dev'){
//                             document.getElementById("button_sd").style.display='block'
//                     }

//             }
//         })
function create_post(){
            const hide=document.getElementById("picture").style
            const user_hide = document.getElementById("username").style
            if(hide.display ==='none'){
                hide.display ='block'
            }else if(hide.display==='block'){
                hide.display = 'none'
            }else{
                hide.display='block'
            }
            if(user_hide.display ==='none'){
                user_hide.display ='block'
            }else if(user_hide.display==='block'){
                user_hide.display = 'none'
            }else{
                user_hide.display='block'
            }
            
            const username_name = document.getElementById("username")
            console.log(username_name)
            fetch('/api/user_info').then(response=>response.json()).then(data=>{
                console.log("Username : ",data)
                if(data.username){    
                    username_name.innerText=data.username
                }
            })
                
            
        }           