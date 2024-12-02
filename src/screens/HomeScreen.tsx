import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/native'

import { PADDING, RADIUS, RootStackParamList, TEXT_SIZE } from '../Utils'

function HomeScreen() {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const dataScreen = [{
        title: 'Gesture Handler',
        onPress: () => navigation.navigate('GestureHandler')
    }]

    return (
        <View style={{}}>
            <Text style={styles.title}>Animation React Native</Text>
            <View style={styles.listContainer}>
                {dataScreen.map(item => {
                    return (
                        <TouchableOpacity key={item.title} style={styles.item} onPress={item.onPress}>
                            <Text style={styles.text}>{item.title}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        padding: 8,
        marginBottom: 20
    },
    text: {
        fontSize: TEXT_SIZE,
        color: 'white',
        textAlign: 'center'
    },
    listContainer: {
        paddingHorizontal: PADDING
    },
    item: {
        backgroundColor: '#03a5fc',
        paddingVertical: PADDING,
        borderRadius: RADIUS
    }
})

export default HomeScreen