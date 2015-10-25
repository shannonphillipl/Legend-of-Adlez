var LegendOfAdlez = LegendOfAdlez || {};

//title screen
LegendOfAdlez.Game = function(){};

    var music;
    var adlezSpellSound;

//create game instance
LegendOfAdlez.Game.prototype = {
    create: function() {
        this.map = this.game.add.tilemap('world_map');

        //Add music
          music = this.add.audio('adlezSong');
          music.play();

        //First argument: the tileset name as specified in Tiled; Second argument: the key to the asset
        this.map.addTilesetImage('tileset', 'gameTiles');


//MAP
    //Create map
        this.blockedLayer = this.map.createLayer('waterLayer');
        this.backgroundLayer = this.map.createLayer('groundLayer1');
        this.backgroundLayer = this.map.createLayer('groundLayer2');
        this.backgroundLayer = this.map.createLayer('groundLayer3');
        this.backgroundLayer = this.map.createLayer('pathLayer1');
        this.backgroundLayer = this.map.createLayer('pathLayer2');

        //create player
            var result = this.findObjectsByType('playerStart', this.map, 'playerStart');
            this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
            this.game.physics.arcade.enable(this.player);
            this.player.health = 10;
            for (i = 1; i <= 10; i++) {
                $('#game-frame').append('<img src="/assets/images/heart.png" height="72em" width="72em">');
            }

        this.blockedLayer = this.map.createLayer('CANTGOHERE');
        this.foregroundLayer = this.map.createLayer('topLayer1');
        this.foregroundLayer = this.map.createLayer('topLayer2');
        this.foregroundLayer = this.map.createLayer('topLayer3');
        this.foregroundLayer = this.map.createLayer('topLayer4');

        this.foregroundLayer.bringToTop();

        //Resizes game world to match the layer dimensions
        this.backgroundLayer.resizeWorld();



    //collisions
      //Collision on blocked layer. 2000 is the number of bricks we can collide into - this is found in the json file for the map
      this.map.setCollisionBetween(1, 2000, true, 'waterLayer');
      this.map.setCollisionBetween(1, 2000, true, 'CANTGOHERE');


        this.createAdlezBullets();
        this.createNonagBullets();
        this.createExplosions();

        this.createEnemies();



//PLAYER

    //the camera follows player
        this.game.camera.follow(this.player);

    //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.adlezBulletTime = 0;
        this.nonagBulletTime = 0;

        this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.restartButton = [];

        this.player.animations.add('left', [4, 5, 6, 7], 7, true);
        this.player.animations.add('right', [8, 9, 10, 11], 7, true);
        this.player.animations.add('down', [0, 1, 2, 3], 7, true);
        this.player.animations.add('up', [12, 13, 14, 15], 7, true);
        this.adlezBullets.callAll('animations.add', 'animations', 'left', [8, 9, 10, 11], 7, true);
        this.adlezBullets.callAll('animations.add', 'animations', 'right', [4, 5, 6, 7], 7, true);
        this.adlezBullets.callAll('animations.add', 'animations', 'down', [12, 13, 14, 15], 7, true);
        this.adlezBullets.callAll('animations.add', 'animations', 'up', [0, 1, 2, 3], 7, true);
        this.nonagBullets.callAll('animations.add', 'animations', 'shoot', [0, 1, 2, 3, 4, 5], 10, true);
        this.explosions.callAll('animations.add', 'animations', 'kaboom', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], 15, true);



//Non-Playable Characters
    //create boss
        var nonagResult = this.findObjectsByType('nonnagStart', this.map, 'basicEnemyLayer');
            this.nonag = this.game.add.sprite(nonagResult[0].x-15, nonagResult[0].y, 'nonag');
            this.game.physics.arcade.enable(this.nonag);
            this.nonag.health = 10;
            this.game.add.tween(this.nonag).to( { x: this.nonag.x+randomIntFromInterval(30,50) }, randomIntFromInterval(400,800), Phaser.Easing.Linear.None, true, 0, 1000, true);

    //add non-player spritesheets
        this.adlezBullet = this.game.add.sprite('adlezBullet');
        this.nonagBullet = this.game.add.sprite('nonagBullet');

    },
    //create NPC's
        createEnemies: function() {
            this.enemies = this.game.add.group();
            this.enemies.enableBody = true;
            this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
            var enemy;

            //chicken!
            result = this.findObjectsByType('chicken', this.map, 'basicEnemyLayer');
            result.forEach(function(element) {
                this.chicken = this.enemies.create(element.x, element.y, 'chicken');
                this.chicken.anchor.setTo(0.5, 0.5);
                this.chicken.animations.add('right', [3, 4, 5, 6], 6, true);
                this.chicken.animations.add('left', [7, 8], 6, true);
                this.chicken.prevX = this.chicken.x;
                this.chicken.body.moves = false;
                this.chicken.anchor.x = 0.5;
                this.chicken.anchor.y = 0.5;
                this.chicken.health = 1;
                this.tween = this.game.add.tween(this.chicken).to( { x: this.chicken.x+randomIntFromInterval(80,100) }, randomIntFromInterval(7000,20000), Phaser.Easing.Linear.None, true, 0, 1000, true);
            }, this);

            //goon
            result = this.findObjectsByType('goon', this.map, 'basicEnemyLayer');
            result.forEach(function(element) {
                this.goon = this.enemies.create(element.x, element.y, 'goon');
                this.goon.anchor.setTo(0.5, 0.5);
                this.goon.animations.add('down', [0, 1, 2, 3], 10, true);
                this.goon.animations.add('up', [4, 5, 6, 7], 10, true);
                this.goon.prevY = this.goon.y;
                this.goon.body.moves = false;
                this.goon.anchor.x = 0.5;
                this.goon.anchor.y = 0.5;
                this.goon.health = 5;
                this.tween = this.game.add.tween(this.goon).to( { y: this.goon.y+randomIntFromInterval(60,80) }, randomIntFromInterval(800,1000), Phaser.Easing.Linear.None, true, 0, 1000, true);
            }, this);

        },

        //create a sprite from an object
        createFromTiledObject: function(element, group) {
            var sprite = group.create(element.x, element.y, element.properties.sprite);

            //copy all properties to the sprite
            Object.keys(element.properties).forEach(function(key){
                sprite[key] = element.properties[key];
            });
        },

        //places sprite in designated area
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

