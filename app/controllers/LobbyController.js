const db = require("../models");
const Lobby = db.lobby;
const Team = db.team;
const Game = db.game;
const Player = db.player;
const Utils = require('../../utility.js');
const User = db.user;
const shortid = require('shortid');
const { json } = require("body-parser");

async function getLobby(lobbyId) {
    return await Lobby.findOne({ short_id: lobbyId.toUpperCase() }).exec();
  }
  
  async function getLobbyPopulated(lobbyId) {
    return await Lobby.findOne({ short_id: lobbyId.toUpperCase() })
      .populate({ path: 'team1', 
        populate: [
          { path: 'player1', select: 'displayName isReady cardCount playedCard' }, 
          { path: 'player2', select: 'displayName isReady cardCount playedCard' }
        ]})
      .populate({ path: 'team2', 
        populate: [
          { path: 'player1', select: 'displayName isReady cardCount playedCard' }, 
          { path: 'player2', select: 'displayName isReady cardCount playedCard' }
        ]})
        /*
      .populate({ path: 'messages', 
        populate: { path: 'player', select: 'displayName' }
      })
      */
      .populate({ 
        path: 'activeGame', select: 'bid suit suitName biddingPlayer activePlayer activePlayerIndex team1Score team2Score team1PointsInRound team2PointsInRound', 
          populate: [
            { path: 'activePlayer', select: 'displayName isReady cardCount' },
            { path: 'biddingPlayer', select: 'displayName isReady cardCount' }
          ]});
      // TODO: add getting users here
      // FUTURE: add avatars for each player here
  }

  
  async function startLobby(lobbyId) {
    let lobby = await getLobbyPopulated(lobbyId); 
    if (lobby == undefined) {
      return undefined; 
    }
  
    // Create a new game 
    let game = await Game.createNewGame(room);
    lobby.activeGame = game._id; 
    lobby.games.push(game._id);
  
    let activePlayer = await Player.getPlayerNoCards(game.activePlayer);
    lobby.roomStatus = `New game has begun! ${activePlayer.displayName} starts the bidding.`;
    await lobby.save();
    return lobby;
  }
  
  exports.create = async (req, res) => {
    // Generate a room id, will be different than the mongo id
    // Useful for sharing with friends
    shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@$');
    let short_id = shortid.generate();
    // Ensure the id is unique to the database 
    while ((await getLobby(short_id)) != undefined) {
      console.log("Generating another id...");
      short_id = shortid.generate();
    }
  
    // Create two new teams for the new room 
    let newTeams = [];
    for (let teamNum = 0; teamNum < 2; teamNum++) {
      newTeams.push(new Team({
        name: `Team ${teamNum+1}`, 
        score: 0,
        player1: null,
        player2: null,
      }));
      newTeams[teamNum].save().catch(err => {
        console.log(err);
        res.status(400).json({
          "status": "error",
          "details": "There was an error saving a team to the database."
        });
      });
    }
    const username = req.body['username'].toLowerCase();
    //const user = await User.findOne({ username: username }).exec();
    // Create the new room
    let newLobby = new Lobby({ 
      short_id: short_id.toUpperCase(),
      lobbyName: Utils.randomName(),
      lobbyStatus: 'New lobby created',
      dealer: -1,
      isPrivate: false,
      users: [username],
      activeGame: null,
      games: [],
      //messages: [],
      team1: newTeams[0],
      team2: newTeams[1],
      numPlayers: 1,
    });
    newLobby.save().then(item => {
      res.json({
        "room": item
      });
    }).catch(err => {
      console.log(err);
      res.status(400).json({
        "status": "error",
        "details": "There was an error saving the lobby to the database."
      });
    });
  };
  
  exports.getById = async (req, res) => {
    const lobbyId = req.body['ShortId'].toUpperCase();
    let lobby = await getLobbyPopulated(lobbyId);
    if (!lobby) {
      res.status(400).json({
        "status": "error",
        "details": "Unable to find requested lobby"
      });
    }
    else {
      res.json({
        "lobby": lobby 
      })
    }
  };
  exports.getAll = async (req, res) => {
    let list = await Lobby.find();
    // TODO: for each lobby in list perform getLobbyPopulated
    if (!list) {
      res.status(400).json({
        "status": "error",
        "details": "Unable to find requested lobby"
      });
    }
    else {
      var i;
      var arr = [];
      for(i = 0; i < list.length; ++i)
      {
        arr[i] = {
          "ShortId": list[i].short_id,
          "LobbyName": list[i].lobbyName,
          "LobbyStatus": list[i].lobbyStatus,
          "Dealer": list[i].dealer,
          "IsPrivate": list[i].isPrivate,
          "Users": list[i].users,
          "Players": list[i].numPlayers
        }
      }
      var json = JSON.stringify(arr)
      res.send({
        "LobbyList": json
        
      })
    }
  };

  exports.newGame = async (req, res) => {
    let lobby = await startLobby(req.body['lobby']);
    if (!lobby) {
      res.status(400).json({
        "status": "error",
        "details": "Unable to find requested lobby"
      });
    }
  
    let updatedLobby = await getLobbyPopulated(lobby.short_id)
  
    //req.app.io.to(updatedRoom.short_id).emit('room-update', (updatedRoom));
  
    res.json({
      "status": "success"
    });
  };

  exports.join = async (req, res) => {
    const lobbyId = req.body['ShortId'].toUpperCase();
      let lobby = await getLobbyPopulated(lobbyId);
      if (!lobby) {
        res.status(400).json({
          "status": "error",
          "details": "Unable to find requested lobby"
        });
      }
      else {
        res.json({
          "lobby": lobby 
        })
      }
  };

  exports.removeuser = async (req, res) => {


  };