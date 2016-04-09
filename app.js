(function() {
  var DEBUG = true;

  var questions = [];
  var currentQuestion = 0;

  initQuestions();

  if (questions.length) {
    renderQuestion(0, prepareDOM);

    $("#nextQuestion").on("click", function() {
      renderQuestion(++currentQuestion, prepareDOM);
    });
  }

  // set up events
  function prepareDOM(question) {
    var textField = $('#textField').get(0);
    textField.selectionStart = question.defaultCursorPosition;
    textField.focus();

    // bind the main key events where a cursor change may occur
    $("#textField").bind("keyup click focus", function() {
      checkCursorPosition(this, question);
    });
  }

  function initQuestions() {
    questions.push(new Question(
      {
        title: "Using LEFT and RIGHT keys only, move the cursor to the position before the \"s\" in \"some\"",
        sampleText: "This is some sample text",
        defaultCursorPosition: 10,
        correctCursorPosition: 8
     }));

     questions.push(new Question(
       {
         title: "Using Cmd + Left, move the cursor to the start of the line",
         sampleText: "This is some more sample text",
         defaultCursorPosition: 14,
         correctCursorPosition: 0
      }));

  }

  function Question(q) {
    this.title = q.title;
    this.sampleText = q.sampleText;
    this.defaultCursorPosition = q.defaultCursorPosition;
    this.correctPositionCursorPosition = q.correctCursorPosition;
  }

  function checkCursorPosition(textField, question) {
    var selectionStart = textField.selectionStart;
    var selectionEnd = textField.selectionEnd;

    var correct = $('#correct');

    if (DEBUG) {
      console.log(selectionStart);
      console.log(selectionEnd);
    }

    var show = (selectionStart == question.correctPositionCursorPosition && selectionEnd == question.correctPositionCursorPosition);
    correct.toggleClass("hidden", !show);
  }

  function renderQuestion(id, callback) {
    var question = questions[id];

    var template = $('#template').html();
    Mustache.parse(template);

    var rendered = Mustache.render(template, {
      questionNo: (id+1),
      question: question.title,
      sampleText: question.sampleText
    });

    $('#questions').html(rendered);
    callback(question);
  }
})();
