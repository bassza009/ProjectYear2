const url_param = new URLSearchParams(window.location.search)
const error_code = url_param.get('error')
const error_element = document.getElementById('error_text')

if(error_code === "102"){
    error_element.style.display = 'block'
    error_element.innerText="Can't Register"
}else if(error_code === '101'){
    error_element.style.display = 'block'
    error_element.innerText="Wrong password or email"
    error_element.style.color = "red"
}
else if(error_code === '100'){
    error_element.style.display = 'block'
    error_element.innerText="This account doesn't exist"
    error_element.style.color = "red"
}