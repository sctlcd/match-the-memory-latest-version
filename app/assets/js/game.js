$(document).ready(function () {
  // game namespace/game variable
  var game = {
    cardFigures: ["A", "B", "A", "B"],
    //["A", "B", "C", "D", "E", "F", "A", "B", "C", "D", "E", "F"],
    playerName,
    moves: 0,
    timeCounter: 0,
    imgCategory: "any",
    init: function () {
      $(".header-details").append("<h1>Match the memory</h1>").addClass("uppercase");
      $("#startGameButton").click(function () {
        game.getPlayerData();
      });
    },

    getPlayerData: function () {
      if ($("#playerName").val() !== "") {
        game.playerName = $("#playerName").val();
        game.clickCardHandlers();
        $(".performance-details").empty();
        $(".performance-details").append(
          '<p><h4 class="inline"><span class="badge badge-primary moves"><span id="moves">0</span> moves</span><span class="badge badge-primary seconds"><span id="sec_timer">0</span> s</span></h4><button type="button" class="btn btn btn-primary" id="restart"><i class="fas fa-redo-alt"></i></button></p>'
        );
        //  <span class="badge badge-primary"><a id="restart"><i class="fas fa-redo-alt"></i></a></span>
        game.restart();
        game.initTime();
        game.resetMoves();
        game.shuffleCards();
        game.preloadImages();
        $("#startModal").modal("toggle");
      } else {
        setTimeout(function () {
          $("#playerName").effect("bounce");
        }, 1000);
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
        }, 1000);
      } else {
        setTimeout(function () {
          $(".visible").each(function () {
            $(this).css({ background: "" }).removeClass("visible");
          });
        }, 1000);
      }
      game.moves++;
      $("#moves").html("" + game.moves);
    },

    // Check if all cards are paired
    checkForSuccess: function () {
      if ($(".unpaired").length === 0) {
          $("#resultsModal").modal({
                backdrop: "static",
                keyboard: false,
            });
            $(".resultsText").text(`Well done ${game.playerName}! You did it in ${game.timeCounter} seconds and ${game.moves} moves.`)
      }
    },

    resetMoves: function () {
      game.moves = 0;
      $("#moves").html("" + game.moves);
    },

    resetTime: function () {
      game.timeCounter = -1;
      $("#sec_timer").html("", game.timeCounter);
    },

    restart: function () {
      $("#restart").click(function () {
        game.resetMoves();
        game.resetTime();
        game.shuffleCards();
      });
    },

    initTime: function () {
      setInterval(function () {
        game.timeCounter++;
        $("#sec_timer").html("" + game.timeCounter);
      }, 1000);
    },

    preloadImages: function () {
      var img = [];
      for (i = 0; i < game.cardFigures.length; i++) {
        img[i] = new Image();
        img[i].src =
          "https://placeimg.com/150/150/" + game.imgCategory + "/" + i;
      }
    },
  };

  $("#btnStartModal").click(function () {
    $("#startModal").modal({
      backdrop: "static",
      keyboard: false,
    });
    $(this).hide();
  });
  game.init();
});
