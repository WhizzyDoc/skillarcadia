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


  //var get_new_notes = setInterval(getNewNotifications, 3000)