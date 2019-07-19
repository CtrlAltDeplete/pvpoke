// JavaScript Document

function MatchHandler(){
	var self = this;
	var interface;
	var battler;
	var gm;
	var battle = new Battle();

	var players = [];
	var properties;

	var roundRecord = [0, 0];

	// Initialize handler

	this.init = function(){
		gm = GameMaster.getInstance();
		interface = InterfaceMaster.getInstance(self);
		battler = BattlerMaster.getInstance(self, battle);
	}

	this.init();

	// Initialize battle from setup interface

	this.initBattle = function(props){
		properties = props;
		battle = new Battle();
		battle.setCP(props.league);
		battle.setCup(props.cup);

		// Set up players
		players = [];

		var player = new Player(0, false, battle);
		player.setRoster(props.teams[0]);
		players.push(player);

		var opponent = new Player(1, props.difficulty, battle);
		players.push(opponent);

		if(props.teamSelectMethod == "manual"){
			opponent.setRoster(props.teams[1]);
			self.startBattle();
		} else if(props.teamSelectMethod = "random"){
			opponent.generateRoster(props.partySize, self.rosterReady);
		}
	}

	// Initiate a new battle

	this.startBattle = function(){
		var player = players[0];
		var opponent = players[1];

		if(properties.mode == "single"){

			if(properties.teamSelectMethod == "manual"){
				opponent.setRoster(properties.teams[1]);
				opponent.setTeam(properties.teams[1]);
			} else{
				opponent.generateTeam(player.getRoster());
			}

			player.setTeam(properties.teams[0]);

			interface.close();
			battler.init(properties, battle, players);
		} else if(properties.mode == "tournament"){
			interface.openTeamSelect(players);
		}
	}

	// Initiate a new tournament battle

	this.startTournamentRound = function(team, props){
		roundRecord = [0, 0];
		self.startTournamentBattle(team, properties);
	}

	// Initiate a new tournament battle

	this.startTournamentBattle = function(team, props){
		var player = players[0];
		var opponent = players[1];

		player.setTeam(team);
		opponent.generateTeam(player.getRoster());

		interface.close();
		battler.init(props, battle, players);
	}

	// Continue to the next round

	this.nextTournamentRoundSetup = function(result){
		$(".battle-window").attr("phase","");
		interface.openTeamSelect(players);
	}

	this.startTournamentRound = function(team, props){
		roundRecord = [0, 0];
		self.startTournamentBattle(team, properties);
	}

	// Return to the setup interface

	this.returnToSetup = function(){
		$(".battle-window").attr("phase","");
		interface.open();
	}

	// Callback that lets MatchHandler know the AI's roster is ready to begin play

	this.rosterReady = function(){
		self.startBattle();
	}
}

var matchHandler = new MatchHandler();