angular.module('app.controllers', [])
  
.controller('postsCtrl', ['$scope','getService', function($scope, getService) {
	$scope.posts = [];
	getService.postAll().then(function(res){
		$scope.posts = res;
		console.log('load data', res);
	},function(err){
		console.log('load data err', err);
	});
}])
      
.controller('loginCtrl', ['$scope','AuthFactory','$state', function($scope, AuthFactory, $state) {
	$scope.user = {};

	$scope.login = function(data){
		AuthFactory.$signInWithEmailAndPassword(data.email, data.password).then(function(firebaseUser) {
		  console.log("Signed in as:", firebaseUser.uid);
		  $state.go('tabsController.posts');
		}).catch(function(error) {
		  console.error("Authentication failed:", error);
		});
	};
}])
   
.controller('signupCtrl',['$scope', 'AuthFactory','StoreService','$state', function($scope, AuthFactory, StoreService, $state) {
	$scope.data = {};
	$scope.userObj = {};
	$scope.signup = function(user){
		AuthFactory.$createUserWithEmailAndPassword(user.email, user.password)
		  .then(function(firebaseUser) {
		    console.log("User " + firebaseUser.uid + " created successfully!");
		    $scope.userObj = {
		    	name:user.username,
		    	email:user.email,
		    	uid:firebaseUser.uid
		    };
		    StoreService.user($scope.userObj).then(function(res){
		    	console.log('user stored', res);
		    	$state.go('tabsController.posts');
		    },function(err){
		    	console.log('user store err', err);
		    });
		  }).catch(function(error) {
	    console.error("Error: ", error);
  		});
	};
	
}])
   
.controller('androidCtrl', ['$scope','$stateParams','getService','$cordovaCamera','StoreService','AuthFactory','dataFactory', function($scope, $stateParams, getService, $cordovaCamera, StoreService, AuthFactory, dataFactory) {
	var postId = $stateParams.id;
	$scope.post = {};
	getService.post(postId).then(function(res){
		$scope.post = res;
	},function(err){
		console.log('load data err', err);
	});

	$scope.updatePic = function(){
		var options = {
      		destinationType: Camera.DestinationType.FILE_URI,
      		sourceType: Camera.PictureSourceType.CAMERA,
    	};

	    $cordovaCamera.getPicture(options).then(function(imageURI) {
	      $scope.post.pic = imageURI;
	      StoreService.image(imageURI, postId).then(function(res){
	      	console.log('store image', res);
	      	$scope.locUpdate = {};
			var userId = AuthFactory.$getAuth().uid;
			$scope.locUpdate['posts/' + postId] = {
				pic : res
			};
			$scope.locUpdate['user-posts/'+ userId + '/'+ postId] ={
				pic:res
			};
			
			dataFactory.update($scope.locUpdate, function(err){
				if(err){
					console.log('update err', err);
				}else{
					console.log('update success');
				}
			});
	      },function(err){
	      	console.log('store image err', err);
	      });
	    }, function(err) {
	      // error
	    });
	};
}])
   
.controller('postFormCtrl',['$scope','dataFactory','AuthFactory','$state', function($scope, dataFactory, AuthFactory, $state) {
	$scope.post = {};
	$scope.postAdd = function(data){
		$scope.locUpdate = {};
		var userId = AuthFactory.$getAuth().uid;
		var postKey = dataFactory.child('posts').push().key;
		$scope.locUpdate['posts/' + postKey] = {
			id : postKey,
			title:data.title,
			desc:data.desc,
			uid:userId
		};

		if(data.pic){
			$scope.locUpdate['posts/'+postKey].pic = data.pic;
		}else{
			$scope.locUpdate['posts/'+postKey].pic = 'img/myJ92Wd7Qtay0aGdviNi_android.jpg';
		}
		$scope.locUpdate['user-posts/'+ userId + '/'+ postKey] ={
			id : postKey,
			title:data.title,
			desc:data.desc,
			uid:userId
		};

		if(data.pic){
			$scope.locUpdate['user-posts/'+ userId + '/'+ postKey].pic = data.pic;
		}else{
			$scope.locUpdate['user-posts/'+ userId + '/'+ postKey].pic = 'img/myJ92Wd7Qtay0aGdviNi_android.jpg';
		}
		
		dataFactory.update($scope.locUpdate, function(err){
			if(err){
				console.log('update err', err);
			}else{
				console.log('update success');
				$state.go('tabsController.posts');
			}
		});
	};
}])
 