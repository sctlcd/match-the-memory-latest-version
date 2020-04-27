$(document).ready(function() {
    // game namespace/game variable  
    var game = {
        cards: [1,1,2,2,3,3,4,4,5,5,6,6],
        init: function() {
            game.shuffle();
        },
        // Iterate through the array Card and each time generate a random number 
        // then swapping numbers which going to shuffle cards
        shuffle: function() {
            var random = 0;
            var temp = 0;
            for ( i = 1; i < game.cards.length; i++) {
                random = Math.round(Math.random() * i);
                temp = game.cards[i];
                game.cards[i] = game.cards[random];
                game.cards[random] = temp;
            }
            console.log(game.cards);
        }
    };

    game.init();
});