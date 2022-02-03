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

const App = ({navigation}) => {
  const [isReloaded, setIsReloaded] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const webviewRef = useRef<WebView>(null);
  const [navState, setNavState] = useState();
  // test page
  const URL = 'https://dlwhd990.github.io/travelWithDog/';
  function onMessage(e) {
    console.log(e);
    setCanGoBack(e.nativeEvent.canGoBack);
    /* 리액트로부터 post message를 받았을때 트리거 된다 */
    try {
      /* post message에서 가맹점 식별코드, 결제 데이터 그리고 액션 유형을 추출한다 */
      console.warn(e.nativeEvent.data);
      const {userCode, data, type} = JSON.parse(e.nativeEvent.data);
      const params = {userCode, data};
      /* 결제 화면으로 이동한다 */
      // console.warn(userCode, data, type);
      navigation.push(type === 'payment' ? 'Payment' : 'Certification', params);
    } catch (e) {
      console.warn('ONMESSAGE', e.message);
    }
  }

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

  return (
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
      onMessage={onMessage}
      // userAgent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
    />
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
