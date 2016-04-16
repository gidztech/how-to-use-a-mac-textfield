(function() {
  var questions = [];
  var currentQuestionIndex = 0;
  var nextQuestion = $(".nextQuestion");

  function initApp() {
    initQuestions();

    if (questions.length) {
      new QuestionView($('#questions'), questions[0]);

      nextQuestion.on("click", function() {
        new QuestionView($('#questions'), questions[++currentQuestionIndex]);
        nextQuestion.toggleClass("hidden", true);
      });
    }
  }

  function BaseQuestion(q) {
    this.index = q.index;
    this.title = q.title;
    this.value = q.value;

    this.defaultCursorPosition = q.defaultCursorPosition;
  }

  function CursorQuestion(q) {
    this.correctCursorPosition = q.correctCursorPosition;

    // Call the super constructor (BaseQuestion) using the CursorQuestion context as "this"
    BaseQuestion.call(this, q);
  }

  function SelectionQuestion(q) {
    this.selectedRange = q.selectedRange;

    // Call the super constructor (BaseQuestion) using the SelectionQuestion context as "this"
    BaseQuestion.call(this, q);
  }

  // CursorQuestion extends BaseQuestion
  CursorQuestion.prototype = Object.create(BaseQuestion.prototype);
  CursorQuestion.prototype.constructor = CursorQuestion;
  // SelectionQuestion extends BaseQuestion
  SelectionQuestion.prototype = Object.create(BaseQuestion.prototype);
  SelectionQuestion.prototype.constructor = SelectionQuestion;


  function initQuestions() {
    questions.push(new CursorQuestion(
      {
        index: 0,
        title: "Using LEFT and RIGHT keys only, move the cursor to the position before the \"s\" in \"some\"",
        value: "This is some sample text",
        defaultCursorPosition: 10,
        correctCursorPosition: 8
     }));

     questions.push(new CursorQuestion(
       {
         index: 1,
         title: "Using Cmd + Left/Right, move the cursor to the start of the line",
         value: "This is some more sample text",
         defaultCursorPosition: 14,
         correctCursorPosition: 0
      }));

      questions.push(new SelectionQuestion(
        {
          index: 2,
          title: "Using Cmd + Shift + Right, select all text to the right of the space before \"sample\"",
          value: "This is some more sample text",
          defaultCursorPosition: 18,
          selectedRange: { start: 18, end: 29}
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
    this.ui.nextQuestion = this.element.find(".nextQuestion");

    this.ui.textField.get(0).selectionStart = this.question.defaultCursorPosition;
    this.ui.textField.focus();

    var that = this;

    // bind the main key events where a cursor change may occur
    this.ui.textField.bind("keyup click focus", function() {
      var currentQuestion = questions[currentQuestionIndex];

      if (currentQuestion.constructor == CursorQuestion) {
        that.checkCursorPosition();
      }
      if (currentQuestion.constructor == SelectionQuestion) {
        that.checkCurrentSelection();
      }
    });
  };

  QuestionView.prototype.checkCurrentSelection = function() {
    console.log("Test");
  }

  QuestionView.prototype.checkCursorPosition = function() {
    var selectionStart = this.ui.textField.get(0).selectionStart;
    var selectionEnd = this.ui.textField.get(0).selectionEnd;

    var show = (selectionStart == this.question.correctCursorPosition && selectionEnd == this.question.correctCursorPosition);
    var moreQuestionsExist = (questions[currentQuestionIndex + 1] !== undefined);
    this.ui.correct.toggleClass("hidden", !show);
    // show = true, moreQuestionsExist = true
      // false || false => false => visible
    // show = true, moreQuestionsExist = false
      // false || true => true => hidden
    // show = false, moreQuestionsExist = true
      // true || false => true => hidden
    // show = false, moreQuestionsExist = false
      // true || true => hidden
    nextQuestion.toggleClass("hidden", (!show || !moreQuestionsExist));
  };

  initApp();
})();
