import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';

import Main from './Main';
import Payment from './Payment';

const Stack = createStackNavigator();

const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Payment"
        screenOptions={{headerMode: false}}>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Payment" component={Payment} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
