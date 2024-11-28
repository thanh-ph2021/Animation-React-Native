import React from 'react'
import GestureHandler from './screens/GestureHandler'
import { createStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from './screens/HomeScreen'

export const PADDING = 10
export const MARGIN = 5
export const RADIUS = 5
export const TEXT_SIZE = 18

export type RootStackParamList = {
    Home: undefined;
    GestureHandler: undefined;
}

const RootStack = createNativeStackNavigator<RootStackParamList>({
    initialRouteName: 'Home',
    screens: {
        Home: HomeScreen,
        GestureHandler: GestureHandler
    },
    screenOptions: {
        headerShown: false
    }
})

const Navigation = createStaticNavigation(RootStack)

function App(): React.JSX.Element {
    return <Navigation />
}

export default App