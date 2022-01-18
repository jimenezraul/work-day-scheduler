// Set variable for the object of the work schedule
var timeSchedule = {};

// Click on the button to add a new time
$(".container").on("click", "button", function () {
  var textArea = $(this).siblings("textarea").val().trim();
  var id = $(this).closest(".time-block").attr("data-id");
  var schedulObj = {
    id: id,
    textArea: textArea,
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
  var textArea = schedulObj.textArea;
  if (timeSchedule.schedule.length > 0) {
    for (var i = 0; i < timeSchedule.schedule.length; i++) {
      if (timeSchedule.schedule[i].id === id) {
        timeSchedule.schedule[i].textArea = textArea;
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
  }
};

// Call the onLoad function
onLoad();
