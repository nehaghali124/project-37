var dog,happyDog,sadDog,database,foodS,foodStock;
var sadDogImg,happyDogImg;
var feed,addFood;
var food;
var fedTime;
var lastFed;
var currentTime;
var readState,gameState;
var bedroom,garden,washroom;
var bedroomImg,gardenImg,washroomImg;

function preload()
{
  sadDogImg = loadImage("images/Dog.png");
  happyDogImg = loadImage("images/Happy.png");
  bedroomImg = loadImage("images/Bed Room.png");
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/Wash Room.png");
}

function setup() {
  database = firebase.database();

  createCanvas(1000,550);

  food = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
  lastFed = data.val();

  });

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  });

  dog = createSprite(850,250,15,15);
  dog.addImage(sadDogImg);
  dog.scale = 0.25;

  feed = createButton("Feed The Dog");
  feed.position(685,100);
  feed.mousePressed(feedDog);
  addFood = createButton("Add Food");
  addFood.position(795,100);
  addFood.mousePressed(addFoods);

}
function draw() {

  currentTime=hour();

  if(currentTime==(lastFed+1)){
      update("Playing");
      food.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      food.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      food.washroom();
   }else{
    update("Hungry")
    food.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDogImg);
    
   }
 
  drawSprites();
}
function readStock(data)
{
  foodS = data.val();
  food.updateFoodStock(foodS);
}

function feedDog()
{
    dog.addImage(happyDogImg);
    food.updateFoodStock(food.getFoodStock()-1);
    database.ref('/').update({
      Food : food.getFoodStock(),
      FeedTime : hour(),
      gameState : "Hungry"
    })
}
function addFoods()
{
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}