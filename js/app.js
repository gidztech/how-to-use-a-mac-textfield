(function() {
  var questions = [];
  var appView = null;
  var questionView = null;

  function initApp() {
    initQuestions();
    appView = new AppView($('.app-container'));
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

  function ScrollQuestion(q) {
    this.correctScrollPosition = q.correctScrollPosition;

    // Call the super constructor (BaseQuestion) using the ScrollQuestion context as "this"
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
  // ScrollQuestion extends BaseQuestion
  ScrollQuestion.prototype = Object.create(BaseQuestion.prototype);
  ScrollQuestion.prototype.constructor = ScrollQuestion;
  // ContentQuestion extends BaseQuestion
  ContentQuestion.prototype = Object.create(BaseQuestion.prototype);
  ContentQuestion.prototype.constructor = ContentQuestion;

  function initQuestions() {
    var SAMPLE_TEXT = "This is some more sample text";
    var NEW_LINE = "\n"

    this.getNextIndex = function() {
      return questions.length;
    }

    questions.push(new CursorQuestion({
      index: this.getNextIndex(),
      title: "Using LEFT and RIGHT keys only, move the cursor to the position before the \"s\" in \"some\"",
      value: "This is some sample text",
      defaultCursorPosition: 10,
      correctCursorPosition: 8
    }));

    questions.push(new CursorQuestion({
        index: this.getNextIndex(),
        title: "Using Cmd + Left/Right, move the cursor to the start of the line",
        value: SAMPLE_TEXT,
        defaultCursorPosition: 14,
        correctCursorPosition: 0
    }));

    questions.push(new SelectionQuestion({
        index: this.getNextIndex(),
        title: "Using Cmd + Shift + Right, select all text to the right of the space before \"sample\"",
        value: SAMPLE_TEXT,
        defaultCursorPosition: 18,
        correctSelectedRange: {
            start: 18,
            end: 29
        }
    }));
    questions.push(new CursorQuestion({
        index: this.getNextIndex(),
        title: "Using Alt + Right, jump to the start of the word \"more\"",
        value: SAMPLE_TEXT,
        defaultCursorPosition: 25,
        correctCursorPosition: 13
    }));
    questions.push(new SelectionQuestion({
        index: this.getNextIndex(),
        title: "Using Alt + Shift + Left, select \"some more\"",
        value: SAMPLE_TEXT,
        defaultCursorPosition: 17,
        correctSelectedRange: {
            start: 8,
            end: 17
        }
    }));
    questions.push(new CursorQuestion({
        index: this.getNextIndex(),
        title: "Using Cmd + Down, jump to the end of the document",
        value: SAMPLE_TEXT + NEW_LINE + SAMPLE_TEXT,
        defaultCursorPosition: 0,
        correctCursorPosition: 59
    }));
    questions.push(new ContentQuestion({
        index: this.getNextIndex(),
        title: "Using Ctrl + K, delete the first line and the empty line left behind",
        value: SAMPLE_TEXT + NEW_LINE + SAMPLE_TEXT,
        defaultCursorPosition: 0,
        correctValue: SAMPLE_TEXT
    }));
    questions.push(new ContentQuestion({
        index: this.getNextIndex(),
        title: "Using Ctrl + Y, yank the deleted text back",
        value: SAMPLE_TEXT,
        defaultCursorPosition: 0,
        correctValue: SAMPLE_TEXT + NEW_LINE + SAMPLE_TEXT
    }));
    questions.push(new SelectionQuestion({
        index: this.getNextIndex(),
        title: "Using Cmd + A, select all the text",
        value: SAMPLE_TEXT + NEW_LINE + SAMPLE_TEXT,
        defaultCursorPosition: 0,
        correctSelectedRange: {
            start: 0,
            end: 59
        }
    }));
    questions.push(new ContentQuestion({
        index: this.getNextIndex(),
        title: "Using Cmd + X, cut the word \"more\"",
        value: SAMPLE_TEXT,
        defaultCursorPosition: 10,
        correctValue: SAMPLE_TEXT.replace(" more", "")
    }));
    questions.push(new ContentQuestion({
        index: this.getNextIndex(),
        title: "Using Cmd + V, paste the word \"more\" back in the original place",
        value: SAMPLE_TEXT.replace(" more", ""),
        defaultCursorPosition: 10,
        correctValue: SAMPLE_TEXT
    }));
    questions.push(new ContentQuestion({
        index: this.getNextIndex(),
        title: "Using Fn + Backspace, delete until only the words \"sample text\" shows",
        value: SAMPLE_TEXT,
        defaultCursorPosition: 0,
        correctValue: SAMPLE_TEXT.replace("This is some more ", "")
    }));
    questions.push(new ContentQuestion({
        index: this.getNextIndex(),
        title: "Using Alt + Backspace, delete until only the words \"more sample text\" shows",
        value: SAMPLE_TEXT,
        defaultCursorPosition: 13,
        correctValue: SAMPLE_TEXT.replace("This is some ", "")
    }));
    questions.push(new SelectionQuestion({
        index: this.getNextIndex(),
        title: "Double tap on the word \"sample\" to select it",
        value: SAMPLE_TEXT,
        defaultCursorPosition: 0,
        correctSelectedRange: {
            start: 18,
            end: 24
        }
    }));
    questions.push(new SelectionQuestion({
        index: this.getNextIndex(),
        title: "Tripple tap on a word to select the whole line",
        value: SAMPLE_TEXT,
        defaultCursorPosition: 0,
        correctSelectedRange: {
            start: 0,
            end: 29
        }
    }));
    questions.push(new ScrollQuestion({
        index: this.getNextIndex(),
        title: "Using Fn + Down, scroll the text area",
        value:
          SAMPLE_TEXT + NEW_LINE +
          SAMPLE_TEXT + NEW_LINE +
          SAMPLE_TEXT + NEW_LINE +
          SAMPLE_TEXT + NEW_LINE +
          SAMPLE_TEXT + NEW_LINE +
          SAMPLE_TEXT + NEW_LINE +
          SAMPLE_TEXT + NEW_LINE +
          SAMPLE_TEXT + NEW_LINE +
          SAMPLE_TEXT + NEW_LINE +
          SAMPLE_TEXT + NEW_LINE,
        defaultCursorPosition: 0,
        correctScrollPosition: 85
    }));
  }

  /* BaseView Definition */
  function BaseView(element) {
    this.element = $(element);
    this.render();
  }

  BaseView.prototype = {
    render: function() {
      var templateTag = $("#" + this.template).html();
      Mustache.parse(templateTag);
      var rendered = Mustache.render(templateTag, this.getTemplateData());
      this.element.html(rendered);
      this.afterRender();
    },
    afterRender: function() {
      console.log("Default afterRender");
    },
    getTemplateData: function() {
      return {};
    }
  }

  /* QuestionView Definition*/
  function QuestionView(element, question, onStateChange) {
    this.question = question;
    this.onStateChange = onStateChange;

    // Call the super constructor (BaseView) using the QuestionView context as "this"
    BaseView.call(this, element);
  }

  function AppView(element) {
    BaseView.call(this, element, {});
  }

  // AppView extends BaseView
  AppView.prototype = Object.create(BaseView.prototype);
  AppView.prototype.constructor = AppView;
  AppView.prototype.template = "appTemplate";

  AppView.prototype.onStateChange = function(show, callback) {
    var moreQuestionsExist = (questions[this.currentQuestionIndex + 1] !== undefined);
    // show = true, moreQuestionsExist = true
      // false || false => false => visible
    // show = true, moreQuestionsExist = false
      // false || true => true => hidden
    // show = false, moreQuestionsExist = true
      // true || false => true => hidden
    // show = false, moreQuestionsExist = false
      // true || true => hidden
    this.ui.nextQuestion.get(0).disabled = (!show || !moreQuestionsExist);

    if (show) {
      if (!moreQuestionsExist) {
        this.ui.complete.toggleClass("hidden", false);
      } else {
        if (callback) callback(this); // pass the AppView to the callback so we can call events on it later, probably bad practice
      }
    }
  }
  // AppView implementation of afterRender
  AppView.prototype.afterRender = function() {
    this.ui = {};
    this.currentQuestionIndex = 0;
    this.ui.prevQuestion = this.element.find(".prevQuestion");
    this.ui.nextQuestion = this.element.find(".nextQuestion");
    this.ui.startOver = this.element.find(".startOver");
    this.ui.complete = this.element.find(".complete");

    var that = this;

    if (questions.length) {
      questionView = new QuestionView($('#questions'), questions[this.currentQuestionIndex], this.onStateChange.bind(this));

      this.ui.prevQuestion.on("click", function() {
        if (that.currentQuestionIndex > 0) {
          questionView.showQuestion(questions[--that.currentQuestionIndex]);
          that.ui.prevQuestion.get(0).disabled = (that.currentQuestionIndex - 1 < 0);
        }
      });

      this.ui.nextQuestion.on("click", function() {
        questionView.showQuestion(questions[++that.currentQuestionIndex]);
        that.ui.nextQuestion.get(0).disabled = true;
        that.ui.prevQuestion.get(0).disabled = false;
      });

      this.ui.startOver.on("click", function() {
        that.currentQuestionIndex = 0;
        questionView.showQuestion(questions[that.currentQuestionIndex]);
        that.ui.nextQuestion.get(0).disabled = true;
        that.ui.prevQuestion.get(0).disabled = true;
        that.ui.complete.toggleClass("hidden", true);
      });
    }
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

    this.ui.textField.get(0).selectionStart = this.question.defaultCursorPosition;
    this.ui.textField.focus();

    var that = this;

    // Bind the main key events where a cursor change may occur
    this.ui.textField.bind("keyup click focus", function() {

      // Could also use 'instanceof' since we have a constructor
      if (CursorQuestion.prototype.isPrototypeOf(that.question)) {
        that.checkCursorPosition();
      }
      if (SelectionQuestion.prototype.isPrototypeOf(that.question)) {
        that.checkSelection();
      }
      if (ScrollQuestion.prototype.isPrototypeOf(that.question)) {
        that.checkScrollPosition();
      }
      if (ContentQuestion.prototype.isPrototypeOf(that.question)) {
        that.checkContent();
      }
    });
  };

  QuestionView.prototype.getTemplateData = function() {
    return {
      questionNo: (this.question.index + 1),
      question: this.question.title,
      value: this.question.value
    }
  }

  QuestionView.prototype.showQuestion = function(question) {
    this.question = question;
    this.render();
  }

  QuestionView.prototype.updateUI = function(show) {
    var that = this;
    this.ui.correct.toggleClass("hidden", !show);

    this.onStateChange(show, function(app) {
      // executed by onStateChange on the AppView
      // add an ENTER key press event to trigger next question
      if (show) {
        var existingEvents = $._data(that.ui.textField.get(0), "events");

        if (existingEvents.keypress === undefined) {
          // if user gets correct answer and interacts with textfield in any other way than ENTER, it would be adding
          // the handler twice, hence why we only add it if it doesn't already existingEvents
          // when new question is loaded, textField is re-rendered so events are lost
          that.ui.textField.on("keypress", function (event) {
            if ((event.keyCode || event.which) == 13) {
              app.ui.nextQuestion.click();
              event.preventDefault();
              return false;
            }
          });
        }
      }
    });
  }

  QuestionView.prototype.checkCursorPosition = function() {
    var selectionStart = this.ui.textField.get(0).selectionStart;
    var selectionEnd = this.ui.textField.get(0).selectionEnd;

    var show = (selectionStart == this.question.correctCursorPosition && selectionEnd == this.question.correctCursorPosition);
    this.updateUI(show);
  }

  QuestionView.prototype.checkSelection = function() {
    var selectionStart = this.ui.textField.get(0).selectionStart;
    var selectionEnd = this.ui.textField.get(0).selectionEnd;

    var show = (selectionStart == this.question.correctSelectedRange.start && selectionEnd == this.question.correctSelectedRange.end);
    this.updateUI(show);
  }

  QuestionView.prototype.checkScrollPosition = function() {
    var scrollTop = this.ui.textField.get(0).scrollTop;

    var show = (scrollTop == this.question.correctScrollPosition);
    this.updateUI(show);
  }

  QuestionView.prototype.checkContent = function() {
    var currentContent = this.ui.textField.get(0).value;

    var show = (currentContent == this.question.correctValue);
    this.updateUI(show);
  }

  initApp();
})();
