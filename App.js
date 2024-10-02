import { Platform, StyleSheet } from 'react-native';
import Map from './screens/Map';
import MainAppBar from './components/MainAppBar';
import Constants from 'expo-constants';
import React, { useState } from 'react';
import * as Location from 'expo-location';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Settings from './screens/Settings';

const settings = {
  backgroundColor: '#00a484'
}

const icons = {
  location_not_known: 'crosshairs',
  location_searching: 'crosshairs-question',
  location_found: 'crosshairs-gps'
}

const Stack = createNativeStackNavigator()

export default function App() {
  const [location, setLocation] = useState({
    latitude: 65.0800,
    longitude: 25.4800,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });

  const [icon, setIcon] = useState(icons.location_not_known)
  const [mapType, setMapType] = useState('standard')

  const getUserPosition = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    try {
      if (status !== 'granted') {
        console.log('Geolocation failed')
        return
      }
      setIcon(icons.location_searching)

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      })

      setIcon(icons.location_found)
    } catch (error) {
      console.log(error)
      setIcon(icons.location_not_known)
    }
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Map'
          screenOptions={{
            header: (props) =>
              <MainAppBar {...props}
                backgroundColor={settings.backgroundColor}
                icon={icon}
                getUserPosition={getUserPosition}
              />
          }}
        >
          <Stack.Screen name='Map'>
            {() =>
              <Map location={location} mapType={mapType} />
            }
          </Stack.Screen>
          <Stack.Screen name='Settings'>
            {() =>
              <Settings backgroundColor={settings.backgroundColor} mapType={mapType} setMapType={setMapType} />
            }
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
});