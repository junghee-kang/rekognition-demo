# Rekognition101 Demo



## 실습 개요 

Amazon Rekognition와 관리형 서비스를 활용하여 사물 인식, 안면 인식 등 딥러닝 기반의 대표적인 컴퓨터 비전 주제를 활용한 웹 애플리케이션 작성해보는 것이 본 실습의 목적입니다. 이 실습을 통해 사용자 확인이나 감정 분석 등 다양한 유스케이스로 확장 가능한 실시간 안면 인식 기능을 빠르고 간편하게 구현할 수 있습니다.

 
## 실습 준비                                                                                    
실습은 **20-30분** 정도가 소요되며 이 랩을 수행하려면 다음이 필요합니다. 

#### 구성 가이드 
[http://bit.ly/2pjEQAv](http://bit.ly/2pjEQAv)

#### AWS 계정
본 워크샵을 진행하려면 AWS 기본 계정을 준비해야 합니다. AWS IAM, S3, DynamoDB,  Rekognition 에 접근할 수 있어야 하며, 본 가이드는 한명이 하나의 AWS 계정을 사용한다고 가정합니다. 다른 사람과 계정을 공유하려고 하면 특정 리소스에 대해 충돌이 발생하므로 권장하지 않습니다.

본 워크샵의 일환으로 시작하는 대부분의 리소스는 AWS 계정이 12개월 미만인 경우, 제공하는 AWS 프리티어로 충분히 가능합니다. 프리티어를 넘어서는 경우, 과금이 될 수도 있습니다. 따라서, 새로운 실습용 계정을 만드시길 권장합니다. 자세한 내용은 [AWS 프리 티어 페이지](https://aws.amazon.com/free/)를 참조하십시오.
#### AWS 명령 행 인터페이스
본 워크샵의 첫 번째 모듈을 완료하려면 여러분이 사용하는 컴퓨터에 AWS CLI (Command Line Interface)가 설치되어 있어야합니다. CLI를 사용하여 개체를 S3 웹 사이트 버킷에 복사하고, Rekognition API를 호출합니다.
AWS CLI 시작하기 안내서에 따라 시스템에 CLI를 설치 및 구성하십시오.
#### Git 클라이언트 설치
#### Node.js 환경 구성 (Local Test 수행 시)
#### Firefox 브라우저
#### Web Cam 


## 환경 배포                                                                                    

### 1. Git Repository 복제 
```
git clone https://github.com/junghee-kang/rekognition-demo.git
```

### 2. CloudFormation 스택 생성
 
포함되어 있는 CloudFormation 템플릿 파일(cfn_template.json)을 통해 스택을 생성합니다. 

Rekognition이 사용가능한 리전 선택해야합니다. 

![](/Users/jungheek/workspace/deeplearning/lab4/diagram_cfn.png)


### 3. Application 수정 및 배포 

#### js/config.js 파일 수정 
CloudFormation으로 생성된 Output을 바탕으로 Application 환경 파일(js/config.js)을 수정합니다.  face_collection은 추후 7번 과정에서 사용할 얼굴 메타데이터 보관소로 원하는 이름을 지정하면 됩니다.
	
```
region: 'us-east-1',
upload_bucket_name: 'demogo-s3upload',
identity_pool_id: 'us-east-1:XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXXXXXX',
face_collection :'rekognition-demo-go',
ddb_table:'rekognition-demo-go'
```

#### 수정된 Application을 s3 배포합니다. (WebsiteURL의 Bucket 이름 사용) 
```
# 프로젝트의 최상위 경로(rekognition-demo)에서 
aws s3 cp . s3://YOUR_Bucket_NAME --recursive --acl public-read
```


## 실시간 얼굴인식 데모

실시간 얼굴인식을 위해서는 입력된 얼굴의 메타데이터만 보관하는 저장소인 Face Collection을 먼저 생성해야 합니다. 

아래의 AWS CLI 명령을 이용해 생성해봅니다. Id는 config.js와 동일하게 입력하면 됩니다.

``` 
$ aws rekognition create-collection --collection-id rekognition-demo-go --region us-east-1
```
