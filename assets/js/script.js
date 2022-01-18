// Set variable for the object of the work schedule
var timeSchedule = {};

// Create elements for the schedule
var createScheduleElements = function (time, textArea) {
  var scheduleDiv = $("<div>").attr({
    id: "schedule-" + time,
    class: "row time-block",
    "data-id": time,
  });
  var colTime = $("<div>").attr("class", "col-2 col-md-1 hour text-right");
  var colTextArea = $("<textarea>").attr(
    "class",
    "col-8 col-md-10 description"
  );
  var colSaveBtn = $("<button>").attr("class", "btn col-2 col-md-1 saveBtn");
  var button = $("<i>").attr("class", "fas fa-save");

  // If the text area is not empty, set the text area to the textArea
  if (textArea) {
    colTextArea.append(textArea);
  }

  // Check time to add am or pm
  if (time < 12) {
    colTime.text(time + "am");
  } else if (time === 12) {
    colTime.text(time + "pm");
  } else {
    colTime.text(time - 12 + "pm");
  }
  scheduleDiv.append(colTime);
  scheduleDiv.append(colTextArea);
  colSaveBtn.append(button);
  scheduleDiv.append(colSaveBtn);
  $(".container").append(scheduleDiv);

  // Set the color of the time block
  setTimeBlockColor();
};

// Get schedule from local storage
var getSchedule = function (time) {
  for (var i = 0; i < timeSchedule.schedule.length; i++) {
    if (timeSchedule.schedule[i].id == time) {
      return timeSchedule.schedule[i].text;
    }
  }
  return "";
};

// Set time block color
var setTimeBlockColor = function () {
  var currentHour = moment().hour();
  $(".time-block").each(function () {
    var blockHour = parseInt($(this).attr("data-id"));
    if (blockHour < currentHour) {
      $(this).addClass("past");
    } else if (blockHour === currentHour) {
      $(this).addClass("present");
    } else {
      $(this).addClass("future");
    }
  });
};

// Create the schedule
var createSchedule = function () {
  for (var i = 0; i < 9; i++) {
    var time = i + 9;
    var textArea = getSchedule(time);
    if (time <= 12) {
      createScheduleElements(time, textArea);
    } else {
      createScheduleElements(time, textArea);
    }
  }
};

// Click on the button to add a new time
$(".container").on("click", "button", function () {
  var textArea = $(this).siblings("textarea").val().trim();
  var id = $(this).closest(".time-block").attr("data-id");
  var schedulObj = {
    id: id,
    text: textArea,
  };

  if (!checkIfScheduleExists(schedulObj)) {
    timeSchedule.schedule.push(schedulObj);
  }
  saveSchedule();
});

// Focus on the text area
$(".container").on("click", "textarea", function () {
  $(this).find("textarea").focus();
});

// Save the schedule to local storage
var saveSchedule = function () {
  localStorage.setItem("schedule", JSON.stringify(timeSchedule));
};

// Check if the new schedule already exists
var checkIfScheduleExists = function (schedulObj) {
  var id = schedulObj.id;
  var textArea = schedulObj.text;
  if (!textArea) {
    for (var i = 0; i < timeSchedule.schedule.length; i++) {
      if (timeSchedule.schedule[i].id == id) {
        timeSchedule.schedule.splice(i, 1);
        return true;
      }
    }
  }

  if (timeSchedule.schedule.length > 0) {
    for (var i = 0; i < timeSchedule.schedule.length; i++) {
      if (timeSchedule.schedule[i].id === id) {
        timeSchedule.schedule[i].text = textArea;
        return true;
      }
    }
  }
  return false;
};

// Set the current date
var setTodaysDate = function () {
  var todayDate = moment().format("dddd, MMM Do YYYY");
  $("#currentDay").html(todayDate);
};

// Get current schedule from local storage on page load
var onLoad = function () {
  setTodaysDate();
  var storedSchedule = JSON.parse(localStorage.getItem("schedule"));
  if (!storedSchedule) {
    timeSchedule = {
      schedule: [],
    };
  } else {
    timeSchedule = storedSchedule;
  }
  createSchedule();
};

// Call the onLoad function
onLoad();
