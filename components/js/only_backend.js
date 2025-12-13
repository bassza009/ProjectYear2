fetch('/api/user_info').then(response=>response.json()).then(data=>{
            
            if(data.loggedIn){
                console.log("userdata:",data)
                if((data.role==='student'||data.role==='dev') &&data.create_job !=1){
                            document.getElementById("button_sd").style.display='block'
                    }
                else{document.getElementById("button_sd").style.display='none'}
                if(data.create_job ==1){
                            document.getElementById("button_change").style.display='block'
                    }
                else{document.getElementById("button_change").style.display='none'}
            }
        })

        function show_job(){
            fetch('/api/jobs').then(response=>response.json()).then(jobs=>{
                const feed = document.getElementById("job_feed")
                feed.innerHTML=''
                if(jobs.length===0){
                    feed.innerHTML="<p>No right now :<</p>"
                    return ;    
                }
                jobs.forEach(job=>{
                    const html = `
                        <div>
                            <p>Name : ${job.username}</p>
                            <p>Job : ${job.job}</p>
                            <p>Group : ${job.user_group}</p>
                            <p>Contact number : ${job.user_number}</p>
                            <p>Budjet : ${job.budjet}</p>
                            <text-area width = 100px height = 100px>${job.des_cription}
                            </text-area>
                        </div>
                    `;
                    feed.innerHTML += html
                })
            })
            
        }
        show_job()