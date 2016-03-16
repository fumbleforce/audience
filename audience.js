Question = new Mongo.Collection("question");

if (Meteor.isClient) {
  Session.setDefault('id', ~~(Math.random() * 10000));
  Session.set("questions", 3);
  
  Template.questions.helpers({
    hasQuestions: () => Question.find().count() > 0,
    questions () {
      return Question.find({}, { sort: { votes: -1 } });
    }
  });
  
  Template.question.helpers({
    hasVoted () {
      return _.contains(this.voters, Session.get("id"));
    }
  });
  
  Template.question.events({
    'click #vote' (e) {
      Question.update(this._id, {
        $inc: { votes: 1 },
        $push: { voters: Session.get("id") }
      });
    }
  });
  
  Template.ask.helpers({
    questionsLeft () { return Session.get("questions") }
  });
  
  Template.ask.events({
    'keyup #question-input' (e) {
      if (e.keyCode === 13) {
        Question.insert({
          text: $(e.currentTarget).val(),
          asker: Session.get("id"),
          voters: [],
          votes: 0
        });
        $(e.currentTarget).val("");
        Session.set("questions", Session.get("questions") - 1);
      }
    }
  });
}
