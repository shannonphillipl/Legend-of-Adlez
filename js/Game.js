var TopDownGame = TopDownGame || {};

//title screen
TopDownGame.Game = function(){};

    var music;
    var adlezSpellSound;

//create game instance
TopDownGame.Game.prototype = {
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


        this.createZeldaBullets();
        this.createGannonBullets();
        this.createExplosions();

        this.createEnemies();



//PLAYER
    //player healthbar
        this.text = this.game.add.text(this.game.camera.x, this.game.camera.y, "Health: " + this.player.health,
            {
              font: "24px Arial",
              fill: "#ff0044",
              align: "center"
            });

    //the camera follows player
        this.game.camera.follow(this.player);

    //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.zeldaBulletTime = 0;
        this.gannonBulletTime = 0;

        this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.player.animations.add('left', [4, 5, 6, 7], 7, true);
        this.player.animations.add('right', [8, 9, 10, 11], 7, true);
        this.player.animations.add('down', [0, 1, 2, 3], 7, true);
        this.player.animations.add('up', [12, 13, 14, 15], 7, true);
        this.zeldaBullets.callAll('animations.add', 'animations', 'left', [8, 9, 10, 11], 7, true);
        this.zeldaBullets.callAll('animations.add', 'animations', 'right', [4, 5, 6, 7], 7, true);
        this.zeldaBullets.callAll('animations.add', 'animations', 'down', [12, 13, 14, 15], 7, true);
        this.zeldaBullets.callAll('animations.add', 'animations', 'up', [0, 1, 2, 3], 7, true);
        this.gannonBullets.callAll('animations.add', 'animations', 'shoot', [0, 1, 2, 3, 4, 5], 10, true);
        this.explosions.callAll('animations.add', 'animations', 'kaboom', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], 15, true);



