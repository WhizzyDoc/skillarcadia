var auth_token = localStorage.skill_auth_token

//$('.preloader').addClass('keep')

function getUserCourses() {
  let url = `${base_url}courses/get_user_courses/`;
  $(".course-filter").empty();
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
      let d = data.data;
      for(let i in d) {
        let temp = `
        <option value="${d[i].id}">${d[i].title}</option>`;
        $(".course-filter").append(temp)
      }
      let temp2 = `
        <option value="0" selected>All Courses</option>`;
      $(".course-filter").prepend(temp2)

      getUserProjects()
    }
    else if(data['status'] == 'error') {
      pushNotification("n_error", data.message, -1, getUserCourses)
    }
  })
  .catch(err => {
    console.log(err);
    pushNotification("n_network", "Kindly check your internet connection", -1, getUserCourses)
  })
}

getUserCourses()

function getUserProjects() {
  var course_id = $('.course-filter').val()
  let url = `${base_url}courses/get_course_projects/?course_id=${course_id}`;
  var headers = {
      'Authorization': `Token ${auth_token}`,
      'Accept': 'application/json',
  }
  $(".projects-con").empty()
  fetch(url, {
      headers: headers
  })
  .then(res => {check_response(res);return res.json()})
  .then(data => {
    //console.log(data);
    if(data['status'] == 'success') {
      let d = data.data;
      if(d.length == 0) {
        $(".projects-con").append(`<h5 class="w-padding w-text-white">No projects yet.</h5>`)
      }
      else {
        for(let i in d) {
          ic = ``;
              if(d[i].submitted) {
                  ic = `<i class="fa fa-check w-text-green"></i>`;
              }
              else {
                  ic = `<i class="fa fa-times w-text-orange"></i>`;
              }
          let temp = `
              <div class="card-header" style="background: var(--bg-container);">
                        <a class="card-link w-flex w-flex-between w-align-center" data-toggle="collapse" href="#collapse_${i}">
                            <div class="h6 w-bold" style="text-align:left;color:#fff">${ic}&nbsp;&nbsp;${d[i].title}</div>
                            <div class="h5"><i class="fa fa-chevron-down"></i></div>
                        </a>
                    </div>
                    <div id="collapse_${i}" class="collapse" data-parent="#accordion">
                        <div class="card-body">
                            <p class="w-text-gray">${d[i].description}</p>
                            <p class="w-text-white"><b>Date:</b> ${datify(d[i].created, false)}</p>
                            <p class="w-text-white"><b>Submission Deadline:</b> ${datify(d[i].deadline, false)}</p>
                            <a href="${d[i].link}" target="_blank" class="link-color">See Project Details</a> 
                            ${d[i].submitted ? `<button class="material-btn sub-btn" data-id="${d[i].id}">View Submission</button>`: `<button class="material-btn sub-btn" data-id="${d[i].id}">Submit Project</button>`}
                        </div>
                    </div>`;
          $(".projects-con").append(temp)
        }

        $(".sub-btn").click(function() {
          let id = $(this).data('id')
          getProjectInfo(id)
        })
      }
      
      $('.preloader').addClass('keep')
    }
    else if(data['status'] == 'error') {
      pushNotification("n_error", data.message, -1, getUserProjects)
    }
  })
  .catch(err => {
    console.log(err);
    pushNotification("n_network", "Kindly check your internet connection", -1, getUserProjects)
  })
}

function getProjectInfo(id) {
  $('.preloader').removeClass('keep')
  let url = `${base_url}courses/get_project_info/?project_id=${id}`;
    var headers = {
        'Authorization': `Token ${auth_token}`,
        'Accept': 'application/json',
    }
    fetch(url, {
        headers: headers
    })
    .then(res => {check_response(res);return res.json()})
    .then(data => {
      console.log(data);
      if(data['status'] == 'success') {
        d = data.data;
        s = data.submission
        $(".project-head").html(d.title)
        
        if(s) {
          $("#submit-detail")[0].reset()
          $("#source").val(s.source_code)
          $("#score").val(s.score)
          $("#comment").val(s.comment)
          $(".pin-container2").show()
        }
        else {
          $("#project-submit-form")[0].reset()
          $("#project-id").val(d.id)
          $(".pin-container1").show()
        }
        $('.preloader').addClass('keep')
      }
      else if(data['status'] == 'error') {
        pushNotification("n_error", data.message, -1, getUser)
      }
      $('.preloader').addClass('keep')
    })
    .catch(err => {
      console.log(err);
      $('.preloader').addClass('keep')
      pushNotification("n_network", "Kindly check your internet connection", -1, getUser)
    })
}

function submitProject() {
  let url = `${base_url}courses/submit_project/`;
  
  let link = $("#sub-link").val()
  let pid = $("#project-id").val()

  if(link.trim() == "") {
    pushNotification("n_warning", "Field cannot be empty", 3000)
    return
  }

  let formData = {
    "link": link,
    "project_id": pid
  }
  
  var headers = {
        'Authorization': `Token ${auth_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    $(".subm-btn").attr('disabled', true).html('Submitting...')
    fetch(url, {
      method:'POST',
      headers: headers,
      body: JSON.stringify(formData)
    })
    .then(res => {check_response(res);return res.json()})
    .then(data => {
      console.log(data);
      if(data['status'] == 'success') {
        $("#project-submit-form")[0].reset()
        $(".pin-container1").hide()
        pushNotification("n_success", data.message, -1)
        getUserProjects()
      }
      else if(data['status'] == 'error') {
        pushNotification("n_error", data.message, -1)
      }
      $(".subm-btn").attr('disabled', false).html('Submit Project')
    })
    .catch(err => {
      console.log(err);
      $(".subm-btn").attr('disabled', false).html('Submit Project')
      pushNotification("n_network", "Kindly check your internet connection", -1)
    })
}