"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queue_typescript_1 = require("queue-typescript");
const card_1 = require("./card");
const cardType_1 = require("./cardType");
const gamestatus_1 = require("./gamestatus");
const gameResult_1 = require("./gameResult");
const linq = require("linq");
const randomNumberGen_1 = require("../utilities/randomNumberGen");
class KpashiGame {
    constructor() {
        this.playerlist = [];
        this.playingcards = [];
        this.deckofcards = new queue_typescript_1.Queue();
        this.openedcards = new queue_typescript_1.Queue();
        this.droppedcards = [];
        this.firsttopick = [null, null];
        this.pickupsequence = new queue_typescript_1.Queue();
        this.gameresults = [];
    }
    initialize(gameid, tableid, unitsperhand) {
        this.id = gameid;
        this.kpashitableid = tableid;
        this.unitsperhand = unitsperhand;
        for (let suitindex = 0; suitindex < 4; suitindex++) {
            for (let index = 0; index < 10; index++) {
                var newcard = new card_1.Card(suitindex, index + 1);
                this.playingcards.push(newcard);
            }
            this.gamestatus = gamestatus_1.GameStatus.Created;
            this.startedAt = new Date();
            this.startTime = this.startedAt.getTime().toLocaleString();
            this.lastplayerposition = 0;
        }
    }
    enrollplayer(player) {
        var existingplayer = this.playerlist.find(a => a.playerid == player.playerid);
        if (existingplayer)
            return;
        if (this.playerlist.length == 7)
            throw "maximum of seven players";
        player.sittingposition = this.playerlist.length + 1;
        this.playerlist.push(player);
    }
    shufflecards(playerid) {
        var existingplayer = this.playerlist.find(a => a.playerid == playerid);
        if (existingplayer.sittingposition !== 1)
            throw "not your turn to play";
        if (this.gamestatus != gamestatus_1.GameStatus.Created &&
            this.gamestatus != gamestatus_1.GameStatus.ShufflingCards)
            throw "this game is not in shuffling mode any more";
        this.gamestatus = gamestatus_1.GameStatus.ShufflingCards;
        var shuffledcards = {};
        var position = 0;
        this.playingcards.forEach(card => {
            position += 1;
            shuffledcards[position] = card;
        });
        for (let index = 0; index < 1000; index++) {
            const element = [index];
            var cardtype = randomNumberGen_1.getRandomInt(1, 10);
            var suitType = randomNumberGen_1.getRandomInt(0, 3);
            var pickedpositioninthedeck = randomNumberGen_1.getRandomInt(1, 40);
            var currentcardinpickedposition = shuffledcards[pickedpositioninthedeck];
            var pickedcardindeck = new card_1.Card(suitType, cardtype);
            var currentpositionofpickedCard = Number.parseInt(Object.keys(shuffledcards).find(key => {
                var position = Number.parseInt(key);
                var card = shuffledcards[position];
                return card.cardType == cardtype && suitType == card.suitType;
            }));
            shuffledcards[pickedpositioninthedeck] = pickedcardindeck;
            shuffledcards[currentpositionofpickedCard] = currentcardinpickedposition;
        }
        this.playingcards = [];
        this.deckofcards = new queue_typescript_1.Queue();
        for (let index = 0; index < 40; index++) {
            const stackposition = index + 1;
            this.playingcards.push(shuffledcards[stackposition]);
            this.deckofcards.enqueue(shuffledcards[stackposition]);
        }
        var tempdeck = new queue_typescript_1.Queue();
        do {
            var currentcard = this.deckofcards.dequeue();
            if (currentcard.cardType == 2)
                continue;
            tempdeck.enqueue(currentcard);
        } while (this.deckofcards.length > 0);
        this.deckofcards = tempdeck;
    }
    dealcards(playerid) {
        var existingplayer = this.playerlist.find(a => a.playerid == playerid);
        if (existingplayer.sittingposition !== 1)
            throw "not your turn to play";
        if (this.gamestatus != gamestatus_1.GameStatus.ShufflingCards)
            throw "Invalid Move";
        for (let index = 0; index < 3; index++) {
            this.playerlist.forEach(player => {
                var card = this.deckofcards.dequeue();
                player.cards.push(card);
            });
        }
        for (let index = 0; index < this.playerlist.length + 1; index++) {
            var card = this.deckofcards.dequeue();
            this.openedcards.enqueue(card);
        }
        this.gamestatus = gamestatus_1.GameStatus.DealingCards;
    }
    setcallcard(player, callcard) {
        if (player.sittingposition !== 1)
            throw "you cannot play first";
        this.callingcard = callcard;
        this.droppedcards.push([player, callcard]);
        this.analyseCardsAffectedByCallingCards();
        this.firsttopick = [player, callcard];
        this.gamestatus = gamestatus_1.GameStatus.Started;
    }
    playcallcard(playerid, suittype, cardtype) {
        var existingplayer = this.playerlist.find(a => a.playerid == playerid);
        var callingcard = existingplayer.cards.find(a => a.suitType == suittype && a.cardType == cardtype);
        this.setcallcard(existingplayer, callingcard);
        var cardid = suittype.toString() + cardtype.toString();
        var playerscards = [...existingplayer.cards];
        existingplayer.cards = playerscards.filter(a => a.suitType.toString() + a.cardType.toString() != cardid);
        this.lastplayerposition = existingplayer.sittingposition;
    }
    dropcard(playerid, suittype, cardtype, onGameEndCallback) {
        if (this.gamestatus == gamestatus_1.GameStatus.Cancelled)
            throw "Game Already Cancelled";
        if (this.gamestatus == gamestatus_1.GameStatus.Finished)
            throw "Game Already Ended";
        var existingplayer = this.playerlist.find(a => a.playerid == playerid);
        if (this.droppedcards.length == 0) {
            this.playcallcard(playerid, suittype, cardtype);
            return;
        }
        if (existingplayer.sittingposition !== this.lastplayerposition + 1)
            throw "Not your turn to play";
        if (existingplayer.cardsaffectedbycallingcards.length > 0) {
            var existingcard = existingplayer.cardsaffectedbycallingcards.find(a => a.suitType == suittype && a.cardType == cardtype);
            if (existingcard == undefined)
                throw "invalid move";
        }
        var cardid = suittype.toString() + cardtype.toString();
        var playerscards = [...existingplayer.cards];
        existingplayer.cards = playerscards.filter(a => a.suitType.toString() + a.cardType.toString() != cardid);
        this.registerdroppedcard(existingplayer, new card_1.Card(suittype, cardtype));
        this.lastplayerposition = existingplayer.sittingposition;
        onGameEndCallback(this.droppedcards.length == this.playerlist.length);
    }
    registerdroppedcard(player, card) {
        this.droppedcards.push([player, card]);
        if (this.firsttopick[1].cardType != cardType_1.CardType.Ace) {
            for (let index = 0; index < this.droppedcards.length; index++) {
                const dropedcarddetail = this.droppedcards[index];
                if (this.firsttopick[0].playerid == dropedcarddetail[0].playerid)
                    continue;
                if (this.firsttopick[1].suitType != dropedcarddetail[1].suitType)
                    continue;
                if (dropedcarddetail[1].cardType == 1) {
                    this.firsttopick = dropedcarddetail;
                }
                else {
                    if (this.firsttopick[1].cardType < dropedcarddetail[1].cardType)
                        this.firsttopick = dropedcarddetail;
                }
            }
        }
        this.processpicksequence();
        if (this.droppedcards.length == this.playerlist.length) {
            this.gamestatus = gamestatus_1.GameStatus.Finished;
            this.processopenedcards();
            this.processresults();
        }
    }
    processpicksequence() {
        this.pickupsequence = new queue_typescript_1.Queue();
        this.pickupsequence.enqueue(this.firsttopick[0]);
        var currentposition = this.firsttopick[0].sittingposition;
        for (let index = 0; index < this.playerlist.length - 1; index++) {
            currentposition += 1;
            if (currentposition > this.playerlist.length)
                currentposition = 1;
            var player = this.playerlist.find(a => a.sittingposition == currentposition);
            this.pickupsequence.enqueue(player);
        }
        console.log("pickSeq", this.pickupsequence);
    }
    processopenedcards() {
        while (this.pickupsequence.length > 0) {
            var playertopick = this.pickupsequence.dequeue();
            var playertoupdate = this.playerlist.find(a => a.playerid == playertopick.playerid);
            var continuepicking = true;
            if (this.openedcards.length == 0)
                continue;
            var nosOfAces = playertoupdate.cards.filter(a => a.cardType == 1).length;
            if (nosOfAces == 2)
                continue;
            while (this.openedcards.length > 0 && continuepicking) {
                var cardontop = this.openedcards.front;
                var assumedcardlist = [...playertoupdate.cards, cardontop];
                let totalscore = 0;
                assumedcardlist.forEach(card => {
                    var cardpoint = card.cardType == 1 ? 11 : card.cardType;
                    totalscore += cardpoint;
                });
                if (totalscore <= 21) {
                    this.openedcards.dequeue();
                    playertoupdate.cards = assumedcardlist;
                }
                else {
                    continuepicking = false;
                }
            }
        }
    }
    processresults() {
        this.playerlist.forEach(player => {
            var totalscore = linq.from(player.cards).aggregate(0, (acc, card) => {
                var cardvalue = card.cardType == cardType_1.CardType.Ace ? 11 : card.cardType;
                return acc + cardvalue;
            });
            var gameresult = new gameResult_1.GameResult(player, totalscore, 0);
            this.gameresults.push(gameresult);
        });
        var scorelist = linq
            .from(this.gameresults)
            .orderByDescending(a => a.score)
            .select(a => a.score)
            .distinct();
        var winpositioncounter = 0;
        scorelist.forEach(score => {
            winpositioncounter += 1;
            var gameresultlist = linq
                .from(this.gameresults)
                .where(a => a.score == score);
            gameresultlist.forEach(gameresult => {
                gameresult.position = winpositioncounter;
            });
        });
    }
    analyseCardsAffectedByCallingCards() {
        var otherplayers = this.playerlist.filter(a => a.sittingposition != 1);
        otherplayers.forEach(player => {
            var affectedcards = player.cards.filter(a => a.suitType == this.callingcard.suitType);
            if (affectedcards && affectedcards.length > 0)
                player.cardsaffectedbycallingcards = affectedcards;
        });
    }
    nextplayer() {
        var nextplayerposition = this.lastplayerposition == this.playerlist.length
            ? this.lastplayerposition
            : this.lastplayerposition + 1;
        return this.playerlist.find(a => a.sittingposition == nextplayerposition);
    }
    cancellGame() {
        if (this.gamestatus != gamestatus_1.GameStatus.Started)
            throw "only started games can be cancelled";
        this.gamestatus = gamestatus_1.GameStatus.Cancelled;
    }
}
exports.KpashiGame = KpashiGame;
//# sourceMappingURL=kpashiGame.js.map