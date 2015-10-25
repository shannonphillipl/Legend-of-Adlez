var LegendOfAdlez = LegendOfAdlez || {};

//Title
LegendOfAdlez.MainMenu = function(){};

LegendOfAdlez.MainMenu.prototype = {
  create: function() {
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'map');
  }
}
