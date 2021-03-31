/*jshint esversion: 6 */

$(document).ready(function() {

  const btnStartModal = document.getElementById("btnStartModal");
  const btnStartGame = document.getElementById("btnStartGame");
  const inputPlayerName = document.getElementById("playerName");
  const btnResultsModal = document.getElementById("btnResultsModal");
  const btnLevelUp = document.getElementById("btnLevelUp");
  const btnPlayAgain = document.getElementById("btnPlayAgain");
  const btnRestart = document.getElementById("btnRestart");
  const btnExit = document.getElementById("btnExit");
  const card = document.querySelector('.card');

  // game namespace/scope
  let game = {
    playerName: "noname",
    moves: 0,
    timeCounter: 0,
    imgCategory: "any",
    cardFigures: [],
    gameLevel: 0,

    // Event listener BtnStartModal click
    // Open the start modal
    clickBtnStartModal: function() {
      $("#startModal").modal({
        backdrop: "static",
        keyboard: false,
      });
      inputPlayerName.value === "";

      btnStartGame.addEventListener("click", game.clickBtnStartGame);
    },

    // Event listener BtnStartGame click
    // Start the player's game
    clickBtnStartGame: function() {
      inputPlayerName.addEventListener("input", game.changeInputPlayerName());

      game.initTime();
      game.gameLevel = 1;
      game.displayGameLevel(game.gameLevel);
      game.cardFigures = game.getCardFigures(game.gameLevel);
      game.shuffleCards();
      game.getImagesloaded();
    },

    // Event listener InputPlayerName change
    changeInputPlayerName: function() {
      if (inputPlayerName.value !== "") {
        game.getPlayerData();
      } else {
        setTimeout(function() {
          $("#playerName").effect("bounce");
        }, 10);
      }
    },

    // Event listener BtnResultsModal click
    // Display the result modal according to the game level
    clickBtnResultsModal: function() {
      $("#resultsModal").modal({
        backdrop: "static",
        keyboard: false,
      });
      $("#btnLevelUp").hide();
      $("#btnPlayAgain").hide();

      // todo: change end game level
      if (game.gameLevel == 3) {
        $(".resultsText").text(
          `Well done ${game.playerName}! You finished the game. Do you want to \
          start the game over?`
        );
        $("#btnPlayAgain").show();
        btnPlayAgain.addEventListener("click", game.clickBtnPlayAgain);
      } else {
        $(".resultsText").text(
          `Well done ${game.playerName}! You finished Level ${game.gameLevel} \
          in ${game.timeCounter} seconds and ${game.moves} moves.`
        );
        $("#btnLevelUp").show();
        btnLevelUp.addEventListener("click", game.clickBtnLevelUp);
      }
    },

    // Event listener BtnLevelUp click
    // Display a level up game round
    clickBtnLevelUp: function() {
      $("#resultsModal").modal("toggle");
      game.gameLevel++;
      game.getLevelUp(game.gameLevel);
    },

    // Event listener BtnPlayAgain click
    // Start the game over from the result pop up when the player has completed
    // the 5 levels
    clickBtnPlayAgain: function() {
      $("#resultsModal").modal("toggle");
      game.clearTime();
      game.resetTime();
      game.init();
    },

    // Event listener BtnRestart click
    // Restart the game round (scope: current level)
    clickBtnRestart: function() {
      game.resetMoves();
      game.resetTime();
      game.shuffleCards();
    },

    // Event listener BtnExit click
    // Start the game over from the Exit button
    clickBtnExit: function() {
      game.clearTime();
      game.resetTime();
      game.init();
    },

    // Event listener card class click
    // Flip the card
    clickCardHandlers: function() {
      $(".card").click(function() {
        game.flipCard($(this));
      });
    },

    // Initialize the game
    init: function() {
      btnStartModal.addEventListener("click", game.clickBtnStartModal);

      $(".initWrapper").show();
      $("#btnStartModal").show();
      $("#btnResultsModal").hide();
    },

    // Get the player game environment data
    getPlayerData: function() {
      game.playerName = inputPlayerName.value;
      game.clickCardHandlers();
      $("#startModal").modal("toggle");
      $(".initWrapper").hide();
      game.getHeaderDetails();
      game.getInformationDetails();
    },

    // Display game title
    getHeaderDetails: function() {
      $(".headerDetails").empty();
      $(".headerDetails")
        .append("<h1>Match the memory</h1>")
        .addClass("uppercase");
    },

    // Display info buttons (level, moves, time) and action buttons (reset, exit)
    getInformationDetails: function() {
      $(".informationDetails h4").empty();
      $(".informationDetails h4").append(
        '<span class="badge badge-primary level">Level<span id="levelCounter">0</span></span><span class="badge badge-primary moves"><span id="moves">0</span> moves</span><span class="badge badge-primary levelTimer"><span id="levelTimer">0</span> s</span>'
      );
      $(".informationDetails").show();

      btnExit.addEventListener("click", game.clickBtnExit);
      btnRestart.addEventListener("click", game.clickBtnRestart);
    },

    // Get the card deck according to the game round level
    getCardFigures: function(gameLevel) {
      switch (gameLevel) {
        case (gameLevel = 1):
          // return (game.cardFigures = [1, 2, 3, 4, 1, 2, 3, 4]);
          return (game.cardFigures = [1, 1]);
        case (gameLevel = 2):
          // return (game.cardFigures = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]);
          return (game.cardFigures = [1, 1]);
        case (gameLevel = 3):
          // return (game.cardFigures = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]);
          return (game.cardFigures = [1, 1]);
        case (gameLevel = 4):
          // return (game.cardFigures = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
          return (game.cardFigures = [1, 1]);
        case (gameLevel = 5):
          // return (game.cardFigures = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
          return (game.cardFigures = [1, 1]);
        default:
          // return (game.cardFigures = [1, 2, 3, 4, 1, 2, 3, 4]);
          return (game.cardFigures = [1, 1]);
      }
    },

    // credit: https://medium.com/swlh/the-javascript-shuffle-62660df19a5d
    // Iterate over the cards array and each time generate a random number
    // then switching numbers which shuffles cards and then, after cards are
    // shuffled, assign cards
    shuffleCards: function() {
      let switching = 0;
      let temp = 0;
      $(".card-details").empty();
      for (let i = game.cardFigures.length - 1; i > -1; i -= 1) {
        switching = Math.floor(Math.random() * game.cardFigures.length);
        temp = game.cardFigures[i];
        game.cardFigures[i] = game.cardFigures[switching];
        game.cardFigures[switching] = temp;
        $(".card-details").append('<div class="card unpaired"></div>');
      }
      game.getCards();
    },

    // Assign cards
    // Iterate over each one of the elements with class="card" and assign a
    // data-value attribute and a relative value to each one of the individual
    // cards (https://api.jquery.com/data/)
    getCards: function() {
      $(".card").each(function(index) {
        $(this).attr("data-card-figure", game.cardFigures[index]);
      });
      game.clickCardHandlers();
    },

    // On-click flip the card and display the figure of the card. Figures are
    // randomly generated from https://placeimg.com
    flipCard: function(card) {
      card.addClass("visible");
      card.css({
        "background-image": 'url("https://placeimg.com/200/200/' +
          game.imgCategory +
          "/" +
          card.data("cardFigure") +
          '")',
      });
      if ($(".visible").length == 2) {
        game.checkForPairedCards(game.gameLevel);
      }
    },

    // Check if the 2 visible cards have similar figures,
    //if they match make the paired cards disapeared if not flip the figures of
    //the unpaired ones back after a timeout interval
    checkForPairedCards: function(level) {
      let time = 0;
      game.gameLevel = level;
      switch (game.gameLevel) {
        case (game.gameLevel = 1):
          time = 1000;
          break;
        case (game.gameLevel = 2):
          time = 900;
          break;
        case (game.gameLevel = 3):
          time = 700;
          break;
        case (game.gameLevel = 4):
          time = 700;
          break;
        case (game.gameLevel = 5):
          time = 500;
          break;
      }

      if (
        $(".visible").first().data("cardFigure") ==
        $(".visible").last().data("cardFigure")
      ) {
        setTimeout(function() {
          $(".visible").each(function() {
            $(this)
              .css({
                opacity: 0,
              }, {
                duration: 1000,
              })
              .removeClass("unpaired visible");
          });
          game.checkForSuccess();
        }, time);
      } else {
        setTimeout(function() {
          $(".visible").each(function() {
            $(this)
              .css({
                background: "",
              })
              .removeClass("visible");
          });
        }, time);
      }
      game.moves++;
      $("#moves").html("" + game.moves);
    },

    // Check if all cards are suceessfully paired
    checkForSuccess: function() {
      if ($(".unpaired").length === 0) {
        this.getResults(game.gameLevel);
      }
    },

    // Once all cards are paired, pop up your results: player name, level,
    // time and moves it took to finish the game round
    getResults: function() {
      $(".informationDetails").hide();
      $("h1").hide();
      $(".initWrapper").show();
      $("#btnStartModal").hide();
      $("#btnResultsModal").show();

      btnResultsModal.addEventListener("click", game.clickBtnResultsModal)
    },

    // Continue the game by starting a new game round to the level up
    getLevelUp: function() {
      game.clickCardHandlers();
      $("#resultsModal").modal("toggle");
      $(".initWrapper").hide();
      game.getHeaderDetails();
      $(".informationDetails").show();

      game.resetTime();
      game.resetMoves();
      game.displayGameLevel(game.gameLevel);
      game.cardFigures = game.getCardFigures(game.gameLevel);
      game.shuffleCards();
      game.getImagesloaded();
    },

    // Display the game level
    displayGameLevel: function(level) {
      game.gameLevel = level;
      $("#levelCounter").html(" " + game.gameLevel);
    },

    // Reset moves (scope: current level of the game round)
    resetMoves: function() {
      game.moves = 0;
      $("#moves").html("" + game.moves);
    },

    // Reset time (scope: current level of the game round)
    resetTime: function() {
      game.timeCounter = 0;
      $("#levelTimer").html("" + game.timeCounter);
    },

    // Initialize time
    initTime: function() {
      game.refreshIntervalId = setInterval(function() {
        game.timeCounter++;
        $("#levelTimer").html("" + game.timeCounter);
      }, 1000);
    },

    // Clear time
    clearTime: function() {
      clearInterval(game.refreshIntervalId);
    },

    // Pre load the images from https://placeimg.com
    getImagesloaded: function() {
      let img = [];
      for (let i = 0; i < game.cardFigures.length; i++) {
        img[i] = new Image();
        img[i].src =
          "https://placeimg.com/200/200/" + game.imgCategory + "/" + i;
      }
    },
  };

  game.init();
});
