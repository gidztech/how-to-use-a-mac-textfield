(function() {
  var questions = [];
  var currentQuestion = 0;

  function initApp() {
    initQuestions();

    if (questions.length) {
      new QuestionView($('#questions'), questions[0]);

      $("#nextQuestion").on("click", function() {
        if (questions[currentQuestion + 1] !== undefined) {
          new QuestionView($('#questions'), questions[++currentQuestion]);
        }
      });
    }
  }

  function Question(q) {
    this.index = q.index;
    this.title = q.title;
    this.value = q.value;
    this.defaultCursorPosition = q.defaultCursorPosition;
    this.correctCursorPosition = q.correctCursorPosition;
  }

  function initQuestions() {
    questions.push(new Question(
      {
        index: 0,
        title: "Using LEFT and RIGHT keys only, move the cursor to the position before the \"s\" in \"some\"",
        value: "This is some sample text",
        defaultCursorPosition: 10,
        correctCursorPosition: 8
     }));

     questions.push(new Question(
       {
         index: 1,
         title: "Using Cmd + Left/Right, move the cursor to the start of the line",
         value: "This is some more sample text",
         defaultCursorPosition: 14,
         correctCursorPosition: 0
      }));

      questions.push(new Question(
        {
          index: 2,
          title: "Using Cmd + Shift + Right, select all text to the right of the space before \"sample\"",
          value: "This is some more sample text",
          defaultCursorPosition: 18,
          correctCursorPosition: 0
       }));

  }

  /* BaseView Definition */
  function BaseView(element, templateData) {
    this.element = $(element);
    this.render(templateData);
  }

  BaseView.prototype = {
    render: function(templateData) {
      var templateTag = $("#" + this.template).html();
      Mustache.parse(templateTag);
      var rendered = Mustache.render(templateTag, templateData);
      this.element.html(rendered);
      this.afterRender();
    },
    afterRender: function() {
      console.log("Default afterRender");
    }
  }

  /* QuestionView Definition*/
  function QuestionView(element, question) {
    this.question = question;
    // Call the super constructor (BaseView) using the QuestionView context as "this"
    BaseView.call(this, element, {
      questionNo: (this.question.index + 1),
      question: this.question.title,
      value: this.question.value
    });
  }

  // QuestionView extends BaseView
  QuestionView.prototype = Object.create(BaseView.prototype);
  QuestionView.prototype.template = "questionTemplate";

  // QuestionView implementation of afterRender
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

    var show = (selectionStart == this.question.correctCursorPosition && selectionEnd == this.question.correctCursorPosition);
    this.ui.correct.toggleClass("hidden", !show);
  };

  initApp();
})();
