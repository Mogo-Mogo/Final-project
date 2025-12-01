import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

export default function Page() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/(tabs)/study');
  }, []);

  return <View />;
}

/*import { Redirect } from 'expo-router';

export default function Page() {
  return <Redirect href={"/(tabs)/study"} />;
}*/