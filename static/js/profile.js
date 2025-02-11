var auth_token = localStorage.skill_auth_token

function getUser() {
  let url = `${base_url}user/get_user_profile/`;
  var headers = {
      'Authorization': `Token ${auth_token}`,
      'Accept': 'application/json',
  }
  fetch(url, {
      headers: headers
  })
  .then(res => {check_response(res);return res.json()})
  .then(data => {
    //console.log(data);
    if(data['status'] == 'success') {
      d = data.data;
      $('#profile_name').html(`${d.firstName} ${d.lastName}`)
        $('#profile_phone').html(`${d.phoneNumber}`)
        $('#profile_id').html(`${d.profileId}`)
        $('#profile_email').html(`${d.email}`)
        $('#credit_score').html(`${d.track.title}`)
        $('#tier').html(`<span class="user_level_3">Cohort ${d.cohort}</span>`)
        if(d.biometricEnabled) {
           document.querySelector('#checkbox1').checked = true
         }
         else {
            document.querySelector('#checkbox1').checked = false
         }
      $('.preloader').addClass('keep')
    }
    else if(data['status'] == 'error') {
      pushNotification("n_error", data.message, -1, getUser)
    }
  })
  .catch(err => {
    console.log(err);
    pushNotification("n_network", "Kindly check your internet connection", -1, getUser)
  })
}
  getUser()

  function changePassword() {
    var old_pass = $('#old-pass').val();
    var new_pass = $('#new-pass').val();
    var cnew_pass = $('#cnew-pass').val();

    if(old_pass.trim() == "" || new_pass.trim() == "" || cnew_pass.trim() == "") {
        pushNotification("n_warning", "Fields cannot be empty", 5000);
        return
    }
    if(new_pass !== cnew_pass) {
        pushNotification("n_warning", "Passwords do not match!", 5000);
        return
    }

    let url = `${base_url}user/change_password/`;

    var formData = {
        'old_password': old_pass,
        'new_password': new_pass
    }
    var headers = {
        'Authorization': `Token ${auth_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    $('#change_pass_btn').html('Changing Password...').attr('disabled', true)
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
    })
    .then(res => {check_response(res);return res.json()})
    .then(data => {
        //console.log(data)
        if(data.status == "success"){
            pushNotification("n_success", data.message, -1)
            $('#change-pass-form')[0].reset()
        }
        else {
            //swal("Error", data.message, "error")
            pushNotification("n_error", data.message, 3000)
        }
        $('#change_pass_btn').html('Change Password').attr('disabled', false)
    })
    .catch(err => {
        console.log(err);
        $('#change_pass_btn').html('Change Password').attr('disabled', false)
        pushNotification("n_network", "Kindly check your internet connection", 3000)
        //swal("Error", "Kindly check your internet connection", "error")
    })

}

function toggleBiometric() {
    if(window.PublicKeyCredential) {
      $('.preloader').removeClass('keep')
      //console.log("supported")
      let begin_url = `${base_url}webauthn/register_begin/`;
      
      try {
        // request challenge
        fetch(begin_url, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${auth_token}`,
            'Content-Type': 'application/json'
          },
          body: null
        })
        .then(res => {
          return res.json()
        })
        .then(userResponse => {
          //console.log(userResponse)
          if(!userResponse) {
            pushNotification("n_error", "Error: unable to start activation.", 3000);
            $('.preloader').addClass('keep')
            return
          }
          userResponse.pubKeyCredParams = userResponse.pub_key_cred_params
          userResponse.user.displayName = userResponse.user.display_name
          console.log(userResponse)
          userResponse.challenge = base64UrlToBuffer(userResponse.challenge);
          userResponse.user.id = base64UrlToBuffer(userResponse.user.id);
          //console.log(userResponse)
          navigator.credentials.create({publicKey: userResponse})
          .then(credential => {
            console.log(credential)
            // send response to server for verification
            let credentialData = {
              id: credential.id,
              rawId: bufferToBase64Url(credential.rawId),
              type: credential.type,
              response: {
                attestationObject: bufferToBase64Url(credential.response.attestationObject),
              clientDataJSON: bufferToBase64Url(credential.response.clientDataJSON)
              }
            };
            completeBiometricRegistration(credentialData)
          })
          .catch(error => {
            pushNotification("n_error", `Registration failed: ${error}`, 4000)
            $('.preloader').addClass('keep')
            console.log(error)
          })
        })
        .catch(error => {
          pushNotification("n_error", `Registration failed: ${error}`, 4000)
          $('.preloader').addClass('keep')
          console.log(error)
        })
        
      }
      catch (error) {
        pushNotification("n_error", `Registration failed: ${error}`, -1)
        $('.preloader').addClass('keep')
        console.log(error)
      }
    }
    else {
      console.log("Unsupported")
      pushNotification("n_error", "Biometric is not supported.", 3000)
      $('.preloader').addClass('keep')
    }
}

function completeBiometricRegistration(credentialData) {
  let complete_url = `${base_url}webauthn/register_complete/`;

  fetch(complete_url, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${auth_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentialData)
  })
  .then(res => {
    return res.json()
  })
  .then(result => {
    if(result.status) {
      pushNotification("n_success", "Biometric activated successfully.", 3000)
      document.querySelector('#checkbox1').checked = true
      $('.preloader').addClass('keep')
    }
    else {
      pushNotification("n_error", data.error, 3000)
      $('.preloader').addClass('keep')
    }
  })
  .catch(error => {
    pushNotification("n_error", `Registration failed: ${error}`, 4000)
    $('.preloader').addClass('keep')
    console.log(error)
  })
}

function changeBiometric() {
  let elem = document.querySelector("#checkbox1")
  if(elem.checked) {
    toggleBiometric()
  }
  else {
      //
  }
}

