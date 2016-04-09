(function() {
  var DEBUG = true;

  var questions = [];
  var currentQuestion = 0;

  initQuestions();

  if (questions.length > 0) {
    renderQuestion(0, prepareDOM);

    $("#nextQuestion").on("click", function() {
      renderQuestion(++currentQuestion, prepareDOM);
    });
  }

  // set up events
  function prepareDOM(question) {
    var textField = $('#textField').get(0);
    textField.selectionStart = question._defaultCursorPosition;
    textField.focus();

    // bind the main key events where a cursor change may occur
    $("#textField").bind("keyup click focus", function() {
      checkCursorPosition(this, question);
    });
  }

  function initQuestions() {
    questions.push(new Question("Using LEFT and RIGHT keys only, move the cursor to the position before the \"s\" in \"some\"", "This is some sample text", 10, 8));
    questions.push(new Question("Using Cmd + Left, move the cursor to the start of the line", "This is some more sample text", 14, 0));
  }

  function Question(title, sampleText, defaultCursorPosition, correctCursorPosition) {
    this._title = title;
    this._sampleText = sampleText;
    this._defaultCursorPosition = defaultCursorPosition;
    this._correctPositionCursorPosition = correctCursorPosition;
  }

  function checkCursorPosition(textField, question) {
    var selectionStart = textField.selectionStart;
    var selectionEnd = textField.selectionEnd;

    var correct = $('#correct');

    if (DEBUG) {
      console.log(selectionStart);
      console.log(selectionEnd);
    }

    if (selectionStart == question._correctPositionCursorPosition && selectionEnd == question._correctPositionCursorPosition) {
      removeClassIfExists(correct);
    } else {
      addClassIfNotExists(correct);
    }
  }

  function renderQuestion(id, callback) {
    var question = questions[id];

    var template = $('#template').html();
    Mustache.parse(template);

    var rendered = Mustache.render(template, {
      questionNo: (id+1),
      question: question._title,
      sampleText: question._sampleText
    });

    $('#questions').html(rendered);
    callback(question);
  }

  function removeClassIfExists(jObject) {
    if (jObject.hasClass("hidden")) {
      jObject.removeClass("hidden");
    }
  }

  function addClassIfNotExists(jObject) {
    if (!jObject.hasClass("hidden")) {
      jObject.addClass("hidden");
    }
  }

})();
