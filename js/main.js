var LegendOfAdlez = LegendOfAdlez || {};

LegendOfAdlez.game = new Phaser.Game(450, 450, Phaser.AUTO, 'game');

LegendOfAdlez.game.state.add('Boot', LegendOfAdlez.Boot);
LegendOfAdlez.game.state.add('Preload', LegendOfAdlez.Preload);
LegendOfAdlez.game.state.add('MainMenu', LegendOfAdlez.MainMenu);
LegendOfAdlez.game.state.add('Game', LegendOfAdlez.Game);


LegendOfAdlez.game.state.start('Boot');

//Utilities:
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
