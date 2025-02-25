function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      attackValue: 0,
      currentRound: 0,
      battleResult: "",
      gameOver:false,
      battleLog: []
    };
  },
  computed: {
    monsterBarStyle() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyle() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    specialAttackEnable() {
        if (this.gameOver){
            return true
          }else{
            return this.currentRound % 3 !== 0 ? true : false;
          }
    },
    healEnabled() {
      if (this.gameOver){
        return true
      }else{
        return this.playerHealth < 100 ? false : true;
      }
        
    },
    gameOverCheck(){
        return this.gameOver;
    },
    

  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        //draw
        this.battleResult = "draw";
        this.setGameOver()
      } else if (value <= 0) {
        //Monster wins
        this.battleResult = "monster";
        this.setGameOver()
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        //draw
        this.battleResult = "draw";
        this.setGameOver()
      } else if (value <= 0) {
        //Player wins
        this.battleResult = "player";
        this.setGameOver()
      }
    },
  },
  methods: {
    startGame(){
        this.playerHealth = 100,
        this.monsterHealth= 100,        
        this.currentRound = 0,
        this.battleResult = "",
        this.gameOver = false;
        this.battleLog =[];
    },
    addLogMessage(who1, who2, what,value){
            if (value === 'surrender'){
                this.battleLog.unshift('You surrendered!');    
            }else{
                this.battleLog.unshift({
                    actionBy: who1,
                    actionTo: who2,
                    actionType: what,
                    actionValue:value
                })
            }
            
    },
    attackMonster() {
      console.log("Player attacks the monster!");
      this.incrementRound();
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth -= attackValue;
      this.addLogMessage('player','monster','attack',attackValue)

      //Monster retaliates
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.playerHealth -= attackValue;    
      this.addLogMessage('monster','player','attack',attackValue)
    },

    //Only use 1 every 3 turns
    specialAttack() {
      this.incrementRound();
      const attackValue = getRandomValue(10, 25);
      this.monsterHealth -= attackValue;
      this.addLogMessage('player','monster','special-attack',attackValue)
      
      //Monster retaliates
      this.attackPlayer();
    },
    healPlayer() {
      if (this.playerHealth === 100) {
        return;
      }
      this.incrementRound();
      const healValue = getRandomValue(8, 20);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.addLogMessage('player','player','heal',healValue)
        this.playerHealth += healValue;
      }
      this.attackPlayer();
    },
    incrementRound() {
      this.currentRound++;
    },
    surrender(){
        this.playerHealth = 0;
        this.setGameOver();
        this.addLogMessage('You', '', 'surrendered!','surrender')
    },
    setGameOver(){
        this.gameOver = true;
    }
    
  },
});
app.mount("#game");
