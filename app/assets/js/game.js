/*jshint esversion: 6 */

$(document).ready(function() {
	// game namespace/scope
	var game = {
		playerName: "noname",
		moves: 0,
		timeCounter: 0,
		imgCategory: "any",
		cardFigures: [],
		gameLevel: 0,

		// Initialize the game
		init: function() {
			$(".header-details")
				.append("<h1>Match the memory</h1>")
				.addClass("uppercase");

			$("#btnStartModal").click(function() {
				$("#startModal").modal({
					backdrop: "static",
					keyboard: false,
				});
				$(this).hide();
				$("#playerName").val("");
			});

			$("#startGameButton").click(function() {
				game.getPlayerData();
				if ($("#playerName").val() !== "") {
					$(".information-details").empty();
					$(".information-details").append(
						'<p><h4 class="inline"><span class="badge badge-primary level">Level<span id="levelCounter">0</span></span><span class="badge badge-primary moves"><span id="moves">0</span> moves</span><span class="badge badge-primary levelTimer"><span id="levelTimer">0</span> s</span></h4><button type="button" class="btn btn btn-primary" id="restart"><i class="fas fa-redo-alt"></i></button><button type="button" class="btn btn btn-primary" id="exit"><i class="fas fa-sign-out-alt"></i></button></p>'
					);
					$(".information-details").show();
					game.exit();
					game.restart();
					game.initTime();
					game.gameLevel = 1;
					game.displayGameLevel(game.gameLevel);
					game.cardFigures = game.getCardFigures(game.gameLevel);
					game.shuffleCards();
					game.getImagesloaded();
				}
			});
		},

		// Continue the game by starting a new game round to the level up
		playAgain: function(level) {
			$("h1").show();
			$(".container-information").show();
			$("#btnStartModal").hide();
			game.exit();
			game.restart();
			game.resetTime();
			game.resetMoves();
			game.displayGameLevel(level);
			game.cardFigures = game.getCardFigures(level);
			game.shuffleCards();
			game.getImagesloaded();
		},

		getPlayerData: function() {
			if ($("#playerName").val() !== "") {
				game.playerName = $("#playerName").val();
				console.log(game.playerName)
				game.clickCardHandlers();
				$("#startModal").modal("toggle");
			} else {
				setTimeout(function() {
					$("#playerName").effect("bounce");
				}, 1000);
			}
		},

		// Get the card deck according the game round level
		getCardFigures: function(gameLevel) {
			switch (gameLevel) {
				case (gameLevel = 1):
					return (game.cardFigures = [1, 2, 3, 4, 1, 2, 3, 4]);
				case (gameLevel = 2):
					return (game.cardFigures = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]);
				case (gameLevel = 3):
					return (game.cardFigures = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]);
				case (gameLevel = 4):
					return (game.cardFigures = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
				case (gameLevel = 5):
					return (game.cardFigures = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
				default:
					return (game.cardFigures = [1, 2, 3, 4, 1, 2, 3, 4]);
			}
		},

		// credit: https://medium.com/swlh/the-javascript-shuffle-62660df19a5d
		// Iterate over the cards array and each time generate a random number
		// then switching numbers which shuffles cards and then, after cards are shuffled, assign cards
		shuffleCards: function() {
			var switching = 0;
			var temp = 0;
			$(".card-details").empty();
			for (var i = game.cardFigures.length - 1; i > -1; i -= 1) {
				switching = Math.floor(Math.random() * game.cardFigures.length);
				temp = game.cardFigures[i];
				game.cardFigures[i] = game.cardFigures[switching];
				game.cardFigures[switching] = temp;
				$(".card-details").append('<div class="card unpaired"></div>');
			}
			game.getCards();
		},

		// Assign cards
		// Iterate over each one of the elements with class="card" and assign a data-value attribute and a relative value to each one of the individual cards
		// https://api.jquery.com/data/
		getCards: function() {
			$(".card").each(function(index) {
				$(this).attr("data-card-figure", game.cardFigures[index]);
			});
			game.clickCardHandlers();
		},

		clickCardHandlers: function() {
			$(".card").click(function() {
				game.flipCard($(this));
			});
		},

		// On-click flip the card and display the figure of the card. Figures are randomly generated from https://placeimg.com
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
		//if they match make the paired cards disapeared if not flip the figures of the unpaired ones back after a timeout interval
		checkForPairedCards: function(level) {
			var time = 0;
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

		// Once all cards are paired, pop up your results: player name, level, time and moves it took to finish the game round
		getResults: function(level) {
			$("#resultsModal").modal({
				backdrop: "static",
				keyboard: false,
			});

			$(".container-information").hide();
			$("h1").hide();
			game.gameLevel = level;
			$("#resultsButton").hide();
			$("#endGameButton").hide();

			if (game.gameLevel == 5) {
				$(".resultsText").text(
					`Well done ${game.playerName}! You finished the game. Do you want to start the game over?`
				);
				$("#endGameButton").show();

				$("#endGameButton").click(function() {
					$("#resultsModal").modal("toggle");
					$("#btnStartModal").show();
					game.exit();
				});
			} else {
				$(".resultsText").text(
					`Well done ${game.playerName}! You finished Level ${level} in ${game.timeCounter} seconds and ${game.moves} moves.`
				);
				$("#resultsButton").show();

				$("#resultsButton").click(function() {
					$("#resultsModal").modal("toggle");
					$("#btnStartModal").show();
					level++;
					game.playAgain(level);
				});
			}
		},

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

		// Restart the game round (scope: current level)
		restart: function() {
			$("#restart").click(function() {
				game.resetMoves();
				game.resetTime();
				game.shuffleCards();
			});
		},

		initTime: function() {
			game.refreshIntervalId = setInterval(function() {
				game.timeCounter++;
				$("#levelTimer").html("" + game.timeCounter);
			}, 1000);
		},

		clearTime: function() {
			clearInterval(game.refreshIntervalId);
		},

		// Pre load the images from https://placeimg.com
		getImagesloaded: function() {
			var img = [];
			for (var i = 0; i < game.cardFigures.length; i++) {
				img[i] = new Image();
				img[i].src =
					"https://placeimg.com/200/200/" + game.imgCategory + "/" + i;
			}
		},

		// Start the game over
		exit: function() {
			// From the Exit button
			$("#exit").click(function() {
				$(".container-information").hide();
				$(".container-cards").hide();
				$("#btnStartModal").show();

				$("#btnStartModal").click(function() {
					$("#startModal").modal({
						backdrop: "static",
						keyboard: false,
					});
					$(this).hide();
				});

				$("#startGameButton").click(function() {
					game.getPlayerData();
					$(".information-details").empty();
					$(".information-details").append(
						'<p><h4 class="inline"><span class="badge badge-primary level">Level<span id="levelCounter">0</span></span><span class="badge badge-primary moves"><span id="moves">0</span> moves</span><span class="badge badge-primary levelTimer"><span id="levelTimer">0</span> s</span></h4><button type="button" class="btn btn btn-primary" id="restart"><i class="fas fa-redo-alt"></i></button><button type="button" class="btn btn btn-primary" id="exit"><i class="fas fa-sign-out-alt"></i></button></p>'
					);
					$(".container-information").show();
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
					game.getImagesloaded();
				});
			});

			// From the result pop up when the player has completed the 5 levels
			$("#endGameButton").click(function() {
				$("h1").show();
				$(".container-information").hide();
				$(".container-cards").hide();
				$("#btnStartModal").show();

				$("#btnStartModal").click(function() {
					$("#startModal").modal({
						backdrop: "static",
						keyboard: false,
					});
					$(this).hide();
				});

				$("#startGameButton").click(function() {
					game.getPlayerData();
					$(".information-details").empty();
					$(".information-details").append(
						'<p><h4 class="inline"><span class="badge badge-primary level">Level<span id="levelCounter">0</span></span><span class="badge badge-primary moves"><span id="moves">0</span> moves</span><span class="badge badge-primary levelTimer"><span id="levelTimer">0</span> s</span></h4><button type="button" class="btn btn btn-primary" id="restart"><i class="fas fa-redo-alt"></i></button><button type="button" class="btn btn btn-primary" id="exit"><i class="fas fa-sign-out-alt"></i></button></p>'
					);
					$(".container-information").show();
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
					game.getImagesloaded();
				});
			});
		},
	};

	game.init();
});
