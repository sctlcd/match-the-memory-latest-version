    $(document).ready(function() {
    
    // game namespace/game variable  
    var game = {
        cards: ["A", "A", "B", "B", "C", "C", "D", "D"],
        moves: 0,
        init: function(moves) {
            game.resetMoves();
            game.shuffleCards();
        },

        // Iterate over the cards array and each time generate a random number 
        // then switching numbers which shuffles cards and add the html element relative to each individual card with the classes card and unpaired
        // and then, after cards are shuffled, assign cards
        shuffleCards: function() {
            var switching = 0;
            var temp = 0;
            for ( i = 0; i < game.cards.length ; i++) {
                switching = Math.round(Math.random() * i);
                temp = game.cards[i];
                game.cards[i] = game.cards[switching];
                game.cards[switching] = temp;
                $(".col-cards").append('<div class="card unpaired"></div>');
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

        // Display the figure of the card on-click and add the class attibute "visible" to the selected card.
        clickCardHandlers: function() {
            $(".card").click (function() {
                $(this).html("<p>" + $(this).data("cardFigure") + "</p>").addClass("visible");
                
                game.checkForPairedCards();
            });
        },

        // Check if a pair of cards have a similar figure, make the paired ones disapeared and hide the figures of the unpaired ones after a timeout interval
        checkForPairedCards: function() {
            if ($(".visible").length == 2) {
                if($(".visible").first().data("cardFigure") == $(".visible").last().data("cardFigure")) {
                    $(".visible").each(function() {
                        $(this).hide().removeClass("unpaired");
                    });
                    $(".visible").each( function() {
                        $(this).removeClass("visible");
                    });
                    game.checkForSuccess();
                } else {
                    setTimeout(function() {
                        $(".visible").each(function() {
                            $(this).html("").removeClass("visible");
                        });
                    }, 500);
                }
                game.moves++;
                $("#moves").html("" + game.moves);
            }
        },

        // Check if all cards are paired
        checkForSuccess: function() {
            if($(".unpaired").length === 0) {
                $(".container-cards").html('<h1> Congrats! You Won! :) </h1>');
            }
        },

        // Start a new game 
        restart: function() {
            $("#restart").click(function() {
                $(".col-cards").empty();
                game.init();
            })
            },
            
        // Reset moves counter
        resetMoves: function() {
            game.moves = 0;
            $("#moves").html("" + game.moves);
        }
    };
    game.init();
    game.restart();  
});