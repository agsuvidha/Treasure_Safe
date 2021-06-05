var safe, safeImg, player, playerImg, enemyImg;
var count=0;
var enemyGrp;
var enemy;
var flag=1;
var life=3;
var safex,safey;
var lifeA,lifeB,lifeC;
var bg;
var life;
var lives=[];
var startAt,nowAt;
var gameState;

function preload()
{
  safeImg = loadImage("Images/Safe.png");
  playerImg = loadImage("Images/playerstanding.png");
  enemyImg = loadImage("Images/enemy1.png");
  playerRight = loadAnimation("Images/player1.png","Images/player2.png",
  "Images/player3.png","Images/player4.png","Images/player5.png",
  "Images/player6.png","Images/player7.png","Images/player8.png");
  playerLeft = loadAnimation("Images/player1_1.png","Images/player2_1.png",
  "Images/player3_1.png","Images/player4_1.png","Images/player5_1.png",
  "Images/player6_1.png","Images/player7_1.png","Images/player8_1.png");
  playerAttack = loadAnimation("Images/playerattack2.png");
  bg = loadImage("Images/background1.jpg");
  life = loadImage("Images/heart.png");
}

function setup()
 {
  createCanvas(displayWidth-200,displayHeight-200);

  //Stationary safe
  safe = createSprite(displayWidth/2-120, displayHeight/2-100, 30, 60);
  safe.addImage("safe", safeImg);
  safe.setCollider("rectangle",0,0,700,800);
  
  //safe.debug=true;
  safe.scale = 0.1;

//Protecting player
  player = createSprite(displayWidth/3,displayHeight/4,50,50);
  //player.addImage("player", playerImg);
  player.addAnimation("playerRight", playerRight);
  player.addAnimation("playerLeft", playerLeft);
  player.addAnimation("playerAttack", playerAttack);
  
  //Groups for bullet and enemy
  enemyGrp = new Group();
  bulletGrp = new Group();


  safex=safe.x;
  safey=safe.y;
  
  // Life
  lifeA = createSprite(455,35,20,20);
  lifeA.addImage("life", life);
  lifeA.scale = 0.2;
  lifeB = createSprite(515,35,20,20);
  lifeB.addImage("life", life);
  lifeB.scale = 0.2;
  lifeC = createSprite(575,35,20,20);
  lifeC.addImage("life", life);
  lifeC.scale = 0.2;
  lives=[lifeC,lifeB,lifeA];
  startAt=new Date();
  gameState="playing";
}

function draw()
 {
  background(bg);
  
  if(gameState==="playing")
  {
    nowAt=new Date();
    diffS=Math.round((nowAt-startAt)/1000);
  if(diffS>29)
  {
    gameState="Won";
    text("Won");
  }
  //Player movement
  player.x = mouseX;
  player.y = mouseY;

  // Direction of player for changing its animation
  if(player.x>player.previousPosition.x)
  {
    player.changeAnimation("playerRight", playerRight);
  }
  else 
  {
  if(player.x<player.previousPosition.x)
  {
    player.changeAnimation("playerLeft", playerLeft);
  }
}

  //spawning enemies
  enemyA();

  //Destroying enemies when you click on it
  for(var i=0;i<enemyGrp.length;i++)
  {
      if(mousePressedOver(enemyGrp[i]))
      {
        player.changeAnimation("playerAttack", playerAttack);
        enemyGrp[i].destroy();
        if(bulletGrp[i]!==undefined) bulletGrp[i].destroy();
      }
  }

  //for destroying bullet if player touches it
    for(var i=0;i<bulletGrp.length;i++)
    {
        //if(mousePressedOver(bulletGrp[i]))

        if (player.isTouching(bulletGrp[i]))
        {
          //player.changeAnimation("playerAttack", playerAttack);
          //bulletGrp[i];
          bulletGrp[i].visible=false;
          bulletGrp[i].setVelocity(0,0);
          bulletGrp[i].nextLife=frameCount+100;
        }
        if((bulletGrp[i].visible==false) && (frameCount==bulletGrp[i].nextLife))
        {
          resetbullet(i);
        }
        if(safe.isTouching(bulletGrp[i])){
          bulletGrp[i].destroy();
          lives[lives.length-1].destroy();
          lives.pop();
          if(lives.length===0)
          {
            gameState="Lost";
            text("Lost");
          }
        }
        

     }


    drawSprites();
 }
     textSize(22);
     fill("red"); 
    text("Safe HP: ",300,35);
    text("Time : " + diffS,300,55);
    if(gameState!=="playing")
    {
      text(gameState,300,75);
    }
   //text(mouseX+","+mouseY,mouseX,mouseY);

}




function resetbullet(i)
{

  bulletGrp[i].x=enemyGrp[i].x;
  bulletGrp[i].y=enemyGrp[i].y;
  distX=safe.x-bulletGrp[i].x;
    distY=safe.y-bulletGrp[i].y;
    bulletGrp[i].velocityX=distX/50;
    bulletGrp[i].velocityY=distY/50;
    bulletGrp[i].visible=true;
}


function enemyA(){
  
  if (frameCount%120===0 ){
     enemy = createSprite(displayWidth/4,displayHeight/4, 50, 50);
    enemy.setCollider("rectangle",0,0,200,200);
    //enemy.debug = true;
    enemy.addImage("enemy", enemyImg);
    count++;
    var rand=Math.round(random(1,2));
  
    enemy.y=Math.round(random(100,425));
    if(enemy.y>safey)
    {
      flagy=1;
    } 
    else if(enemy.y<safey)
    {
      flagy=2;
    }
    else
    {
      flagy=3;
    }

      
  
    
    if(rand===1)
    {
      enemy.x = Math.round(random(150,330));
      // var bullet=createSprite(enemy.x,enemy.y,10,10);
      // bullet.velocityX=2;
     
      flag=1;
      
      bulletA();
    }
    else
    {
      enemy.x = Math.round(random(720,900));
     
      flag=2;
      bulletA();
    }
    enemy.scale = 0.3;
    enemyGrp.add(enemy);
  }
}
function bulletA()
{
    var bullet=createSprite(enemy.x,enemy.y,10,10);
    bullet.shapeColor="black";
    bulletGrp.add(bullet);
    distX=safe.x-bullet.x;
    distY=safe.y-bullet.y;
    bullet.velocityX=distX/50;
    bullet.velocityY=distY/50;
    //bullet.lifetime=60;
if(bulletGrp.isTouching(safe))
    {
       for(var i=0;i<bulletGrp.length;i++)
      {
          if(bulletGrp[i].isTouching(safe))
          {

          bulletGrp[i].destroy();
          life--;
        }
      }
    }
    safe.depth=bullet.depth+1;
    }