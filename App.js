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

const INJECTED_CODE = `
  (function() {
    function wrap(fn) {
      return function wrapper() {
        var res = fn.apply(this, arguments);
        window.ReactNativeWebView.postMessage('navigationStateChange');
        return res;
      }
    }

    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', function() {
      window.ReactNativeWebView.postMessage('navigationStateChange');
    });
  })();

  true;
  `;

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isReloaded, setIsReloaded] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const webviewRef = useRef<WebView>(null);
  const [navState, setNavState] = useState();
  // test page
  const URL = 'https://dlwhd990.github.io/travelWithDog/';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    // back
    const onPress = () => {
      if (canGoBack) {
        webviewRef.current.goBack();
        return true;
      } else {
        Alert.alert('Hold on!', '앱을 종료하시겠습니까?', [
          {
            text: '취소',
            onPress: () => null,
          },
          {text: '확인', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onPress,
    );

    return () => backHandler.remove();
  }, [canGoBack]);

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

  const onBtn = () => {
    console.log(1);
    PushNotification.localNotification({
      title: 'test',
      message: 'testtest',
      playSound: true,
      soundName: 'default',
      channelId: 'travelwithdog',
    });
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <WebView
        ref={webviewRef}
        style={styles.webContainer}
        onLoadStart={() => webviewRef.current.injectJavaScript(INJECTED_CODE)}
        onNavigationStateChange={props => setCanGoBack(props.canGoBack)}
        // useWebKit={true}
        source={{uri: URL}}
        // javaScriptEnabled={true}
        // sharedCookiesEnabled={true}
        // thirdPartyCookiesEnabled={true}
        onMessage={({nativeEvent}) => setCanGoBack(nativeEvent.canGoBack)}
        // userAgent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
      />
      <Button title="hi" onPress={onBtn} />
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
