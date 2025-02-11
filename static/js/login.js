function authenticate() {
    $('.login-btn').html('Authenticating...').attr('disabled', true)
    let url = `${base_url}auth/login/`
    let email = localStorage.skill_auth_username ? localStorage.skill_auth_username : $('#email').val();
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
            localStorage.setItem('skill_auth_username', data.user)
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
    if(localStorage.skill_auth_token) {
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

function biometricLogin() {
    if(window.PublicKeyCredential) {
      
      let email = localStorage.skill_auth_username ? localStorage.skill_auth_username : $('#email').val();
      let begin_url = `${base_url}webauthn/auth_begin/`;
      let complete_url = `${base_url}webauthn/auth_complete/`;

      var formData = {
        'email':email
        }
        $('.login-btn').html('Authenticating...').attr('disabled', true)
      try {
        // request challenge
        fetch(begin_url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(res => {
          return res.json()
        })
        .then(userResponse => {
          if(!userResponse || !userResponse.publicKey) {
            $('#admin_err').html(`<i class="fa fa-warning"></i> Error: ${userResponse.message}`)
            $('.login-btn').html('Log In').attr('disabled', false)
            return
          }
          userResponse.publicKey.challenge = base64UrlToBuffer(userResponse.publicKey.challenge);
          userResponse.publicKey.allowCredentials.forEach(cred => {
            cred.id = base64UrlToBuffer(cred.id)
          })
          let assertion;
          try {
            assertion = navigator.credentials.get({publicKey: userResponse.publicKey});
          }
          catch(err) {
            $('.login-btn').html('Log In').attr('disabled', false)
            $('#admin_err').html(`<i class="fa fa-warning"></i> Authentication failed: ${err}`)
            return
          }
          // call webauthn API to create credentials
        
          // send response to server for verification
          let assertionData = {
            id: assertion.id,
            rawId: bufferToBase64Url(assertion.rawId),
            type: assertion.type,
            response: {
                authenticatorData: bufferToBase64Url(assertion.response.authenticatorData),
                clientDataJSON: bufferToBase64Url(assertion.response.clientDataJSON),
                signature: bufferToBase64Url(assertion.response.signature),
                userHandle: assertion.response.userHandle ? bufferToBase64Url(assertion.response.userHandle) : null
            }
          };

          fetch(complete_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(assertionData)
          })
          .then(res => {
            return res.json()
          })
          .then(data => {
            if(data.token) {
                localStorage.setItem('skill_auth_token', data.token)
                localStorage.setItem('skill_auth_username', data.user)
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
          .catch(error => {
            $('#admin_err').html(`<i class="fa fa-warning"></i> ${error}`)
            $('.login-btn').html('Log In').attr('disabled', false)
            console.log(error)
          })
        })
        .catch(error => {
            $('#admin_err').html(`<i class="fa fa-warning"></i> ${error}`)
            $('.login-btn').html('Log In').attr('disabled', false)
          console.log(error)
        })
        
      }
      catch (error) {
        $('#admin_err').html(`<i class="fa fa-warning"></i> ${error}`)
        $('.login-btn').html('Log In').attr('disabled', false)
        console.log(error)
      }
    }
    else {
      console.log("Unsupported")
      $('#admin_err').html(`<i class="fa fa-warning"></i> Biometric Login is not supported`)
      $('.login-btn').html('Log In').attr('disabled', false)
    }
}

