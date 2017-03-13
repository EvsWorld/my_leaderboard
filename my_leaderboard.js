console.log("hello world (from console.log in .js file)");
PlayersList = new Mongo.Collection('players');

if(Meteor.isClient) {
    console.log("Hello client");
    Template.leaderboard.helpers({
        'player': function(){
            return PlayersList.find();
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
        }
    });
}

if(Meteor.isServer) {
    console.log("Hello server");
}
