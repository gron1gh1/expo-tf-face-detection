import * as React from 'react';
import { Text, View } from 'react-native';
import FaceCamera from './FaceCamera';

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync(); // 카메라 권한설정
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ display:'flex'}}>
      <FaceCamera />
    </View>
  );
}