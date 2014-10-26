angular.module('starter.controllers', ['forceng'])

.controller('AppCtrl', function($scope, $location, RegistrationService, AuthenticationService, force) {
  $scope.logout = function() {
    RegistrationService.logout();
    $location.path("/home");
  }

  $scope.fbLogin = function() {
    openFB.login(
        function(response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                $scope.closeLogin();
            } else {
                alert('Facebook login failed');
            }
        },
        {scope: 'email,publish_actions'});
  }

  $scope.timeleft = '0 secs';
})

.controller('QuizCtrl', function($scope, $ionicPopup, $ionicLoading, SocketIO, Question, Answer,
                                 AuthenticationService, RegistrationService, UserResponse) {
  $scope.q = {};
  $scope.q.answers = ['one', 'two', 'three'];
  $scope.answer = null;
  $scope.show_leaders = false;
  $scope.correct_answer = null;
  $scope.answerIndex = false;
  $scope.is_admin = AuthenticationService.isAdmin;

  $scope.hasAnswered = function() {
    // Has the user answered the current question already?
    return UserResponse.get($scope.q.id) !== undefined;
  };

  $scope.userAnswerCorrect = function(index) {
    // Is this the index of the user's response, and is it the right answer
    index = index + 1;
    return UserResponse.get($scope.q.id) === index && index === $scope.q.answer_index;
  };

  $scope.userAnswerWrong = function(index) {
    // Is this the index of the user's response, and is it the wrong answer
    index = index + 1;
    return UserResponse.get($scope.q.id) === index && index !== $scope.q.answer_index;
  };

  $scope.isCorrectAnswer = function(index) {
    // Is this the index of the correct answer
    index = index + 1;
    return index === $scope.q.answer_index;
  };

  $scope.saveChoice = function(index) {
    UserResponse.set($scope.q.id, index + 1);
    var a = new Answer({
      question_id: $scope.q.id,
      user_id: '1',
      answer_index: index + 1
    });
    a.$save(function() {
      // Right answer
      $scope.q.answer_index = index + 1;
      $scope.answerIndex = true;
      showLeaders();
    }, function(q) {
      // Wrong answer
      $scope.q.answer_index = q.data.answer_index;
      $scope.answerIndex = true;
      showLeaders();
    });
  };

  Question.query({
    show: true,
    select: ['question', 'answers']
  }, function(rows) {
    $scope.q = rows[0];
    $scope.answerIndex = true;
    check_start();
  });

  function check_start() {
    if ($scope.q.question == 'end') {
      showLeaders();
    }
  }

  SocketIO.on('questions', function(msg) {
    $scope.answerIndex = false;
    $scope.correct_answer = null;

    msg = JSON.parse(msg);

    if (msg.question === 'start') {
      UserResponse.reset();
      return;
    } else if (msg.question === 'end') {
      showLeaders();
      $scope.timer = 1;
      UserResponse.reset();
      return;
    }

    $scope.timer = 3;
    $ionicLoading.show({
      template: 'Next question in 3 seconds...'
    });

    var timer = setInterval(function() {
      $scope.timer--;
      $ionicLoading.show({
        template: 'Next question in ' + $scope.timer + ' seconds...'
      });

      if ($scope.timer <= 0) {
        clearInterval(timer);
        if (msg.question != 'end') {
          hideLeaders();
        }
        $ionicLoading.hide();
        $scope.q = msg;
        check_start();
        $scope.$apply();
      }
    }, 1000);
  });

  SocketIO.on('answer', function(msg) {
    var packet = JSON.parse(msg);
    $scope.correct_answer = packet;
  });

  $scope.$on('$destroy', function(event) {
    SocketIO.removeAllListeners('questions');
    SocketIO.removeAllListeners('answer');
  });

  function showLeaders() {
    $scope.show_leaders = true;
    $scope.leaders = Answer.leaders();
  }

  function hideLeaders() {
    $scope.show_leaders = false;
  }
})

