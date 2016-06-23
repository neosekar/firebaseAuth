angular.module('app.services', [])

.factory('AuthFactory', ['$firebaseAuth', function($firebaseAuth){
	return $firebaseAuth();
}])

.factory('dataFactory', [function(){
	return firebase.database().ref();
}])

.factory('StorageFactory',[function(){
	return firebase.storage().ref();
}])

.service('StoreService', ['dataFactory','StorageFactory', '$q' , '$ionicLoading', function(dataFactory, StorageFactory, $q, $ionicLoading){
	this.user = function(data){
		var dfd = $q.defer();
		dataFactory.child('user').child(data.uid).update(data)
			.then(function(res){
				dfd.resolve(res);
			},function(err){
				dfd.reject(err);
			}
		);
		return dfd.promise;
	};
	
	this.image = function(imageURI, fileName){
		var dfd = $q.defer();
		$ionicLoading.show();
		getFileObject(imageURI,fileName, function (fileObject) {
                var metadata = {
                    contentType: 'image/jpeg'
                };
                var uploadTask = StorageFactory.child(fileName).put(fileObject, metadata);

                uploadTask.on('state_changed', function (snapshot) {
                    // Observe state change events such as progress, pause, and resume
                    // See below for more detail
                }, function (error) {
                    // Handle unsuccessful uploads
                    $ionicLoading.hide();
                    dfd.reject(error);
                }, function () {
                    $ionicLoading.hide();
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    dfd.resolve(downloadURL);
                });
         });

		return dfd.promise;	
	};

	var getFileBlob = function (url, cb) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.addEventListener('load', function () {
                cb(xhr.response);
            });
            xhr.send();
    };

    var blobToFile = function (blob, name) {
            blob.lastModifiedDate = new Date();
            blob.name = name;
            return blob;
    };

    var getFileObject = function (filePathOrUrl,fileName, cb) {
            getFileBlob(filePathOrUrl, function (blob) {
                cb(blobToFile(blob, fileName+'.jpg'));
            });
    };
}])
.service('getService', ['dataFactory','$q','$firebaseArray','$firebaseObject',function(dataFactory, $q, $firebaseArray, $firebaseObject){
	this.postAll = function(){
		var dfd = $q.defer();
		var ref = dataFactory.child('posts');
		var list = $firebaseArray(ref);
		list.$loaded()
		  .then(function(x) {
			dfd.resolve(x);
		  })
		  .catch(function(error) {
		    console.log("Error:", error);
		    dfd.reject(error);
		});
		return dfd.promise;
	};
	this.post = function(id){
		var dfd = $q.defer();
		var ref = dataFactory.child('posts').child(id);
		var single = $firebaseObject(ref);
		single.$loaded()
		  .then(function(x) {
			dfd.resolve(x);
		  })
		  .catch(function(error) {
		    console.log("Error:", error);
		    dfd.reject(error);
		}); 
		return dfd.promise;
	};
	
}]);

