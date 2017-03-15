console.log("hello world (from console.log in .js file)");
PlayersList = new Mongo.Collection('players');



if(Meteor.isClient) {
    // upsert used to rebuild the missing name field in Bill and Bob's
    // documents
    // PlayersList.upsert({ _id:"p74YGwgCukGaLAhwk" }, { $set: { name: // "Bill", score: [30] }});
    // PlayersList.upsert({ _id:"YfTuMTJMaz85P4H" }, { $set: { name: // "Bob", score: [30] }});

    // PlayersList.upsert({ score: "0" }, { $set: { score: [40] }});

    // Used remove to remove an document
    // PlayersList.remove({ _id: "fmYfTuMTJMaz85P4H" });

    console.log("Hello client");

    Template.leaderboard.helpers({
        'player': function(){
            var currentUserId = Meteor.userId();
            return PlayersList.find({ createdBy: currentUserId },
                                    { sort: {score: -1, name: 1} });
        },
        'numPlayers': function(){
            return PlayersList.find().count();
        },
        'selectedClass': function(){
            var playerId = this._id;
            var selectedPlayerId = Session.get('selectedPlayerId');
            if(this._id == selectedPlayerId){
                return "selected";
            }
        },
        'selectedPlayerIdFnct': function(){
            return (Session.get('selectedPlayerId'));
        },
        'selectedPlayer': function(){
            var selectedPlayerId = Session.get('selectedPlayerId');
            return PlayersList.findOne({ _id: selectedPlayerId });
        }
    });

    Template.leaderboard.events({
        'click .player': function(){
            // Setting the value of the “selectedPlayer” session to the unique ID of the player that the user has just clicked.
            Session.set('selectedPlayerId', this._id);
        },
        'click .increment': function(){
            // $inc is like +=
            PlayersList.update({ _id: Session.get('selectedPlayerId') }, { $inc: { score: 5 } });
        },
        'click .decrement': function(){
            // First arg of update method is to select which dictionary
            // in PlayersList collection to change. $inc is like -=
            PlayersList.update({ _id: Session.get('selectedPlayerId') }, { $inc: { score: -5 } });
        },
        // When the remove button is clicked on a chat message, delete
        // that message. Doesn't work however.
        'click .remove': function(){
            PlayersList.remove(Session.get('selectedPlayerId'));
        },
    });


    Template.addPlayerForm.events({
        /** Event that triggers the execution of code whenever a user
         * submits the form we just created. When an event is
         * triggered from within a Meteor application, we’re able to
         * access information about that event as it occurs. Whatever
         * keyword is passed into the parentheses as the first
         * argument of the event’s function becomes a reference for
         * that event. This keeps refreshing the page when it is
         * submitted so we have to put evt.preventDefault(); */
        'submit form': function(evt){
            evt.preventDefault();
            var playerNameVar = event.target.playerName.value;
            var currentUserId = Meteor.userId();
            PlayersList.insert({
                name: playerNameVar,
                score: 0,
                createdBy: currentUserId
            });
            evt.target.playerName.value = "";
        }
    });
}

if(Meteor.isServer) {
    console.log("Hello server");
}
