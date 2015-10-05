var TopDownGame = TopDownGame || {};

//Loading the game assets
TopDownGame.Preload = function(){};

TopDownGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/images/tiles.png');
    this.load.image('greencup', 'assets/images/greencup.png');
    this.load.spritesheet('player', 'assets/images/player.png', 32, 32);
    this.load.image('browndoor', 'assets/images/browndoor.png');
    this.load.spritesheet('zeldaBullet', 'assets/images/zeldaBullet.png', 32, 32);
    this.load.spritesheet('goon', 'assets/images/goon.png', 32, 32);
    this.game.load.spritesheet('kaboom', 'assets/images/explosion.png', 64, 64);
  },
  create: function() {
    this.state.start('Game');
  }
};
