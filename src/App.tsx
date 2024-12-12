import React from 'react'
import { createStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import GestureHandler from './screens/GestureHandler'
import HomeScreen from './screens/HomeScreen'
import { RootStackParamList } from './Utils'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import GestureHandler1 from './screens/GestureHandler1'
import GallaryView from './screens/GallaryView'

const RootStack = createNativeStackNavigator<RootStackParamList>({
    initialRouteName: 'Home',
    screens: {
        Home: HomeScreen,
        GestureHandler: GestureHandler,
        GestureHandler1: GestureHandler1,
        GallaryView: GallaryView
    },
    screenOptions: {
        headerShown: false
    }
})

const Navigation = createStaticNavigation(RootStack)

function App(): React.JSX.Element {
    return <GestureHandlerRootView>
        <Navigation />
    </GestureHandlerRootView>
}

export default App