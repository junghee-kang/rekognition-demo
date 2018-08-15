function ObjectDetectController($scope, $interval, $http, config) {
  var cfg = config.prod;

  region = cfg.region; // Region
  creds = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: cfg.identity_pool_id,
  });

  AWS.config.update({
    region: region,
    credentials: creds
  });
  var rekognition = new AWS.Rekognition({ apiVersion: '2016-06-27' });

  var identityId = AWS.config.credentials.identityId;
  console.log('Identity ID (Unauthenticated) : ', identityId);

  var bucketName = cfg.upload_bucket_name;

  $scope.bucket_images = null;

  var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: { Bucket: bucketName }
  });

  // Utils for UI 
  function toggleBtn(btn, action) {
    if (action == "loading") {
      btn.html(btn.data("loading-text"));
      btn.attr("disabled", "disabled");
    }
    else if (action == "reset") {
      btn.html(btn.data("original-text"));
      btn.removeAttr("disabled");
    }
  }
  $scope.toggleLoader = function (spinner, action) {
    if (spinner != null) {
      if (action == "show") {
        spinner.css({
          height: spinner.parent().height(),
          width: spinner.parent().width()
        });
        spinner.show();
      }
      else if (action == "hide") {
        spinner.hide();
      }
    }
  }
  // end of Utils for UI     
  $scope.change_filename = function () {
    var files = document.getElementById('image_file').files;
    if (!(files != null && files.length > 0)) {
      $("#custom-file-control").attr("data-content", "Choose file...");
    }
    else $("#custom-file-control").attr("data-content", files[0].name);
  };

  $scope.upload_photo = function () {
    toggleBtn($("#btn_upload"), "loading");

    var files = document.getElementById('image_file').files;
    if (!(files != null && files.length > 0)) {
      toastr.error('There was no file selected.');
      toggleBtn($("#btn_upload"), "reset");
      return;
    }
    var file = files[0];

    var path_prefix = '';
    var random_number = Math.floor(Math.random() * 9000000000);
    var file_key = path_prefix + random_number + "_" + file.name;

    s3.upload({
      Key: file_key,
      Body: file,
      ACL: 'public-read'
    }, function (err, data) {
      if (err) {
        toggleBtn($("#btn_upload"), "reset");
        $scope.$apply();
        return toastr.error('There was an error uploading your photo: ', err.message);
      }
      toastr.success('Successfully Uploaded photo.');
      toggleBtn($("#btn_upload"), "reset");

      //var Obj = { Key: file_key, URL: data.Location };
      //$scope.bucket_images.push(Obj);
      refreshGallery();
      $scope.$apply();
    });
    //clear file input
    document.getElementById('image_file').value = "";
    $("#custom-file-control").attr("data-content", "Choose file...");
  };

  $scope.delete_photo = function (photoKey, index) {
    keys = [];
    keys.push({ Key: photoKey });
    var params = {
      Delete: { Objects: keys }
    };
    s3.deleteObjects(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        return toastr.error('There was an error deleting your photo: ', err.message);
      }
      toastr.success('Successfully deleted photo.');
      $scope.bucket_images.splice(index, 1);
      refreshGallery();
      // $scope.$apply();
    });
  };

  refreshGallery = function () {
    s3.listObjects(function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else    // successful response
      {
        var href = this.request.httpRequest.endpoint.href;
        var bucketUrl = href + bucketName + '/';
        var photos = data.Contents.map(function (photo, index) {
          var Obj = { Key: photo.Key, URL: bucketUrl + encodeURIComponent(photo.Key), LastModified: photo.LastModified,index:index };
          return Obj;
        });
        $scope.bucket_images = photos;
        $scope.$apply();
      }
    });
  };

  //Rekogniton API example : detectLabels
  $scope.detect_labels = function (photoKey, index) {
    if ($scope.bucket_images[index].Item) return;

    var params = {
      Image: {
        S3Object: {
          Bucket: bucketName,
          Name: photoKey
        }
      },
      MaxLabels: 10,
      MinConfidence: 0
    };

    rekognition.detectLabels(params, function (err, data) {
      if (err) {
        toastr.error('There was an error to access to Rekognition : ', err.message);
      }
      else {
        $scope.bucket_images[index].Item = data.Labels;
        $scope.bucket_images[index].time = 0;
      }
      $scope.$apply();
    });
  };

  //Rekogniton API example : detectModerationLabels
  $scope.detect_moderation_labels = function (photoKey, index) {
    if ($scope.bucket_images[index].Item_Moderation) return;

    var params = {
      Image: { /* required */
        S3Object: {
          Bucket: bucketName,
          Name: photoKey
        }
      },
      MinConfidence: 0.0
    };
    rekognition.detectModerationLabels(params, function (err, data) {
      if (err) {
        toastr.error('There was an error to access to Rekognition : ', err.message);
      }
      else {
        $scope.bucket_images[index].Item_Moderation = data.ModerationLabels;
        console.log($scope.bucket_images[index]);
        //$scope.bucket_images[index].time = (response.config.responseTimestamp - response.config.requestTimestamp) / 1000;
        $scope.bucket_images[index].time = 0;
      }
      $scope.$apply();
    });
  };

  // on-load event
  angular.element(window.document.body).ready(function () {
    refreshGallery();
  });
}

angular.module('object-detect-controller', []).controller('ObjectDetectController', ObjectDetectController);

