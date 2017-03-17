console.log("hello world (from console.log in .js file)");
PlayersList = new Mongo.Collection('players');

// Methods are simply blocks of code that can be triggered from else
// where in an application
Meteor.methods({
    'createPlayer': function(playerNameVar){
        // Checks if first arg is type of data described in 2nd arg
        check(playerNameVar, String);
        console.log("hello world from createPlayer method");
        var currentUserId = Meteor.userId();
        /** checking to see if the “currentUserId” variable returns true. This allows us to determine if the current user is logged-in because, if the current user is not logged-in, then the Meteor.userId function – and therefore, the “currentUserId” variable – will return false. */
        if(currentUserId){
            PlayersList.insert({
            name: playerNameVar,
            score: 0,
            createdBy: currentUserId
            });
        }
    },
    'removePlayer': function(selectedPlayerId){
        check(selectedPlayerId, String);
        var currentUserId = Meteor.userId();
        if(currentUserId){
            PlayersList.remove({ _id: selectedPlayerId, createdBy: currentUserId });
        }
    },
    'updateScore': function(selectedPlayerId, scoreValue){
        check(selectedPlayerId, String);
        check(scoreValue, Number);
        if(Meteor.userId()) {
            PlayersList.update( { _id: selectedPlayerId },
                                { $inc: { score: scoreValue } });
        }
    }
});

if(Meteor.isClient) {
    Meteor.subscribe('thePlayers');

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
            var selectedPlayerId = Session.get('selectedPlayerId');
            Meteor.call('updateScore', selectedPlayerId, -5);
        },
        'click .decrement': function(){
            var selectedPlayerId = Session.get('selectedPlayerId');
            Meteor.call('updateScore', selectedPlayerId, -5);
        }
        'click .remove': function(){
            var selectedPlayerId = Session.get('selectedPlayerId');
            Meteor.call('removePlayer', selectedPlayerId);
        }
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
            var playerNameVar = evt.target.playerName.value;

            /** Here, we’re using this Meteor.call function to call a
             *  method, which simply means to trigger the execution
             *  of the method that we’ve passed through between the
             *  parentheses – in this case, we’re triggering the
             *  “createPlayer” method. This means, whenever the user
             *  adds a player to the list by submitting the form, the
             *  code inside the “createPlayer” will be executed.*/
            Meteor.call('createPlayer', playerNameVar);
            evt.target.playerName.value = ""; //Blanks out form at end
        }
    });
}

if(Meteor.isServer) {
    /** After saving the file, the output will appear inside the
      * command line, only client-side code runs in the Console.
      * B/c code that is executed on the server is inherently trusted. */
    Meteor.publish('thePlayers', function(){
        var  currentUserId = this.userId;
        return PlayersList.find({ createdBy: currentUserId });
    });
}
