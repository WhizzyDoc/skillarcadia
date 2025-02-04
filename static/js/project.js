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
                            ${d[i].submitted ? `<button class="material-btn">View Submission</button>`: `<button class="material-btn">Submit Project</button>`}
                        </div>
                    </div>`;
          $(".projects-con").append(temp)
        }
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