//Non-Playable Characters
    //create boss
        var nonnagResult = this.findObjectsByType('nonnagStart', this.map, 'basicEnemyLayer');
            this.nonnag = this.game.add.sprite(nonnagResult[0].x-15, nonnagResult[0].y, 'nonnag');
            this.game.physics.arcade.enable(this.nonnag);
            this.nonnag.health = 10;
            this.game.add.tween(this.nonnag).to( { x: this.nonnag.x+randomIntFromInterval(30,50) }, randomIntFromInterval(400,800), Phaser.Easing.Linear.None, true, 0, 1000, true);

    //add non-player spritesheets
        this.zeldaBullet = this.game.add.sprite('zeldaBullet');
        this.gannonBullet = this.game.add.sprite('gannonBullet');

        this.goons = this.game.add.sprite('goonDown');
        this.chickens = this.game.add.sprite('chicken');

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
                this.chicken.animations.add('right', [3, 4, 5, 6], 7, true);
                this.chicken.play('right');
                this.chicken.body.moves = false;
                this.chicken.anchor.x = 0.5;
                this.chicken.anchor.y = 0.5;
                this.chicken.health = 1;
                this.tween = this.game.add.tween(this.chicken).to( { x: this.chicken.x+randomIntFromInterval(80,100) }, randomIntFromInterval(400,11000), Phaser.Easing.Linear.None, true, 0, 1000, true);
            }, this);

            //goon
            result = this.findObjectsByType('goon', this.map, 'basicEnemyLayer');
            result.forEach(function(element) {
                this.goon = this.enemies.create(element.x, element.y, 'goon');
                this.goon.anchor.setTo(0.5, 0.5);
                this.goon.animations.add('down', [0, 1, 2, 3], 20, true);
                this.goon.play('down');
                this.goon.body.moves = false;
                this.goon.anchor.x = 0.5;
                this.goon.anchor.y = 0.5;
                this.goon.health = randomIntFromInterval(5,10);
                this.tween = this.game.add.tween(this.goon).to( { y: this.goon.y+randomIntFromInterval(60,80) }, randomIntFromInterval(400,600), Phaser.Easing.Linear.None, true, 0, 1000, true);
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


//BULLETS
    //player bullets
        createZeldaBullets: function() {
            this.zeldaBullets = this.game.add.group();
            this.zeldaBullets.enableBody = true;
            this.zeldaBullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.zeldaBullets.createMultiple(40, 'zeldaBullet');
            this.zeldaBullets.setAll('anchor.x', 0.5);
            this.zeldaBullets.setAll('anchor.y', 1);
            this.zeldaBullets.setAll('outOfBoundsKill', true);
            this.zeldaBullets.setAll('checkWorldBounds', true);
        },

    //boss bullets
        createGannonBullets: function() {
            this.gannonBullets = this.game.add.group();
            this.gannonBullets.enableBody = true;
            this.gannonBullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.gannonBullets.createMultiple(200, 'gannonBullet');
            this.gannonBullets.setAll('anchor.x', 0.5);
            this.gannonBullets.setAll('anchor.y', 1);
            this.gannonBullets.setAll('outOfBoundsKill', true);
            this.gannonBullets.setAll('checkWorldBounds', true);
        },

    //fire player bullets
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

    //fire boss bullets
        fireGannonBullet: function() {
            if (this.game.time.now > this.gannonBulletTime) {
                //  Grab the first bullet we can from the pool
                this.gannonBullet = this.gannonBullets.getFirstExists(false);
                if (this.gannonBullet) {
                    this.gannonBullets.callAllExists('play', false, 'shoot');
                    this.gannonBullet.reset(this.nonnag.x+20, this.nonnag.y + 30);
                    this.gannonBullet.body.velocity.y = 200;
                    this.gannonBulletTime = this.game.time.now + randomIntFromInterval(80,800);
                }
            }
        },

    //remove enemy from map
        enemyKiller: function(zeldaBullet, enemy) {
            this.zeldaBullet.kill();

            if (enemy.key == "chicken") {
                this.explosion = this.explosions.getFirstExists(false);
                this.explosion.reset(enemy.body.x, enemy.body.y);
                this.explosion.play('kaboom', 30, false, true);
                this.sound.play('boom');
                this.sound.play('adlezLaugh');
                enemy.kill();
            } else if (enemy.key == "goon") {
                enemy.health -=1;
                this.zeldaBullet.kill();

                if(enemy.health <= 0){
                    enemy.kill();
                    this.explosion = this.explosions.getFirstExists(false);
                    this.explosion.reset(enemy.body.x, enemy.body.y);
                    this.explosion.play('kaboom', 30, false, true);
                    this.sound.play('boom');
                    this.sound.play('adlezLaugh');
                }
            } else if (enemy.key == "nonnag") {
                enemy.health -=1;
                this.zeldaBullet.kill();
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

    //remove zelda from map
        zeldaKiller: function(player, enemy) {
            this.xdirection = this.player.body.x - enemy.body.x;
            this.ydirection = enemy.body.y - this.player.body.y;
            this.xbounceVelocity = this.xdirection * 40;
            this.ybounceVelocity = this.ydirection * -40;
            this.player.body.velocity.y = this.ybounceVelocity;
            this.player.body.velocity.x = this.xbounceVelocity;
                if (enemy.key == "gannonBullet") {
                  player.health -=1
                }
                if (enemy.key == "goon") {
                  player.health -=1;
                }
                if(player.health <=0) {
                  this.player.kill();
                  this.explosion = this.explosions.getFirstExists(false);
                  this.explosion.reset(this.player.body.x, this.player.body.y);
                  this.explosion.play('kaboom', 30, false, true);
                  this.sound.play('boom');
                }
            this.updateText();
        },

    //updates health upon hit
        updateText: function() {
            this.text.setText("Health:" + this.player.health);
        },

    //animation for death
        createExplosions: function() {
            this.explosions = this.game.add.group();
            this.explosions.createMultiple(30, 'kaboom');
        },

    //remove bullet if offscreen
        resetZeldaBullet: function(bullet) {
            this.zeldaBullet.kill();
        },

    //remove bullet if offscreen
        resetGannonBullet: function(bullet) {
            this.gannonBullet.kill();
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


    update: function() {
        //player movement
        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;
        this.text.x = this.game.camera.x;
        this.text.y = this.game.camera.y;

        this.fireGannonBullet();


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


        //collision
            this.game.physics.arcade.collide(this.player, this.blockedLayer);
            this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
            this.game.physics.arcade.overlap(this.zeldaBullet, this.goon, this.goonKiller, null, this);

        //HERE!
            this.game.physics.arcade.overlap(this.player, this.gannonBullet, this.zeldaKiller, null, this);
            this.game.physics.arcade.overlap(this.zeldaBullet, this.enemies.children, this.enemyKiller, null, this);
            this.game.physics.arcade.overlap(this.player, this.enemies.children, this.zeldaKiller, null, this);
            this.game.physics.arcade.overlap(this.zeldaBullet, this.nonnag, this.enemyKiller, null, this);
    },
}
