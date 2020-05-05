$(document).ready(function () {
  // game namespace/game variable
  var game = {
    playerName: "anonymous",
    moves: 0,
    timeCounter: 0,
    imgCategory: "any",
    cardFigures: [],
    gameLevel: 0,

    init: function () {
      $(".header-details")
        .append("<h1>Match the memory</h1>")
        .addClass("uppercase");

      $("#btnStartModal").click(function () {
        $("#startModal").modal({
          backdrop: "static",
          keyboard: false,
        });
        $(this).hide();
        $("#playerName").val("");
      });

      $("#startGameButton").click(function () {
        game.getPlayerData();
        if ($("#playerName").val() !== "") {
          $(".performance-details").empty();
          $(".performance-details").append(
            '<p><h4 class="inline"><span class="badge badge-primary level">Level<span id="levelCounter">0</span></span><span class="badge badge-primary moves"><span id="moves">0</span> moves</span><span class="badge badge-primary levelTimer"><span id="levelTimer">0</span> s</span></h4><button type="button" class="btn btn btn-primary" id="restart"><i class="fas fa-redo-alt"></i></button><button type="button" class="btn btn btn-primary" id="exit"><i class="fas fa-sign-out-alt"></i></button></p>'
          );

          game.exit();
          game.restart();
          game.initTime();
          game.gameLevel = 1;
          game.displayGameLevel(game.gameLevel);
          game.cardFigures = game.getCardFigures(game.gameLevel);
          game.shuffleCards();
          game.preloadImages();
        }
      });
    },

    playAgain: function (level) {
      $("h1").show();
      $(".container-performances").show();
      $("#btnStartModal").hide();
      game.exit();
      game.restart();
      game.resetTime();
      game.resetMoves();
      game.displayGameLevel(level);
      game.cardFigures = game.getCardFigures(level);
      game.shuffleCards();
      game.preloadImages();
    },

    getPlayerData: function (level) {
      if ($("#playerName").val() !== "") {
        game.playerName = $("#playerName").val();
        game.clickCardHandlers();
        $("#startModal").modal("toggle");
      } else {
        setTimeout(function () {
          $("#playerName").effect("bounce");
        }, 1000);
      }
    },

    getCardFigures: function (gameLevel) {
      switch (gameLevel) {
        case (gameLevel = 1):
          return (cardFigures = ["A", "B", "A", "B"]); //["A", "B", "C", "D", "E", "F", "A", "B", "C", "D", "E", "F"]
          break;
        case (gameLevel = 2):
          return (cardFigures = ["A", "B", "C", "A", "B", "C"]); //["A", "B", "C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G"]
          break;
        case (gameLevel = 3):
          return (cardFigures = ["A", "B", "C", "D", "A", "B", "C", "D"]); //["A", "B", "C", "D", "E", "F", "G", "H", "A", "B", "C", "D", "E", "F", "G", "H"]
          break;
        case (gameLevel = 4):
          return (cardFigures = [
            "A",
            "B",
            "C",
            "D",
            "A",
            "B",
            "C",
            "D",
            "E",
            "E",
          ]); //["A", "B", "C", "D", "E", "F", "G", "H", "I", "A", "B", "C", "D", "E", "F", "G", "H", "I"]
          break;
        default:
          return (cardFigures = ["A", "A"]); //["A", "B", "C", "D", "E", "F", "A", "B", "C", "D", "E", "F"]
      }
    },

    // Iterate over the cards array and each time generate a random number
    // then switching numbers which shuffles cards and add the html element relative to each individual card with the classes card and unpaired
    // and then, after cards are shuffled, assign cards
    shuffleCards: function () {
      var switching = 0;
      var temp = 0;
      $(".card-details").empty();
      for (i = 0; i < game.cardFigures.length; i++) {
        switching = Math.round(Math.random() * i);
        temp = game.cardFigures[i];
        game.cardFigures[i] = game.cardFigures[switching];
        game.cardFigures[switching] = temp;
        $(".card-details").append('<div class="card unpaired"></div>');
      }
      game.getCards();
    },

    // Iterate over each one on the elements with class="card" and assign a data-value attribute and a relative value to each one of the individual cards
    // https://api.jquery.com/data/
    getCards: function () {
      $(".card").each(function (index) {
        $(this).attr("data-card-figure", game.cardFigures[index]);
      });
      game.clickCardHandlers();
    },

    clickCardHandlers: function () {
      $(".card").click(function () {
        game.flipCard($(this));
      });
    },

    // On-click flip the card and display the figure of the card
    flipCard: function (card) {
      card.addClass("visible");
      card.css({
        "background-image":
          'url("https://placeimg.com/150/150/' +
          game.imgCategory +
          "/" +
          card.data("cardFigure") +
          '")',
      });
      if ($(".visible").length == 2) {
        game.checkForPairedCards();
      }
    },

    // Check if a pair of cards have a similar figure, make the paired ones disapeared and hide the figures of the unpaired ones after a timeout interval
    checkForPairedCards: function () {
      if (
        $(".visible").first().data("cardFigure") ==
        $(".visible").last().data("cardFigure")
      ) {
        setTimeout(function () {
          $(".visible").each(function () {
            $(this)
              .css({ opacity: 0 }, { duration: 1000 })
              .removeClass("unpaired visible");
          });
          game.checkForSuccess();
        }, 500);
      } else {
        setTimeout(function () {
          $(".visible").each(function () {
            $(this).css({ background: "" }).removeClass("visible");
          });
        }, 500);
      }
      game.moves++;
      $("#moves").html("" + game.moves);
    },

    // Check if all cards are paired
    checkForSuccess: function () {
      if ($(".unpaired").length === 0) {
        this.getResults(game.gameLevel);
      }
    },

    getResults: function (level) {
      $("#resultsModal").modal({
        backdrop: "static",
        keyboard: false,
      });

      $(".container-performances").hide();
      $("h1").hide();
      $(".resultsText").text(
        `Well done ${game.playerName}! You finished Level ${level} in ${game.timeCounter} seconds and ${game.moves} moves.`
      );

      $("#resultsButton").click(function () {
        $("#resultsModal").modal("toggle");
        $("#btnStartModal").show();
        level++;
        game.playAgain(level);
      });
    },

    displayGameLevel: function (level) {
      game.gameLevel = level;
      $("#levelCounter").html(" " + game.gameLevel);
    },

    resetMoves: function () {
      game.moves = 0;
      $("#moves").html("" + game.moves);
    },

    resetTime: function () {
      game.timeCounter = 0;
      $("#levelTimer").html("" + game.timeCounter);
    },

    restart: function () {
      $("#restart").click(function () {
        game.resetMoves();
        game.resetTime();
        game.shuffleCards();
      });
    },

    initTime: function () {
      game.refreshIntervalId = setInterval(function () {
        game.timeCounter++;
        $("#levelTimer").html("" + game.timeCounter);
      }, 1000);
    },

    clearTime: function() {
        clearInterval(game.refreshIntervalId);
    },

    preloadImages: function () {
      var img = [];
      for (i = 0; i < game.cardFigures.length; i++) {
        img[i] = new Image();
        img[i].src =
          "https://placeimg.com/150/150/" + game.imgCategory + "/" + i;
      }
    },

    exit: function () {
      $("#exit").click(function () {
        $(".container-performances").hide();
        $(".container-cards").hide();
        $("#btnStartModal").show();
        
        $("#btnStartModal").click(function () {
          $("#startModal").modal({
            backdrop: "static",
            keyboard: false,
          });
          $(this).hide();
        });

        $("#startGameButton").click(function () {
          game.getPlayerData();
          $(".performance-details").empty();
          $(".performance-details").append(
            '<p><h4 class="inline"><span class="badge badge-primary level">Level<span id="levelCounter">0</span></span><span class="badge badge-primary moves"><span id="moves">0</span> moves</span><span class="badge badge-primary levelTimer"><span id="levelTimer">0</span> s</span></h4><button type="button" class="btn btn btn-primary" id="restart"><i class="fas fa-redo-alt"></i></button><button type="button" class="btn btn btn-primary" id="exit"><i class="fas fa-sign-out-alt"></i></button></p>'
          );
          $(".container-performances").show();
          $(".container-cards").show();
          game.exit();
          game.clearTime();
          game.restart();
          game.resetTime();
          game.resetMoves();
          game.gameLevel = 1;
          game.displayGameLevel(game.gameLevel);
          game.cardFigures = game.getCardFigures(game.gameLevel);
          game.shuffleCards();
          game.preloadImages();
        });
      });
    },
  };

  game.init();
});
