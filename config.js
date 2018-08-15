angular.module('config', [])
  .constant('config',
  {
    prod: {
      region: 'ap-northeast-1',
      upload_bucket_name: 'your_bucket_name',
      identity_pool_id: 'ap-northeast-1:your_pool_id',
      face_collection: 'rekognition-demo-go',
      ddb_table: 'rekognition-demo-go'

    }
  }
  )
  ;

