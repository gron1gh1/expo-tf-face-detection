import * as React from 'react';
import { StyleSheet, View,Dimensions  } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { Camera } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

const styles = StyleSheet.create({
    camera: {
        position:'absolute',
        top:0,
        left:0,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
        zIndex: 0
    }
});

const TensorCamera = cameraWithTensors(Camera); // tensorflow 사용할 수 있는 카메라 적용.

function Rectangle({ x, y, width, height }) { // 감지됐을 때 사각형 영역.
    return <View style={{
        position: 'absolute',
        borderColor: 'blue',
        borderWidth: 3,
        left: x,
        top: y,
        width: width,
        height: height
    }} />
}

export default function FaceCamera() {
    const [facePoint, SetPoint] = React.useState([{
        x: 0,
        y: 0,
        height: 0,
        width: 0
    }]);
    function handleCameraStream(images, updatePreview, gl) {
        const loop = async () => {
            const nextImageTensor = images.next().value

            // const model = await blazeface.load();
            // const returnTensors = false; // Pass in `true` to get tensors back, rather than values.
            // const predictions = await model.estimateFaces(nextImageTensor, returnTensors);
            // console.log('pred', predictions);
            // if (predictions.length > 0) {
            //   console.log('face detect');
            // }
        }
        loop();
    }
    React.useEffect(() => { // tensorflow 작업 cpu 처리.
        tf.setBackend('cpu');
    }, []);

    React.useEffect(() => { // facePoint 업데이트 될 때 마다 콘솔 출력.
        console.log(facePoint);
    }, [facePoint]);

    function setFacePoint(data) { // 카메라에서 얼굴 찾았을 때 데이터 컴포넌트 변수(State)에 적용.
        if (data.faces.length > 0) {
            SetPoint(data.faces.map((face) => {
                return {
                    x: face.bounds.origin.x,
                    y: face.bounds.origin.y,
                    height: face.bounds.size.height,
                    width: face.bounds.size.width
                }
            })
            )
        }
        else SetPoint([]);
    }
    return (
        <View>
            <TensorCamera
                // Standard Camera props
                style={styles.camera}
                type={Camera.Constants.Type.front} // Camera.Constants.Type.back = 카메라 후면, Camera.Constants.Type.front = 카메라 정면
                // Tensor related props
                onReady={handleCameraStream} // 이해 더 해야하긴 하지만 여기 콜백함수에서 카메라 추후 처리하는 것 같음. 카메라 프레임 가져오기.
                autorender={true} // false하면 카메라 안나옴
                onFacesDetected={setFacePoint} // 얼굴 인식하면 좌표 데이터 콜백함수로 넘김.
            />
            <View style={{ ...styles.camera, zIndex: 10 }} /* 위에 TensorCamera 크기 그대로 가져와서 zIndex로 맨 앞에 가져다 줌. (감지 사각형이 카메라 보다 뒤로 가는걸 방지) */> 
                {/* facePoint 데이터들 사각형으로 출력 */}
                {facePoint.map((faceRect) => <Rectangle x={faceRect.x} y={faceRect.y} width={faceRect.width} height={faceRect.height} />)}
            </View>
        </View>
    )
}