//BULLETS
    //player bullets
        createAdlezBullets: function() {
            this.adlezBullets = this.game.add.group();
            this.adlezBullets.enableBody = true;
            this.adlezBullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.adlezBullets.createMultiple(40, 'adlezBullet');
            this.adlezBullets.setAll('anchor.x', 0.5);
            this.adlezBullets.setAll('anchor.y', 1);
            this.adlezBullets.setAll('outOfBoundsKill', true);
            this.adlezBullets.setAll('checkWorldBounds', true);
        },

    //boss bullets
        createNonagBullets: function() {
            this.nonagBullets = this.game.add.group();
            this.nonagBullets.enableBody = true;
            this.nonagBullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.nonagBullets.createMultiple(200, 'nonagBullet');
            this.nonagBullets.setAll('anchor.x', 0.5);
            this.nonagBullets.setAll('anchor.y', 1);
            this.nonagBullets.setAll('outOfBoundsKill', true);
            this.nonagBullets.setAll('checkWorldBounds', true);
        },

    //fire player bullets
        fireBullet: function() {
            if (this.game.time.now > this.adlezBulletTime) {
                //  Grab the first bullet we can from the pool
                this.adlezBullet = this.adlezBullets.getFirstExists(false);
            //Add sound to Adlez bullet
            adlezSpellSound = this.sound.play('adlezSpell', 1, 4);
                if (this.adlezBullet) {
                //  And fire it
                    if (this.player.facing == "right") {
                        this.adlezBullets.callAllExists('play', false, 'right');
                        this.adlezBullet.reset(this.player.x + 30, this.player.y + 30);
                        this.adlezBullet.body.velocity.x = 200;
                        this.adlezBulletTime = this.game.time.now + 200;
                        this.adlezBullet.lifespan = 1000;
                    } else if (this.player.facing == "up") {
                        this.adlezBullets.callAllExists('play', false, 'up');
                        this.adlezBullet.reset(this.player.x + 16, this.player.y + 10);
                        this.adlezBullet.body.velocity.y = -200;
                        this.adlezBulletTime = this.game.time.now + 200;
                        this.adlezBullet.lifespan = 1000;
                    } else if (this.player.facing == "left") {
                        this.adlezBullets.callAllExists('play', false, 'left');
                        this.adlezBullet.reset(this.player.x + 5, this.player.y + 30);
                        this.adlezBullet.body.velocity.x = -200;
                        this.adlezBulletTime = this.game.time.now + 200;
                        this.adlezBullet.lifespan = 1000;
                    } else if (this.player.facing == "down") {
                        this.adlezBullets.callAllExists('play', false, 'down');
                        this.adlezBullet.reset(this.player.x + 16, this.player.y + 40);
                        this.adlezBullet.body.velocity.y = 200;
                        this.adlezBulletTime = this.game.time.now + 200;
                        this.adlezBullet.lifespan = 1000;
                    }
                }
            }
        },

    //fire boss bullets
        fireNonagBullet: function() {
            if (this.game.time.now > this.nonagBulletTime) {
                //  Grab the first bullet we can from the pool
                this.nonagBullet = this.nonagBullets.getFirstExists(false);
                if (this.nonag.health <= 0) {
                  this.nonagBullet = false;
                }
                if (this.nonagBullet) {
                    this.nonagBullets.callAllExists('play', false, 'shoot');
                    this.nonagBullet.reset(this.nonag.x+20, this.nonag.y + 30);
                    this.nonagBullet.body.velocity.y = 200;

                    this.nonagBullet.lifespan = 770;
                    this.nonagBulletTime = this.game.time.now + randomIntFromInterval(1500,3000);
                }
            }
        },

    //remove enemy from map
        enemyKiller: function(adlezBullet, enemy) {
            this.adlezBullet.kill();

            if (enemy.key == "chicken") {
                this.explosion = this.explosions.getFirstExists(false);
                this.explosion.reset(enemy.body.x, enemy.body.y);
                this.explosion.play('kaboom', 30, false, true);
                this.sound.play('boom');
                this.sound.play('adlezLaugh');
                enemy.kill();
            } else if (enemy.key == "goon") {
                enemy.health -=1;
                this.adlezBullet.kill();

                if(enemy.health <= 0){
                    enemy.kill();
                    this.explosion = this.explosions.getFirstExists(false);
                    this.explosion.reset(enemy.body.x, enemy.body.y);
                    this.explosion.play('kaboom', 30, false, true);
                    this.sound.play('boom');
                    this.sound.play('adlezLaugh');
                }
            } else if (enemy.key == "nonag") {
                enemy.health -=1;
                console.log(enemy.health);
                this.adlezBullet.kill();
                if(enemy.health <= 0){
                    enemy.kill();
                    this.explosion = this.explosions.getFirstExists(false);
                    this.explosion.reset(enemy.body.x, enemy.body.y);
                    this.explosion.play('kaboom', 30, false, true);
                    this.sound.play('boom');
                    this.sound.play('adlezLaugh');
                }
            }
        },

    //remove adlez from map
        adlezKiller: function(player, enemy) {
            this.xdirection = this.player.body.x - enemy.body.x;
            this.ydirection = enemy.body.y - this.player.body.y;
            this.xbounceVelocity = this.xdirection * 40;
            this.ybounceVelocity = this.ydirection * -40;
            this.player.body.velocity.y = this.ybounceVelocity;
            this.player.body.velocity.x = this.xbounceVelocity;
                if (enemy.key == "nonagBullet") {
                  player.health -=1;
                  $('img:last-child').remove();
                }
                if (enemy.key == "goon") {
                  player.health -=1;
                  $('img:last-child').remove();
                }
                if(player.health <=0) {
                  this.player.kill();
                  this.explosion = this.explosions.getFirstExists(false);
                  this.explosion.reset(this.player.body.x, this.player.body.y);
                  this.explosion.play('kaboom', 30, false, true);
                  this.sound.play('boom');
                  this.fireButton = [];
                  this.gameOver();
                }
        },

    //animation for death
        createExplosions: function() {
            this.explosions = this.game.add.group();
            this.explosions.createMultiple(30, 'kaboom');
        },

    //remove bullet if offscreen
        resetAdlezBullet: function() {
          this.adlezBullet.kill();
        },

    //remove bullet if offscreen
        resetNonagBullet: function() {
            this.nonagBullet.kill();
        },

    //Updates chickens animation. First, we search for all chickens and put them in array. Then, we see which direction they're moving and set the animation.
        updateChickenAnimation: function() {
          var chickensArray = [];
          this.enemies.forEach(function(enemy) {
            if (enemy.key == "chicken") {
              chickensArray.push(enemy);
            }
          });

          chickensArray.forEach(function(chicken) {
            if (chicken.x > chicken.prevX) {
              chicken.play('right');
            } else {
              chicken.play('left');
            }
            chicken.prevX = chicken.x;
          });
        },

    //Updates chickens animation. First, we search for all chickens and put them in array. Then, we see which direction they're moving and set the animation.
        updateGoonAnimation: function() {
          var goonsArray = [];
          this.enemies.forEach(function(enemy) {
            if (enemy.key == "goon") {
              goonsArray.push(enemy);
            }
          });

          goonsArray.forEach(function(goon) {
            if (goon.y > goon.prevY) {
              goon.play('down');
            } else {
              goon.play('up');
            }
            goon.prevY = goon.y;
          });
        },

        gameOver: function() {
          var text = "Eluryh will fall if you don't"
          var text2 = "press SPACE to restart!";
          var style = { font: "30px Arial", fill: "#fff", align: "center" };
          var t = this.game.add.text(this.player.x, this.player.y, text, style);
          var t2 = this.game.add.text(this.player.x, this.player.y+50, text2, style);
          t.anchor.set(0.5);
          t2.anchor.set(0.5);
          this.restartButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        },

    update: function() {
        //player movement
        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;

        this.fireNonagBullet();

        if(this.restartButton.isDown) {
          this.game.state.start('MainMenu', true, false);
        }

        if(this.cursors.up.isDown) {
            this.player.facing = "up";
            this.player.body.velocity.y -= 175;
            this.player.animations.play('up');

        } else if(this.cursors.down.isDown) {
            this.player.facing = "down";
            this.player.body.velocity.y += 175;
            this.player.animations.play('down');

        } else if(this.cursors.left.isDown) {
            this.player.facing = "left";
            this.player.body.velocity.x -= 175;
            this.player.animations.play('left');

        } else if(this.cursors.right.isDown) {
            this.player.facing = "right";
            this.player.body.velocity.x += 175;
            this.player.animations.play('right');

        } else if (this.fireButton.isDown) {
            this.fireBullet();
        }else {
            this.player.animations.stop();
        }

        //Update NPC animations
          this.updateChickenAnimation();
          this.updateGoonAnimation();

        //collision
            this.game.physics.arcade.collide(this.player, this.blockedLayer);
            this.game.physics.arcade.collide(this.nonagBullet, this.blockedLayer, this.resetNonagBullet, null, this);
            this.game.physics.arcade.collide(this.adlezBullet, this.blockedLayer, this.resetAdlezBullet, null, this);
            this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);

        //Player interactions (magic, running into enemies, etc)
            this.game.physics.arcade.overlap(this.adlezBullet, this.goon, this.goonKiller, null, this);
            this.game.physics.arcade.overlap(this.player, this.nonagBullet, this.adlezKiller, null, this);
            this.game.physics.arcade.overlap(this.adlezBullet, this.enemies.children, this.enemyKiller, null, this);
            this.game.physics.arcade.overlap(this.player, this.enemies.children, this.adlezKiller, null, this);
            this.game.physics.arcade.overlap(this.adlezBullet, this.nonag, this.enemyKiller, null, this);
    },
}
