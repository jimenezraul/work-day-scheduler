// Set variable for the object of the work schedule
var timeSchedule = {};

// On document ready, call onLoad function
$(document).ready(function () {
  onLoad();
});

// Create time block elements
var createTimeBlockEl = function (time, textArea) {
  var scheduleDiv = $("<div>").attr({
    id: "schedule-" + time,
    class: "row time-block",
    "data-time": time,
  });
  var colTime = $("<div>").attr("class", "col-2 col-md-1 hour text-right p-3");
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

  // Append elements to the schedule div
  scheduleDiv.append(colTime);
  scheduleDiv.append(colTextArea);
  colSaveBtn.append(button);
  scheduleDiv.append(colSaveBtn);
  $("#timeContainer").append(scheduleDiv);

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
    var blockHour = parseInt($(this).attr("data-time"));
    if (blockHour < currentHour) {
      $(this).addClass("past");
    } else if (blockHour === currentHour) {
      $(this).addClass("present");
    } else {
      $(this).addClass("future");
    }
  });
};

// Create time block
var createTimeBlock = function () {
  var startTime = 9;
  var workHours = 9;
  for (var i = 0; i < workHours; i++) {
    var time = i + startTime;
    var textArea = getSchedule(time);
    if (time <= 12) {
      createTimeBlockEl(time, textArea);
    } else {
      createTimeBlockEl(time, textArea);
    }
  }
};

// Button click
$(".container").on("click", "button", function () {
  var textArea = $(this).siblings("textarea").val().trim();
  var id = $(this).closest(".time-block").attr("data-time");
  var schedulObj = {
    id: id,
    text: textArea,
  };

  if (!checkIfScheduleExists(schedulObj)) {
    timeSchedule.schedule.push(schedulObj);
  }
  saveSchedule();
});

// Save the schedule to local storage
var saveSchedule = function () {
  localStorage.setItem("schedule", JSON.stringify(timeSchedule));
};

// Check if the new schedule already exists
var checkIfScheduleExists = function (schedulObj) {
  var id = schedulObj.id;
  var textArea = schedulObj.text.trim();
  // If text area is empty, remove the schedule from the array
  if (!textArea) {
    for (var i = 0; i < timeSchedule.schedule.length; i++) {
      if (timeSchedule.schedule[i].id == id) {
        timeSchedule.schedule.splice(i, 1);
        return true;
      }
    }
    return true;
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
  createTimeBlock();
};
