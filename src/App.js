/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useRef, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  BackHandler,
  Alert,
  Button,
  Text,
} from 'react-native';
import {WebView} from 'react-native-webview';
import SplashScreen from 'react-native-splash-screen';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import BackgroundFetch from 'react-native-background-fetch';
import Router from './router';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isReloaded, setIsReloaded] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const webviewRef = useRef<WebView>(null);
  const [navState, setNavState] = useState();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    // noti
    PushNotification.configure({
      onNotification: notification => console.log(notification),

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
    });
    PushNotification.createChannel(
      {
        channelId: 'travelwithdog', // (required)
        channelName: 'travelwithdog', // (required)
      },
      created => console.log(`CreateChannel returned '${created}'`),
    );

    BackgroundFetch.configure(
      {
        minimumFetchInterval: 1,
      },
      async taskId => {
        console.log('Received backgroundf-fetch event: ', taskId);
        PushNotificationIOS.addNotificationRequest({
          title: 'ttest',
          id: 1,
        });
        PushNotification.localNotification({
          title: 'test',
          message: 'testtest',
          playSound: true,
          soundName: 'default',
          channelId: 'travelwithdog',
        });

        console.log('push msg');

        BackgroundFetch.finish(taskId);
      },
      error => {
        console.log('backgroundfetch failed to start');
      },
    );
    SplashScreen.hide();

    const onRemoteNotification = notification => {
      const isClicked = notification.getData().userInteraction === 1;

      if (isClicked) {
        // Navigate user to another screen
      } else {
        // Do something else with push notification
      }
    };

    const type = 'notification';
    PushNotificationIOS.addEventListener(type, onRemoteNotification);
    return () => {
      PushNotificationIOS.removeEventListener(type);
    };
  }, []);

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Router />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
  },
});

export default App;
