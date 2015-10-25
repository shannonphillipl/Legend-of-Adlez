var LegendOfAdlez = LegendOfAdlez || {};

//Title
LegendOfAdlez.MainMenu = function(){};

LegendOfAdlez.MainMenu.prototype = {
  create: function() {
    //show map scrolling in background
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'map');
    this.background.autoScroll(-1170, 0);

    //Start game
    var text = "Press SPACE to begin";
    var style = { font: "30px Arial", fill: "#fff", align: "center" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2, text, style);
    t.anchor.set(0.5);

    this.startButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  update: function() {
    if(this.startButton.isDown) {
      this.game.state.start('Game');
    }
  }
}