.controller('RegisterCtrl', function($scope, $location, RegistrationService) {
  $scope.user = {
    name: '',
    email: '',
    password: '',
    password2: ''
  };

  $scope.$parent.logout_text = 'Logout';

  $scope.register = function() {
    RegistrationService.register($scope.user).then(function() {
      $location.path("/");
    })
  }
})

.controller('LoginCtrl', function($scope, $location, RegistrationService, AuthenticationService) {
  $scope.user = {
    email: '',
    password: ''
  };

  $scope.$parent.logout_text = 'Register';

  $scope.login = function() {
    RegistrationService.login($scope.user.email, $scope.user.password).then(function() {
      $location.path("/");
    });
  }

  $scope.login2 = function() {
    AuthenticationService.isAuthenticated = true;
    $location.path("/tab");
  }

})

.controller('LeadersCtrl', function($scope, SocketIO, Answer) {
  $scope.leaders = Answer.leaders();

  SocketIO.on('answer', function(msg) {
    $scope.leaders = Answer.leaders();
  });

  $scope.$on('$destroy', function(event) {
    SocketIO.removeAllListeners('answer');
  });

})

.controller('HomeCtrl', function($scope, $location, RegistrationService, AuthenticationService) {
  $scope.login2 = function() {
    AuthenticationService.isAuthenticated = true;
    $location.path("/tab");
  }
})

.controller('ContentCtrl', function($scope, $location, force) {

        $scope.items = [];
          for (var i = 0; i < 50; i++) {
            $scope.items.push('Doingcast ' + ' - 3 Votes');
            $scope.items.push('Mobijob ' + '- 3 Votes');
            $scope.items.push('FLUVIP ' + '- 10 Votes');
            $scope.items.push('Alma Shopping' + '- 3 Votes');
            $scope.items.push('SponzorMe ' + '- 8 Votes');
            $scope.items.push('Authy ' + '- 9 Votes');
            $scope.items.push('Agendor ' + '- 3 Votes');
            $scope.items.push('Tappsi' + '- 4 Votes');
            $scope.items.push('Voice Bunny' + '- 2 Votes');
            $scope.items.push('Blogo' + '- 3 Votes');
            $scope.items.push('Zolvers ' + '- 5 Votes');
            $scope.items.push('sabesim ' + '- 2 Votes');
            $scope.items.push('Chegue.Lá' + '- 1 Votes');
          }

          $scope.getItemHeight = function(item, index) {
            //Make evenly indexed items be 10px taller, for the sake of example
            return (index % 2) === 0 ? 50 : 60;
          };

})


.controller('ContactCtrl', function ($scope, force) {

        $scope.newContact = function() {
            $scope.contact = {FirstName:'', LastName:''};
        };

        $scope.query = function () {
            force.query('select id, firstName, lastName from contact limit 50').then(
                function (contacts) {
                    $scope.contacts = contacts.records;
                },
                function() {
                    alert("An error has occurred. See console for details.");
                });
        };

        $scope.create = function () {
            force.create('contact', $scope.contact).then(
                function (response) {
                    console.log(response);
                },
                function() {
                    alert("An error has occurred. See console for details.");
                });
        };

        $scope.update = function () {
            force.update('contact', $scope.contact).then(
                function (response) {
                    console.log(response);
                },
                function() {
                    alert("An error has occurred. See console for details.");
                });
        };

        $scope.del = function () {
            force.del('contact', $scope.contact.Id).then(
                function (response) {
                    console.log(response);
                },
                function() {
                    alert("An error has occurred. See console for details.");
                });
        };

        $scope.retrieve = function (id) {
            force.retrieve('contact', id, 'id,firstName,lastName').then(
                function (contact) {
                    $scope.contact = contact;
                },
                function() {
                    alert("An error has occurred. See console for details.");
                });
        };

    })
