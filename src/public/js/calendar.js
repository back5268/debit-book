function calendarMonth() {
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var date = new Date();
  calendar(date);
  document.querySelector(".prev").addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    calendar(date);
  });
  document.querySelector(".next").addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    calendar(date);
  });
  addEvent();
  showEvent();

  function calendar(date) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${window.location.origin}/calendar/showAll`);
    xhr.onload = function () {
      var response = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        let data = response.data;
        showCalendar(data, date);
        showEventDetail();
      } else {
        handleNotification(response.message);
      };
    };
    xhr.send();
  }

  function showCalendar(data, date) {
    var eventTimes = [];
    for (const { time } of data) {
      eventTimes.push(dateTimeHelper(time).split(" ")[0]);
    };
    date.setDate(1);
    const monthDays = document.querySelector(".days");
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    var prevDays = date.getDay();
    var nextDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
    if (prevDays + 7 - nextDays - 1 < 11) nextDays = nextDays - 7;

    document.querySelector(".months span").innerHTML = months[date.getMonth()] + "  " + date.getFullYear();
    let days = "";
    for (let x = prevDays; x > 0; x--) {
      days += `<div class="day"><button type="button" class="prev-date">${prevLastDay - x + 1}</button></div>`;
    }

    for (let i = 1; i <= lastDay; i++) {
      if (i === new Date().getDate() && date.getMonth() === new Date().getMonth()) {
        let eventTime = dateTimeHelper(`${date.getFullYear()}-${date.getMonth() + 1}-${i}`).split(" ")[0];
        let check = eventTimes.find((e) => e === eventTime);
        if (check) {
          days += `<div class="day"><button type="button" data-toggle="modal" class="showEventBtn event" data-target="#showEvent" data-date="${date.getFullYear()}-${date.getMonth() + 1}-${i}" id="today">${i}</button></div>`;
        } else {
          days += `<div class="day"><button type="button" data-toggle="modal" class="showEventBtn" data-target="#showEvent" data-date="${date.getFullYear()}-${date.getMonth() + 1}-${i}" id="today">${i}</button></div>`;
        }
      } else {
        let eventTime = dateTimeHelper(`${date.getFullYear()}-${date.getMonth() + 1}-${i}`).split(" ")[0];
        let check = eventTimes.find((e) => e === eventTime);
        if (check) {
          days += `<div class="day"><button type="button" data-toggle="modal" class="showEventBtn event" data-target="#showEvent" data-date="${date.getFullYear()}-${date.getMonth() + 1}-${i}">${i}</button></div>`;
        } else {
          days += `<div class="day"><button type="button" data-toggle="modal" class="showEventBtn" data-target="#showEvent" data-date="${date.getFullYear()}-${date.getMonth() + 1}-${i}">${i}</button></div>`;
        };
      };
    };

    for (let j = 1; j <= 7 - nextDays - 1; j++) {
      days += `<div class="day"><button type="button" class="next-date">${j}</button></div>`;
      monthDays.innerHTML = days;
    };
  };

  function showEvent() {
    $("#showEvent").on("show.bs.modal", (event) => {
      var button = $(event.relatedTarget);
      let date = button.data("date");
      date = dateTimeHelper(new Date(date)).split(" ")[0];
      document.querySelector("#showEvent h5").innerHTML = date;
    });
  };

  function showEventDetail() {
    document.querySelectorAll(".showEventBtn").forEach((s) => {
      s.addEventListener("click", (e) => {
        let monthYear = document.querySelector(".months span").innerHTML.split(" ");
        const findMonth = (element) => element == monthYear[0];
        let month = months.findIndex(findMonth) + 1;
        let day = e.target.innerHTML;
        let date = `${monthYear[2]}-${month}-${day}`;
        date = dateTimeHelper(new Date(date)).split(" ")[0];

        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${window.location.origin}/calendar/${date}`);
        xhr.onload = function () {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            document.querySelector("#totalRecord").innerHTML = count;
            document.querySelector("#accordion").innerHTML = '';
            if (!data.length) {
              document.querySelector(".center").style.display = "block";
              document.querySelector(".center").innerHTML = 'Chưa có sự kiện nào được thêm!';
            };
            for (let { _id, title, time, noticeTime, description } of data) {
              document.querySelector(".center").style.display = "none";
              time = dateTimeHelper(time);
              noticeTime = dateTimeHelper(noticeTime);
              let card = `<div class="card">
                            <div class="card-header" role="tab">
                                <h3 class="mb-0">
                                    <a data-toggle="collapse" data-target="#${_id}">
                                        ${title}
                                    </a>
                                </h3>
                            </div>
                            <div class="collapse" id="${_id}" data-parent="#accordion">
                                <div class="card-body">
                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label">Thời gian (*) </label>
                                        <div class="col-sm-8">
                                        <input type="text" class="form-control" value="${time}" disabled>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label">Thời gian thông báo (*) </label>
                                        <div class="col-sm-8">
                                        <input type="text" class="form-control" value="${noticeTime}" disabled>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label">Description </label>
                                        <div class="col-sm-8">
                                        <textarea type="text" class="form-control" disabled>${description}</textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
              document.querySelector("#accordion").innerHTML = document.querySelector("#accordion").innerHTML + card;
            };
          };
        };
        xhr.send();
      });
    });
  };

  function addEvent() {
    document.querySelector("#addEventBtn").addEventListener("click", (e) => {
      e.preventDefault();
      const title = document.querySelector("#titleEvent").value;
      const time = document.querySelector("#time").value;
      const noticeTime = document.querySelector("#notice").value;
      const description = document.querySelector("#description").value;
      const dates = dateTimeHelper(new Date(time)).split(" ")[0];

      const data = { title, time, dates, noticeTime, description };
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${window.location.origin}/calendar/add`, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
          handleNotification("Thêm thông tin sự kiện thành công!");
          let data = response.data;
          showCalendar(data, date);
          showEventDetail();
        } else {
          handleNotification(response.message);
        };
      };
      xhr.send(JSON.stringify(data));
    });
  };
}