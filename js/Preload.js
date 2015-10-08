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
    this.load.tilemap('world_map', 'assets/tilemaps/world_map/world_map_no_terrain.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/tilemaps/world_map/tileset.png');
    this.load.image('greencup', 'assets/images/greencup.png');
    this.load.spritesheet('player', 'assets/images/player.png', 32, 32);
    this.load.image('browndoor', 'assets/images/browndoor.png');
    this.load.spritesheet('zeldaBullet', 'assets/images/zeldaBullet.png', 32, 32);
    this.load.spritesheet('goonDown', 'assets/images/goonDown.png', 32, 32);
    this.load.spritesheet('chicken', 'assets/images/chicken.png', 32, 32);
    this.game.load.spritesheet('kaboom', 'assets/images/explosion.png', 64, 64);
    this.load.spritesheet('goonUp', 'assets/images/goonUp.png', 32, 32);

    this.load.audio('adlezSong', ['assets/audio/adlezSong.mp3', 'assets/audio/adlezSong.ogg']);

    this.load.audio('adlezSpell', ['assets/audio/adlezSpell.mp3', 'assets/audio/adlezSpell.ogg']);
    this.load.audio('adlezStep', ['assets/audio/adlezStep.mp3', 'assets/audio/adlezStep.ogg']);

  },
  create: function() {
    this.state.start('Game');
  }
};

