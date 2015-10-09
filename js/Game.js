var TopDownGame = TopDownGame || {};

//title screen
TopDownGame.Game = function(){};

var music;
var adlezSpellSound;

TopDownGame.Game.prototype = {
  create: function() {
    this.map = this.game.add.tilemap('world_map');

    //Add music
      music = this.add.audio('adlezSong');
      music.play();

    //First argument: the tileset name as specified in Tiled; Second argument: the key to the asset
    this.map.addTilesetImage('tileset', 'gameTiles');

    //Create layer
    this.blockedLayer = this.map.createLayer('waterLayer');
    this.backgroundlayer = this.map.createLayer('groundLayer1');
    this.backgroundlayer = this.map.createLayer('groundLayer2');
    this.backgroundlayer = this.map.createLayer('groundLayer3');
    this.backgroundlayer = this.map.createLayer('pathLayer1');
    this.backgroundlayer = this.map.createLayer('pathLayer2');
    this.blockedLayer = this.map.createLayer('CANTGOHERE');
    this.foregroundlayer = this.map.createLayer('topLayer1');
    this.foregroundlayer = this.map.createLayer('topLayer2');
    this.foregroundlayer = this.map.createLayer('topLayer3');
    this.foregroundlayer = this.map.createLayer('topLayer4');




    //Collision on blocked layer. 2000 is the number of bricks we can collide into - this is found in the json file for the map
    this.map.setCollisionBetween(1, 2000, true, 'waterLayer');
    this.map.setCollisionBetween(1, 2000, true, 'CANTGOHERE');

    //Resizes game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();

    this.createZeldaBullets();
    this.createGoons();
    this.createExplosions();

    this.createEnemies();



    //create player
    var result = this.findObjectsByType('playerStart', this.map, 'playerStart');


    //we know there is just one result
    this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
    this.game.physics.arcade.enable(this.player);
    this.player.health = 5;

    this.text = this.game.add.text(this.game.camera.x, this.game.camera.y, "Health: " + this.player.health, {
      font: "24px Arial",
      fill: "#ff0044",
      align: "center"
    });

    //the camera follows player
    this.game.camera.follow(this.player);

    //add non-player spritesheets
    this.zeldaBullet = this.game.add.sprite('zeldaBullet');
    this.goons = this.game.add.sprite('goonDown');
    this.chickens = this.game.add.sprite('chicken');


    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.zeldaBulletTime = 0;
    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.player.animations.add('left', [4, 5, 6, 7], 7, true);
    this.player.animations.add('right', [8, 9, 10, 11], 7, true);
    this.player.animations.add('down', [0, 1, 2, 3], 7, true);
    this.player.animations.add('up', [12, 13, 14, 15], 7, true);
    this.zeldaBullets.callAll('animations.add', 'animations', 'left', [8, 9, 10, 11], 7, true);
    this.zeldaBullets.callAll('animations.add', 'animations', 'right', [4, 5, 6, 7], 7, true);
    this.zeldaBullets.callAll('animations.add', 'animations', 'down', [12, 13, 14, 15], 7, true);
    this.zeldaBullets.callAll('animations.add', 'animations', 'up', [0, 1, 2, 3], 7, true);
    this.zeldaBullets.callAll('animations.add', 'animations', 'up', [0, 1, 2, 3], 7, true);
    this.explosions.callAll('animations.add', 'animations', 'kaboom', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], 15, true);
  },

  createEnemies: function() {
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;
    this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
    var enemy;
    result = this.findObjectsByType('chicken', this.map, 'basicEnemyLayer');
    result.forEach(function(element) {
      var key = "chicken" + String(element.id);
      this.chicken = this.enemies.create(element.x, element.y, 'chicken');
      this.chicken.anchor.setTo(0.5, 0.5);
      this.chicken.animations.add('right', [3, 4, 5, 6], 7, true);
      this.chicken.play('right');
      this.chicken.body.moves = false;
      this.chicken.anchor.x = 0.5;
      this.chicken.anchor.y = 0.5;
      this.chicken.health = 1;
      this.chicken.key = key;
      this.tween = this.game.add.tween(this.chicken).to( { x: this.chicken.x+randomIntFromInterval(80,100) }, randomIntFromInterval(400,11000), Phaser.Easing.Linear.None, true, 0, 1000, true);
    }, this);

    result = this.findObjectsByType('goon', this.map, 'basicEnemyLayer');
    result.forEach(function(element) {
      var key = "goon" + String(element.id);
      this.goon = this.enemies.create(element.x, element.y, 'goon');
      this.goon.anchor.setTo(0.5, 0.5);
      this.goon.animations.add('right', [3, 4, 5, 6], 7, true);
      this.goon.play('right');
      this.goon.body.moves = false;
      this.goon.anchor.x = 0.5;
      this.goon.anchor.y = 0.5;
      this.goon.health = 5;
      this.goon.key = key;
      this.tween = this.game.add.tween(this.goon).to( { x: this.goon.x+randomIntFromInterval(80,100) }, randomIntFromInterval(400,11000), Phaser.Easing.Linear.None, true, 0, 1000, true);
    }, this);
  },

  createZeldaBullets: function() {
    this.zeldaBullets = this.game.add.group();
    this.zeldaBullets.enableBody = true;
    this.zeldaBullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.zeldaBullets.createMultiple(30, 'zeldaBullet');
    this.zeldaBullets.setAll('anchor.x', 0.5);
    this.zeldaBullets.setAll('anchor.y', 1);
    this.zeldaBullets.setAll('outOfBoundsKill', true);
    this.zeldaBullets.setAll('checkWorldBounds', true);
  },

  createExplosions: function() {
    this.explosions = this.game.add.group();
    this.explosions.createMultiple(30, 'kaboom');
  },

  createGoons: function() {
    this.goons = this.game.add.group();
    this.goons.enableBody = true;
    this.goons.physicsBodyType = Phaser.Physics.ARCADE;

    this.goon = this.goons.create(48, 50, 'goonDown');
    this.goon.health = 5;
    this.goon.anchor.setTo(0.5, 0.5);
    this.goon.animations.add('goonDown', [0, 1, 2, 3], 20, true);
    this.goon.play('goonDown');
    this.goon.body.moves = true;

    this.goons.x = 250;
    this.goons.y = 100;

    //Add random movement function
    this.tween = this.game.add.tween(this.goons).to( { y: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
  },


  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element) {
      if(element.properties.type === type) {
        element.y -= map.tileHeight;
        element.id = result.length + 1;
        result.push(element);
      }
    });
    return result;
  },


  //fire bullet
  fireBullet: function() {

    if (this.game.time.now > this.zeldaBulletTime) {
      //  Grab the first bullet we can from the pool
      this.zeldaBullet = this.zeldaBullets.getFirstExists(false);

      //Add sound to Adlez bullet
      adlezSpellSound = this.sound.play('adlezSpell', 1, 4);
      if (this.zeldaBullet) {
          //  And fire it
          if (this.player.facing == "right") {
            this.zeldaBullets.callAllExists('play', false, 'right');
            this.zeldaBullet.reset(this.player.x + 30, this.player.y + 30);
            this.zeldaBullet.body.velocity.x = 200;
            this.zeldaBulletTime = this.game.time.now + 200;
          } else if (this.player.facing == "up") {
            this.zeldaBullets.callAllExists('play', false, 'up');
            this.zeldaBullet.reset(this.player.x + 16, this.player.y + 10);
            this.zeldaBullet.body.velocity.y = -200;
            this.zeldaBulletTime = this.game.time.now + 200;
          } else if (this.player.facing == "left") {
            this.zeldaBullets.callAllExists('play', false, 'left');
            this.zeldaBullet.reset(this.player.x + 5, this.player.y + 30);
            this.zeldaBullet.body.velocity.x = -200;
            this.zeldaBulletTime = this.game.time.now + 200;
          } else if (this.player.facing == "down") {
            this.zeldaBullets.callAllExists('play', false, 'down');
            this.zeldaBullet.reset(this.player.x + 16, this.player.y + 40);
            this.zeldaBullet.body.velocity.y = 200;
            this.zeldaBulletTime = this.game.time.now + 200;
          }
      }

    }

  },

  //create a sprite from an object
  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  },

  chickenKiller: function(zeldaBullet, chicken) {
    this.zeldaBullet.kill();
    chicken.kill();
    //  And create an explosion :)
    this.explosion = this.explosions.getFirstExists(false);
    this.explosion.reset(chicken.body.x, chicken.body.y);
    this.explosion.play('kaboom', 30, false, true);
    this.sound.play('boom');
  },

  goonKiller: function(zeldaBullet, goon) {
    this.goon.health -=1;
    this.zeldaBullet.kill();
    if(this.goon.health <= 0){
      this.goon.kill();
      this.explosion = this.explosions.getFirstExists(false);
      this.explosion.reset(this.goon.body.x, this.goon.body.y);
      this.explosion.play('kaboom', 30, false, true);
      this.sound.play('boom');
    }
  },

  zeldaKiller: function(player, goon) {
    this.player.health -=1;
    this.xdirection = this.player.body.x - this.goon.body.x;
    this.ydirection = this.goon.body.y - this.player.body.y;
    this.xbounceVelocity = this.xdirection * 30;
    this.ybounceVelocity = this.ydirection * -30;
      this.player.body.velocity.y = this.ybounceVelocity;

      this.player.body.velocity.x = this.xbounceVelocity;
    if(this.player.health <=0) {
      this.player.kill();
      this.explosion = this.explosions.getFirstExists(false);
      this.explosion.reset(this.player.body.x, this.player.body.y);
      this.explosion.play('kaboom', 30, false, true);
      this.sound.play('boom');
    }
    this.updateText();
  },

  enterDoor: function(player, door) {
    console.log('entering door that will take you to '+door.targetTilemap+' on x:'+door.targetX+' and y:'+door.targetY);
  },

  resetZeldaBullet: function(bullet) {

    //  Called if the bullet goes out of the screen
    this.zeldaBullet.kill();
  },

  updateText: function() {
    text.setText("Health:" + this.player.health);
  },

  update: function() {
    //player movement
    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;
    this.text.x = this.game.camera.x;
    this.text.y = this.game.camera.y;


    if(this.cursors.up.isDown) {
      this.player.facing = "up";
      this.player.body.velocity.y -= 175;
      this.player.animations.play('up');

    } else if(this.cursors.down.isDown) {
      this.player.facing = "down";
      this.player.body.velocity.y +=175;
      this.player.animations.play('down');

    } else if(this.cursors.left.isDown) {
      this.player.facing = "left";
      this.player.body.velocity.x -= 175;
      this.player.animations.play('left');

    } else if(this.cursors.right.isDown) {
      this.player.facing = "right";
      this.player.body.velocity.x +=175;
      this.player.animations.play('right');

    } else if (this.fireButton.isDown) {
      this.fireBullet();
    }else {
      this.player.animations.stop();
    }


    //collission
    this.game.physics.arcade.collide(this.player, this.blockedLayer);
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);
    this.game.physics.arcade.overlap(this.zeldaBullet, this.goon, this.goonKiller, null, this);
    this.game.physics.arcade.overlap(this.zeldaBullet, this.enemies.children, this.chickenKiller, null, this);
    this.game.physics.arcade.overlap(this.player, this.goon, this.zeldaKiller, null, this);

  },

}
