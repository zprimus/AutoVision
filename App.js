import React from 'react';
import { 
	Text, 
	View, 
	TouchableOpacity,
	Image,
	StyleSheet,
	ImageStore
} from 'react-native';

import { Camera, Permissions } from 'expo';
//import vision from 'react-cloud-vision-api';
import firebase from './Firebase.js';
import ImagePicker from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';
//import vision from '@google-cloud/vision';


export default class CameraExample extends React.Component { 
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    vehicleMake: '',
  	vehicleModel: '',
  	vehicleYear: '',
  	vehicleTrim: '',
  	vehicleExteriorColor: '',
  	encodedData: ''
  };

  async componentDidMount() { // check for camera/storage permissions
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    this.setState({ hasCameraPermission: status === 'granted' });
    console.log();
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View/>;
    } else if (hasCameraPermission === false) {
      return <Text style={{position: 'absolute', bottom: 0}}>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          	<Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref; }}>
          	<View style={{ flex: 1, alignItems: 'stretch' }}>
            	<View style={{ paddingTop: 20}}>
	        		<Text style={styles.dataText}>
		        		Make: {this.state.vehicleMake}
		        		{'\n'}
		        		Model: {this.state.vehicleModel}
		        		{'\n'}
		        		Year: {this.state.vehicleYear}
		        		{'\n'}
		        		Trim: {this.state.vehicleTrim}
		        		{'\n'}
		        		Color: {this.state.vehicleExteriorColor}
		        	</Text>
	        	</View>
            	<View style={styles.btnView}>
		        	<TouchableOpacity onPress={this.flipPicButton}>
			          	<Image style={styles.imagestyle} source={require('./reverseBtn.png')} />
		        	</TouchableOpacity>
		        	<TouchableOpacity onPress={this.takePicButton}>
			          	<Image style={styles.imagestyle} source={require('./takePicBtn.png')} />
		        	</TouchableOpacity>
		        	<TouchableOpacity onPress={this.galleryPicButton}>
			          	<Image style={styles.imagestyle} source={require('./galleryBtn.png')} />
		        	</TouchableOpacity>
	        	</View>
	        </View>
          	</Camera>
        </View>
      );
    }
  }	

	///////////////// functions /////////////////
	
  	//vision = require('react-cloud-vision-api');
	//vision.init({auth: 'AIzaSyAtyTodvNfMXRyd9bUbX76muoVfv9NZSno'})

  	firebaseQuery = () => {
  		idTag = 84664;
  		
		query = firebase.database().ref(idTag).once('value', function(snapshot) {
  			snapshot.forEach(function(childSnapshot) {
			    var childKey = childSnapshot.key;
			    var childData = childSnapshot.val();
			});
		});
		console.log(query);
  	}	

  	flipPicButton = () => {
		this.setState(
  		{
    		type: this.state.type === Camera.Constants.Type.back
      		? Camera.Constants.Type.front
      		: Camera.Constants.Type.back,
  		});		
	}

	galleryPicButton = () => {
		//this.updateText;
		ImagePicker.showImagePicker(null, (response) => {
		  console.log('Response = ', response);

		  if (response.didCancel) {
		    console.log('User cancelled image picker');
		  }
		  else if (response.error) {
		    console.log('ImagePicker Error: ', response.error);
		  }
		  else {
		    let source = { uri: response.uri };
		  }
		});
	}

	takePicButton = async () => {
		if (this.camera) { //photo {height, uri, width}
			let photo = await this.camera.takePictureAsync();
			console.log('Pic was taken');
			console.log(photo.uri);

			
			//vision = require('@google-cloud/vision')
/*
			var visionClient = vision({
			  projectId: 'api-testing-183418',
			  keyFilename: './ApiKeyFile.json'
			});

			var gcsImageUri = photo.uri;
			var source = {
			    gcsImageUri : gcsImageUri
			};
			var image = {
			    source : source
			};
			var type = vision.v1.types.Feature.Type.FACE_DETECTION;
			var featuresElement = {
			    type : type
			};
			var features = [featuresElement];
			var requestsElement = {
			    image : image,
			    features : features
			};
			var requests = [requestsElement];
			visionClient.batchAnnotateImages({requests: requests}).then(function(responses) {
			    var response = responses[0];
			    // doThingsWith(response)
			    console.log(response);
			})
			.catch(function(err) {
			    console.error(err);
			});
*/
/*
			ImageStore.getBase64ForTag(photo.uri, (base64Data) => {		
				const vision = require('react-cloud-vision-api')
				vision.init({auth: 'AIzaSyAtyTodvNfMXRyd9bUbX76muoVfv9NZSno'})
				const req = new vision.Request({
				  image: new vision.Image({
				    base64: base64Data,
				  }),
				  features: [
				    new vision.Feature('LABEL_DETECTION', 1),
				  ]
				})		
				console.log(req);
      		}, (reason) => console.error(reason));

				//let request =  this.requestLabelDetection;
			*/	


		} else {
			console.log('Pic was NOT taken');
		}
	};

	 requestLabelDetection = async () => {
	 	console.log('hi');
		await fetch('https://vision.googleapis.com/v1/images:annotate', {
        	method: 'POST',
            body: JSON.stringify({
                "requests": [
                    {
                        "image": {
                            "content": this.state.encodedData
                        },
                        "features": [
                            {
                                "type": "LABEL_DETECTION"
                            }
                        ]
                    }
                ]
            })
        }).then((response) => {
            return response.json();
        }, (err) => {
            console.error('promise rejected')
            console.error(err)
        });
	}

	updateText = () => {
      	this.setState(
      	{
      		vehicleMake: 'Chrysler',
      		vehicleModel: 'Sebring',
		  	vehicleYear: '2007',
		  	vehicleTrim: 'LT',
		  	vehicleExteriorColor: 'Silver'
      	});
	}

	
	
}

const styles = StyleSheet.create({	
	btnView: {
		flex: 1,
	    flexDirection: 'row',
	    justifyContent: 'space-between',
	    alignItems: 'baseline',
	    position: 'absolute', 
	    left: 0, 
	    right: 0, 
	    bottom: 0
	},
	imagestyle: {
	},
	dataText: {
		color: '#FFFFFF',
		backgroundColor: '#000000',
		fontWeight: 'bold'
	}
});