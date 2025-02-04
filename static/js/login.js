function authenticate() {
    $('.login-btn').html('Authenticating...').attr('disabled', true)
    let url = `${base_url}auth/login/`
    let email = $('#email').val();
    let password = $('#password').val();
    var formData = {
        'email':email,
        'password':password
    }
    //console.log(formData)
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    fetch(url, {
        method:'POST',
        headers: headers,
        body: JSON.stringify(formData)
    })
    .then(res => {return res.json()})
    .then(data => {
        //console.log(data);
        if(data.token) {
            localStorage.setItem('skill_auth_token', data.token)
            location.href = './home.html'
        }
        else if(data.message) {
            $('#admin_err').html(`<i class="fa fa-warning"></i> ${data.message}`)
            swal('Error', data.message, "error")
        }
        else {
            if(data.non_field_errors) {
                $('#admin_err').html(`<i class="fa fa-warning"></i> ${data['non_field_errors'][0]}`)
                swal('Error', data['non_field_errors'][0], "error")
            } 
        }
        $('.login-btn').html('Log In').attr('disabled', false)
    })
    .catch(err => {
        console.log(err);
        swal("Error", "Please check your internet connection", "error")
        $('.login-btn').html('Log In').attr('disabled', false);
    })
}

function logout() {
    if(localStorage.ajo_auth_token) {
        localStorage.removeItem("skill_auth_token");
        location.href = "./signup.html"
    }
}

function forgotPassword() {
    $('.forgot-btn').html('Resetting...').attr('disabled', true)
    let url = `${base_url}accounts/forgot_password/`
    let email = $('#forg-email').val();
    var formData = {
        'email': email
    };
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    fetch(url, {
        method:'POST',
        headers: headers,
        body: JSON.stringify(formData)
    })
    .then(res => {return res.json()})
    .then(data => {
        //console.log(data);
        if(data['status'] == 'success') {
            swal("Success", data['message'], 'success')
            location.href = '#'
        }
        else if(data['status'] == 'error') {
            swal('Error', data['message'], "error")
        }
        $('.forgot-btn').html('Reset Password').attr('disabled', false)
    })
    .catch(err => {
        console.log(err);
        swal("Error", "Please check your internet connection", "error")
        $('.forgot-btn').html('Reset Password').attr('disabled', false);
    })
}

