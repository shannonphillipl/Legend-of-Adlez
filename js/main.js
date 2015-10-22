var TopDownGame = TopDownGame || {};

TopDownGame.game = new Phaser.Game(260, 260, Phaser.AUTO, 'game');

TopDownGame.game.state.add('Boot', TopDownGame.Boot);
TopDownGame.game.state.add('Preload', TopDownGame.Preload);
TopDownGame.game.state.add('Game', TopDownGame.Game);


TopDownGame.game.state.start('Boot');

//Utilities:
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
