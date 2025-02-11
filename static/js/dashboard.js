// For Admin
//$('.preloader').addClass('keep')
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
        $('.user_name').html(`${d.firstName} ${d.lastName}&nbsp;&nbsp;&nbsp;<span class="user_level_3">Cohort ${d.cohort}</span>`)
        $('.user_id').html(`Profile ID: ${d.profileId}`)
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

  function getUserCourses() {
    let url = `${base_url}courses/get_user_courses/`;
    $(".course-list-con").empty();
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
          <div class="saving-item w-margin-bottom" data-id="${d[i].id}">
            <img src="${base_image_url}${d[i].image}" alt="">
            <div class="icd">
              <div class="h5 w-bold-x">${d[i].title}</div>
              <p class="w-text-gray">
                ${truncateWord(d[i].description, 50)}
              </p>
            </div>
            <div class="ic"><i class="fa fa-chevron-right"></i></div>
          </div>`;
          $(".course-list-con").append(temp)
        }

        $('.preloader').addClass('keep')

        $(".saving-item").click(function() {
          let id = $(this).data('id')
          getCourseModules(id)
        })
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

  getUser()
  getUserCourses()


  function getCourseModules(id) {
    let url = `${base_url}courses/get_course_modules/?course_id=${id}`;
    
    $('.preloader').removeClass('keep')

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
        let d = data.data;
        let c = data.course;
        $(".modules-con").empty()
        $(".course-title").html(`${c.title} Modules`)
        let temp2  = `
        <img src="${base_image_url}${c.image}" alt="" />
        <div>
          <p class="w-text-gray" style="font-size:12px;">${c.description}</p>
          <div class="h5 w-text-white"><b>By: </b>${c.tutor.name}</div>
        </div>`;
        $(".module-banner").html(temp2);
        if(d.length == 0) {
          $(".modules-con").append(`<h5 class="w-padding w-text-white">No modules yet for ${c.title}</h5>`)
        }
        else {
          for(let i in d) {
            ic = ``;
              if(d[i].completed) {
                  ic = `<i class="fa fa-check w-text-green"></i>`;
              }
              else {
                  ic = `<i class="fa fa-clock-o w-text-orange"></i>`;
              }
              let resources = ``
              if(d[i].resources.length > 0) {
                for(let j=0; j<d[i].resources.length; j++) {
                  resources += `<a href="${d[i].resources[j]}" target="_blank"><li class="link-color">${d[i].resources[j]}</li></a>`
                }
              }
              else {
                resources = `<li class="w-text-white">No resources provided</li>`
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
                          <div class="h5 text-color">Resources</div>
                          <ul>${resources}</ul>
                          ${d[i].material ? `<a href="${base_image_url}${d[i].material}" download>
                          <button class="material-btn">Download Material</button>
                          </a>`: '<p class="w-text-white">Material not available yet.</p>'}
                      </div>
                  </div>`;
            $(".modules-con").append(temp)
          }
        }
        $(".modules_con").addClass("active")
      }
      else if(data['status'] == 'error') {
        pushNotification("n_error", data.message, 3000)
      }
      $('.preloader').addClass('keep')
    })
    .catch(err => {
      console.log(err);
      pushNotification("n_network", "Kindly check your internet connection", 3000)
    })
  }


$(document).ready(function() {
  
      
      $(".dash-savings-con").owlCarousel({
        margin: 20,
        loop: true,
        autoplay: false,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
        0:{
            items:1,
            nav: false
        },
        600:{
            items:1,
            nav: false
        },
        1000:{
            items:2,
            nav: false
        }
        }
    });
})


//var get_new_notes = setInterval(getNewNotifications, 3000)