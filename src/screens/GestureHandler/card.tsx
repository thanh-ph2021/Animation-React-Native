import { Dimensions, Image, StyleSheet, View } from 'react-native'
import { Gesture, GestureDetector, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import Animated, { Easing, useAnimatedGestureHandler, useAnimatedReaction, useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated'
import { snapPoint } from 'react-native-redash'
import { useEffect } from 'react'

const { width, height } = Dimensions.get('screen')

const aspectRatio = 722 / 368
const CARD_WIDTH = width - 128
const CARD_HEIGHT = CARD_WIDTH * aspectRatio
const IMAGE_WIDTH = CARD_WIDTH * 0.9
const side = (width + CARD_WIDTH + 100) / 2
const SNAP_POINTS = [-side, 0, side]
const DURATION = 200

type CardProps = {
    card: {
        source: ReturnType<typeof require>
    },
    index: number,
    shuffleBack: Animated.SharedValue<boolean>
}

const Card = ({ card: { source }, index, shuffleBack }: CardProps) => {
    const offset = useSharedValue({ x: 0, y: 0 })
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(-height - 100)
    const theta = -10 + Math.random() * 20
    const rotateZ = useSharedValue(theta)
    const scale = useSharedValue(1)

    useAnimatedReaction(
        () => shuffleBack.value,
        () => {
            if (shuffleBack.value) {
                const delay = index * 150
                translateX.value = withDelay(
                    delay,
                    withSpring(0, {}, () => { shuffleBack.value = false })
                )
                rotateZ.value = withDelay(
                    delay,
                    withSpring(theta)
                )
            }
        }
    )

    useEffect(() => {
        const delay = index * DURATION
        translateY.value = withDelay(
            delay,
            withTiming(0, { easing: Easing.inOut(Easing.quad) })
        )
        rotateZ.value = withDelay(
            delay,
            withTiming(theta, { easing: Easing.inOut(Easing.quad) })
        )
    }, [translateY, index, rotateZ, theta])

    const gesture = Gesture.Pan()
        .onBegin(() => {
            offset.value = { x: translateX.value, y: translateY.value }
            scale.value = withTiming(1.1, { easing: Easing.inOut(Easing.quad) })
            rotateZ.value = withTiming(0, { easing: Easing.inOut(Easing.quad) })
        })
        .onUpdate(({ translationX, translationY }) => {
            translateX.value = offset.value.x + translationX
            translateY.value = offset.value.y + translationY
        })
        .onEnd(({ velocityX, velocityY }) => {
            const dest = snapPoint(translateX.value, velocityX, SNAP_POINTS)
            translateX.value = withSpring(dest, { velocity: velocityX })
            translateY.value = withSpring(0, { velocity: velocityY })
            scale.value = withTiming(1, { easing: Easing.inOut(Easing.quad) }, () => {
                const isLast = index === 0
                const isSwipRightOrLeft = dest !== 0
                if (isLast && isSwipRightOrLeft) {
                    shuffleBack.value = true
                }
            })
        })

    const style = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { perspective: 1500 },
            { rotateX: '30deg' },
            { rotateZ: `${rotateZ.value}deg` },
            { translateX: translateX.value },
            { translateY: translateY.value },
        ]
    }))

    return (
        <View style={styles.container} pointerEvents='box-none'>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.card, style]}>
                    <Image
                        source={source}
                        style={{
                            width: IMAGE_WIDTH,
                            height: IMAGE_WIDTH * aspectRatio,
                        }}
                        resizeMode='contain'
                    />
                </Animated.View>
            </GestureDetector>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    }
})

export default Card