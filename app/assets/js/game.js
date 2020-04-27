$(document).ready(function() {
    // game namespace/game variable  
    var game = {
        cards: [1,1,2,2,3,3,4,4,5,5,6,6],
        init: function() {
            game.shuffle();
        },
        // Iterate over the cards array and each time generate a random number 
        // then swapping numbers which shuffles cards and then, after cards are shuffled, assign cards
        shuffle: function() {
            var random = 0;
            var temp = 0;
            for ( i = 1; i < game.cards.length; i++) {
                random = Math.round(Math.random() * i);
                temp = game.cards[i];
                game.cards[i] = game.cards[random];
                game.cards[random] = temp;
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
        // Display the figure of the card on-click and add the class attibute 'selected' to the selected card.
        clickCardHandlers: function() {
            $(".card").click (function() {
                $(this).html("<p>" + $(this).data("cardFigure") + "</p>").addClass("visible");
                game.checkForPairedCards();
            });
        },
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
                    }, 1000);
                }
            }
        },
        checkForSuccess: function() {
            if($("unpaired").length == 0) {
                $(".container-cards").html('<h1> Congrats! You Won! :) </h1>');
            }
        }
    };
    game.init();
});