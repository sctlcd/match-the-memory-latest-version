$(document).ready(function() {
    
    // game namespace/game variable  
    var game = {
        cards: ["A", "A", "B", "B", "C", "C", "D", "D"],
        playerName,
        moves: 0,
        timeCounter: 0,
        imgCategory: "animals",
        init: function() {   
            $(".header-details").append("<h1>Memory game</h1>");  
            $("#startGameButton").click(function(){
            game.getPlayerData(); 
                       
            });
        },

        getPlayerData: function() {
            if ($("#playerName").val() !== "") {
                game.playerName = $("#playerName").val();
                game.clickCardHandlers();                
                $(".performance-details").empty();
                $(".performance-details").append('<p><h4 class="inline"><span class="badge badge-primary moves"><span id="moves">0</span> moves</span><span class="badge badge-primary moves"><span id="sec_timer">0</span> s</span></h4><button type="button" class="btn btn btn-primary" id="restart"><i class="fas fa-redo-alt"></i></button></p>'); 
                game.restart();
                game.initTime();
                game.resetMoves();
                game.shuffleCards();
                $("#startModal").modal("toggle");
            }else {
                setTimeout(function() {
                    $("#playerName").effect("bounce");
                    $("#playerName").css("background","yellow");
                },500);      
            } 
        },

        // Iterate over the cards array and each time generate a random number 
        // then switching numbers which shuffles cards and add the html element relative to each individual card with the classes card and unpaired
        // and then, after cards are shuffled, assign cards
        shuffleCards: function() {
            var switching = 0;
            var temp = 0;
            $(".card-details").empty();
            for ( i = 0; i < game.cards.length ; i++) {
                switching = Math.round(Math.random() * i);
                temp = game.cards[i];
                game.cards[i] = game.cards[switching];
                game.cards[switching] = temp;
                $(".card-details").append('<div class="card unpaired"></div>');
            }
            game.getCards();
        },

        // Iterate over each one on the elements with class="card" and assign a data-value attribute and a relative value to each one of the individual cards 
        // https://api.jquery.com/data/
        getCards: function() {
            $(".card").each(function (index) {
                $(this).attr("data-card-figure", game.cards[index]);
            });
            game.clickCardHandlers();
        },

        clickCardHandlers: function() {
            $(".card").click (function() {
                game.flipCard($(this));           
            });
        },

        // On-click flip the card and display the figure of the card
        flipCard: function(card) {
            card.addClass("visible");
            card.css({'background-image': 'url("https://placeimg.com/150/200/'+game.imgCategory+'/'+card.data("cardFigure")+'")'});
			if($(".visible").length == 2) {
				game.checkForPairedCards();
			}
        },

        // Check if a pair of cards have a similar figure, make the paired ones disapeared and hide the figures of the unpaired ones after a timeout interval
        checkForPairedCards: function() {
            if($(".visible").first().data("cardFigure") == $(".visible").last().data("cardFigure")) {
                setTimeout(function() {
                    $(".visible").each(function() {
                        $(this).css({opacity:0},{duration:1000}).removeClass("unpaired visible");
                    });
                    game.checkForSuccess();
                }, 500);
            } else {
                setTimeout(function() {
                    $(".visible").each(function() {
                        $(this).css({"background":""}).removeClass("visible");
                    });
                }, 500);
            }
            game.moves++;
            $("#moves").html("" + game.moves);
        },

        // Check if all cards are paired
        checkForSuccess: function() {
            if($(".unpaired").length === 0) {
                $(".container-cards").html("<h1> Congrats! You Won! :) </h1>");
            }
        },

        resetMoves: function() {
            game.moves = 0;
            $("#moves").html("" + game.moves);
        },

        resetTime: function() {
            game.timeCounter = -1;
            $("#sec_timer").html("", game.timeCounter);
        },

        restart: function() {
            $("#restart").click(function() {
                game.resetMoves();
                game.resetTime();
                game.shuffleCards();
            })
        },
            
        initTime: function() {
            setInterval(function () {
                game.timeCounter++;      
                 $("#sec_timer").html("" + game.timeCounter);
            }, 1000);   
        }
    };

    $('#btnStartModal').click(function(){
  		$('#startModal').modal({
    		backdrop: 'static',
    		keyboard: false
        });
        $(this).css({opacity:0},{duration:1000});
	});
    game.init();
    
});