import { Image, Pressable, useAnimatedValue, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { width } from '../../Utils'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Gesture, GestureDetector, PanGestureHandler } from 'react-native-gesture-handler'
import LightBox from './LightBox'
import { useState } from 'react'

const GestureHandler1 = () => {

    const [visible, setVisible] = useState(false)
    const scale = useSharedValue(1)
    const saveScale = useSharedValue(1)
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)

    const pinGesture = Gesture.Pinch()
        .onUpdate((e) => {
            if (e.scale > 1) {
                scale.value = e.scale
            }
        })
        .onEnd(() => {
            scale.value = withTiming(1)
        })

    const panGesture = Gesture.Pan()
        .onUpdate(({ translationX, translationY }) => {
            // translateX.value = translationX
            // translateY.value = translationY
        })
        .onEnd(() => {
            // translateX.value = withTiming(0)
            // translateY.value = withTiming(0)
        })

    const imageContainerStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translateX.value },
            { translateY: translateY.value }
        ]
    }))

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <Pressable onPress={() => {
                setVisible(pre => !pre)
                console.log('click')
            }}>
                <GestureDetector gesture={pinGesture}>
                    <Animated.View style={imageContainerStyle}>
                        <FastImage
                            style={{ width: width - 10, height: 200, borderRadius: 10 }}
                            source={require('./assets/natural1.jpeg')}
                        />
                    </Animated.View>
                </GestureDetector>
            </Pressable>
            <LightBox visible={visible} onRequestClose={() => setVisible(false)} source={require('./assets/natural1.jpeg')} />
        </View>
    )
}

export default GestureHandler1