angular.module('ngPortfolio').controller('duelController', function($scope){
  var newPlayer = function(name, health, charge){
      return {name: name, health: health, charge: charge};
  }

  var computerChoice = function(){
    return aiLogic(Math.floor(Math.random()*3 +1));
  }

  var aiLogic = function(option){
    //Cannot attack with 0 charge, either block or charge
    while(option==1 && $scope.computer.charge == 0){
      option = computerChoice();
      if(option != 1){
        return option;
      }
    }

    //Charge is higher than health, so favor attacking
    if($scope.computer.charge >= $scope.player.health){
      return (Math.floor(Math.random()*10) > 7 ?  computerChoice() : 1);
    }

    //Player has higher charge, so 60% of the time block
    if($scope.player.charge >= $scope.computer.health){
      return (Math.floor(Math.random()*10) >= 5 ?  1 : 3);
    }

    //Player has 0 charge, so no point in blocking. Attack is already if you have 0 charge so dont have to worry about that
    if($scope.player.charge == 0 && option == 3){
      return (Math.floor(Math.random()*2) + 1);
    }

    return option;
  }

  var resolve = function(option){
    $scope.clear();
    //1 is attack, 2 is charge, 3 is Block
    var compChoice = computerChoice();


    if(compChoice == 1 && option == 3){
      $scope.addAlert('success',"You blocked the Computer!")
      $scope.computer.charge = 0;
      return;
    }
    if(compChoice == 3 && option == 1){
      $scope.addAlert('danger',"The Computer blocked you!")
      $scope.player.charge = 0;
      $scope.status = 0;
      return;
    }

    if(option == 1){
      $scope.computer.health-=$scope.player.charge;
      $scope.addAlert('success',"You hit the Computer for "+$scope.player.charge+"!");
      $scope.player.charge = 0;
      $scope.status = 0;

    }else if(option==2){
      $scope.status = -1;
      $scope.player.charge+=1;
      $scope.addAlert('success',"You just charged up!");
    }else if(option==3){
      $scope.addAlertMessage('You blocked nothing!');
    }
    if(compChoice == 1){
      $scope.player.health-=$scope.computer.charge;
      $scope.addAlert('danger',"The Computer hit you for "+$scope.computer.charge+"!");
      $scope.computer.charge=0;
    }else if(compChoice == 2){
      $scope.computer.charge+=1;
      $scope.addAlert('danger',"The Computer just charged up!");
    }else if(compChoice == 3){
      $scope.addAlertMessage('Computer blocked nothing!');
    }
    check();
  }

  var check = function(){
    if($scope.computer.health == 0 && $scope.player.health == 0){
      $scope.clear();
      $scope.finished = true;
      $scope.addAlertMessage("You Tied!");
    }else if($scope.computer.health <= 0){
      $scope.clear();
      $scope.finished = true;
      $scope.addAlert('success',"You Won!");
    } else if($scope.player.health <= 0){
      $scope.clear();
      $scope.finished = true;
      $scope.addAlert('danger',"You Lost!");
    }
    if($scope.player.charge == 0){
      $scope.status = 0;
    }
  }

  $scope.choose = function(val){
    if(val == 1 && $scope.player.charge == 0){
      $scope.addAlert("You do not have enough charge");
    }else{
      resolve(val);
    }
  }

  $scope.reset = function(){
    $scope.addAlertMessage(`Welcome to duel. You will fight a computer. 'Attack' will strike the computer with your entire charge,
    depleting it back down to 0. 'Charge' will increase the damage your attack can do. 'Block' will nullify any damage done
    by the computer that turn.`);
    $scope.clear();
    $scope.computer = newPlayer("Computer",10,1);
    $scope.player = newPlayer("Stig", 10, 1);
    $scope.finished = false;
    $scope.status = -1;
  }

  //Alerts
  $scope.alerts = [

  ];

  $scope.addAlert = function(type,message) {
    $scope.alerts.push({type:type, msg: message});
  };

  $scope.addAlertMessage = function(message) {
    $scope.alerts.push({msg: message});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.clear = function() {
    $scope.alerts=[];
  };

  $scope.addAlertMessage(`Welcome to duel. You will fight a computer. \n\t'Attack' will strike the computer with your entire charge,
  depleting it back down to 0. \n\t'Charge' will increase the damage your attack can do. \n\t'Block' will nullify any damage done
  by the computer that turn.`);

  $scope.options=["Attack", "Charge", "Block"];

  $scope.finished = false;
  $scope.status = -1;

  $scope.computer = newPlayer("Computer",10,1);
  $scope.player = newPlayer("Stig", 10, 1);

}).component('duel', {
  controller: function(){},
  templateUrl: "app/components/duel/duel.html"
});
