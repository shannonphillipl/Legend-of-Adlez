var TopDownGame = TopDownGame || {};

TopDownGame.Boot = function(){};

//set game config and loading assets for the loading screen:
TopDownGame.Boot.prototype = {
  preload: function() {
    //assets for loading screen:
    this.load.image('preloadbar', 'assets/images/preloader-bar.png');
  },
  create: function() {
    //loading screen has white background:
    this.game.stage.backgroundColor = "#fff";

    //scaling options:
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //Center horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //set screen size automatically
    this.scale.setScreenSize(true);

    //physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.state.start('Preload');
  }
};
