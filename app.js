(function() {
  var questions = [];
  var currentQuestion = 0;

  function initApp() {
    initQuestions();

    if (questions.length) {
      new QuestionView($('#questions'), questions[0]);

      $("#nextQuestion").on("click", function() {
        new QuestionView($('#questions'), questions[++currentQuestion]);
      });
    }
  }

  function initQuestions() {
    questions.push(new Question(
      {
        index: 0,
        title: "Using LEFT and RIGHT keys only, move the cursor to the position before the \"s\" in \"some\"",
        sampleText: "This is some sample text",
        defaultCursorPosition: 10,
        correctCursorPosition: 8
     }));

     questions.push(new Question(
       {
         index: 1,
         title: "Using Cmd + Left, move the cursor to the start of the line",
         sampleText: "This is some more sample text",
         defaultCursorPosition: 14,
         correctCursorPosition: 0
      }));

  }

  function BaseView(element, templateData) {
    this.element = $(element);
    this.render(templateData); // Calls the render() of the QuestionView instance (this)
  }

  BaseView.prototype = {
    render: function(templateData) {
      var templateTag = $("#" + this.template).html();
      Mustache.parse(templateTag);
      var rendered = Mustache.render(templateTag, templateData);
      this.element.html(rendered);
      this.afterRender();
    },
  }

  function QuestionView(element, question) {
    this.question = question;
    // Call super constructor using the QuestionView context
    BaseView.call(this, element, {
      questionNo: (this.question.index + 1),
      question: this.question.title,
      sampleText: this.question.sampleText
    });
  }

  // QuestionView extends BaseView
  QuestionView.prototype = Object.create(BaseView.prototype);

  QuestionView.prototype.afterRender = function() {
    this.ui = {};
    this.ui.textField = this.element.find(".text-field");
    this.ui.correct = this.element.find(".correct");

    this.ui.textField.get(0).selectionStart = this.question.defaultCursorPosition;
    this.ui.textField.focus();

    var that = this;

    // bind the main key events where a cursor change may occur
    this.ui.textField.bind("keyup click focus", function() {
      that.checkCursorPosition();
    });
  };

  QuestionView.prototype.checkCursorPosition = function() {
    var selectionStart = this.ui.textField.get(0).selectionStart;
    var selectionEnd = this.ui.textField.get(0).selectionEnd;

    var show = (selectionStart == this.question.correctPositionCursorPosition && selectionEnd == this.question.correctPositionCursorPosition);
    this.ui.correct.toggleClass("hidden", !show);
  };

  QuestionView.prototype.template = "questionTemplate";

  function Question(q) {
    this.index = q.index;
    this.title = q.title;
    this.sampleText = q.sampleText;
    this.defaultCursorPosition = q.defaultCursorPosition;
    this.correctPositionCursorPosition = q.correctCursorPosition;
  }

  initApp();
})();
