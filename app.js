(function() {
  var questions = [];
  var currentQuestionIndex = 0;
  var nextQuestion = $(".nextQuestion");
  var SAMPLE_TEXT = "This is some more sample text";
  var NEW_LINE = "\n"

  function initApp() {
    initQuestions();

    if (questions.length) {
      new QuestionView($('#questions'), questions[currentQuestionIndex]);

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
    this.correctSelectedRange = q.correctSelectedRange;

    // Call the super constructor (BaseQuestion) using the SelectionQuestion context as "this"
    BaseQuestion.call(this, q);
  }

  function ContentQuestion(q) {
    this.correctValue = q.correctValue;

    // Call the super constructor (BaseQuestion) using the SelectionQuestion context as "this"
    BaseQuestion.call(this, q);
  }

  // CursorQuestion extends BaseQuestion
  CursorQuestion.prototype = Object.create(BaseQuestion.prototype);
  CursorQuestion.prototype.constructor = CursorQuestion;
  // SelectionQuestion extends BaseQuestion
  SelectionQuestion.prototype = Object.create(BaseQuestion.prototype);
  SelectionQuestion.prototype.constructor = SelectionQuestion;
  // ContentQuestion extends BaseQuestion
  ContentQuestion.prototype = Object.create(BaseQuestion.prototype);
  ContentQuestion.prototype.constructor = ContentQuestion;

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
         value: SAMPLE_TEXT,
         defaultCursorPosition: 14,
         correctCursorPosition: 0
      }));

      questions.push(new SelectionQuestion(
        {
          index: 2,
          title: "Using Cmd + Shift + Right, select all text to the right of the space before \"sample\"",
          value: SAMPLE_TEXT,
          defaultCursorPosition: 18,
          correctSelectedRange: { start: 18, end: 29}
       }));
       questions.push(new CursorQuestion(
         {
           index: 3,
           title: "Using Alt + Right, jump to the start of the word \"more\"",
           value: SAMPLE_TEXT,
           defaultCursorPosition: 25,
           correctCursorPosition: 13
        }));
        questions.push(new SelectionQuestion(
          {
            index: 4,
            title: "Using Alt + Shift + Left, select \"some more\"",
            value: SAMPLE_TEXT,
            defaultCursorPosition: 17,
            correctSelectedRange: { start: 8, end: 17}
         }));
         questions.push(new CursorQuestion(
           {
             index: 5,
             title: "Using Cmd + Down, jump to the end of the document",
             value: SAMPLE_TEXT +  NEW_LINE + SAMPLE_TEXT,
             defaultCursorPosition: 0,
             correctCursorPosition: 59
          }));
          questions.push(new ContentQuestion(
            {
              index: 6,
              title: "Using Ctrl + K, delete the first line and the empty line left behind",
              value: SAMPLE_TEXT +  NEW_LINE + SAMPLE_TEXT,
              defaultCursorPosition: 0,
              correctValue: SAMPLE_TEXT
           }));
           questions.push(new ContentQuestion(
             {
               index: 7,
               title: "Using Ctrl + Y, yank the deleted text back",
               value: SAMPLE_TEXT,
               defaultCursorPosition: 0,
               correctValue: SAMPLE_TEXT + NEW_LINE + SAMPLE_TEXT
            }));
            questions.push(new SelectionQuestion(
              {
                index: 8,
                title: "Using Cmd + A, select all the text",
                value: SAMPLE_TEXT + NEW_LINE + SAMPLE_TEXT,
                defaultCursorPosition: 0,
                correctSelectedRange: { start: 0, end: 59}
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
  QuestionView.prototype.constructor = QuestionView;
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

    // Bind the main key events where a cursor change may occur
    this.ui.textField.bind("keyup click focus", function() {
      var currentQuestion = questions[currentQuestionIndex];

      // Could also use 'instanceof' since we have a constructor
      if (CursorQuestion.prototype.isPrototypeOf(currentQuestion)) {
        that.checkCursorPosition();
      }
      if (SelectionQuestion.prototype.isPrototypeOf(currentQuestion)) {
        that.checkSelection();
      }
      if (ContentQuestion.prototype.isPrototypeOf(currentQuestion)) {
        that.checkContent();
      }
    });
  };

  QuestionView.prototype.checkSelection = function() {
    var selectionStart = this.ui.textField.get(0).selectionStart;
    var selectionEnd = this.ui.textField.get(0).selectionEnd;

    this.toggleUI(selectionStart == this.question.correctSelectedRange.start && selectionEnd == this.question.correctSelectedRange.end)
  }

  QuestionView.prototype.checkCursorPosition = function() {
    var selectionStart = this.ui.textField.get(0).selectionStart;
    var selectionEnd = this.ui.textField.get(0).selectionEnd;

    this.toggleUI(selectionStart == this.question.correctCursorPosition && selectionEnd == this.question.correctCursorPosition);
  }

  QuestionView.prototype.checkContent = function() {
    var currentContent = this.ui.textField.get(0).value;
    this.toggleUI(currentContent == this.question.correctValue);
  }

  QuestionView.prototype.toggleUI = function(show) {
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
  }

  initApp();
})();
