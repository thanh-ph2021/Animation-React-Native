import { BackHandler, Image, ImageRequireSource, ImageSourcePropType, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import FastImage, { Source } from 'react-native-fast-image'
import { height, width } from '../../Utils'
import Animated, { BounceIn, Extrapolation, FadeInRight, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming, ZoomIn } from 'react-native-reanimated'
import Icon from '@react-native-vector-icons/ionicons'
import { FlatList, Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import { useEffect, useState } from 'react'
import { snapPoint } from 'react-native-redash'

const getHitSlop = (padding: number) => ({
    top: padding,
    bottom: padding,
    left: padding,
    right: padding,
})

const SNAP_POINTS = [-height, 0, height]

const images = [
    { source: require("./assets/natural.jpg") },
    { source: require("./assets/natural1.jpeg") },
]

interface LightBoxProps {
    visible: boolean,
    onRequestClose: () => void,
    source: Source | ImageRequireSource
}

const LightBox = ({ visible, onRequestClose, source }: LightBoxProps) => {
    const scale = useSharedValue(1)
    const saveScale = useSharedValue(0)
    const offset = useSharedValue({ x: 0, y: 0 })
    const translateY = useSharedValue(0)
    const translateX = useSharedValue(0)
    const focalX = useSharedValue(0)
    const focalY = useSharedValue(0)
    const rotateZ = useSharedValue(0)

    const [imageSize, setImageSize] = useState({ width: width, height: 200 })

    useEffect(() => {

        if (typeof source === 'number') {
            const { width: w, height: h } = Image.resolveAssetSource(source)
            const ratio = width / w
            setImageSize({ width: width, height: h * ratio })
        }

        if (typeof source === 'object' && 'uri' in source && source.uri) {
            Image.getSize(source.uri, (w, h) => {
                const ratio = width / w
                setImageSize({ width: width, height: h * ratio })
            })
        }
    }, [source])

    // useEffect(() => {
    //     const handler = () => {
    //         onClose()
    //         return true
    //     }
    //     BackHandler.addEventListener('hardwareBackPress', handler)
    //     return () => BackHandler.removeEventListener('hardwareBackPress', handler)
    // }, [])

    const onClose = () => {
        translateY.value = withTiming(0)
        translateX.value = withTiming(0)
        scale.value = withTiming(1)
        onRequestClose()
    }

    const pinGesture = Gesture.Pinch()
        .onBegin((e) => {
            focalX.value = e.focalX
            focalY.value = e.focalY
        })
        .onUpdate((e) => {
            scale.value = Math.max(saveScale.value * e.scale, 1)

        })
        .onEnd(() => {
            if (scale.value === 1) {
                translateX.value = withTiming(0)
                translateY.value = withTiming(0)
            }
            // scale.value = withTiming(1)
            saveScale.value = scale.value
            focalX.value = withTiming(0)
            focalY.value = withTiming(0)
        })

    const panGesture = Gesture.Pan()
        .onBegin((e) => {
            console.log('scale.value', scale.value)
        })
        .onUpdate((e) => {
            if (scale.value === 1) {
                console.log('abc')
                translateY.value = e.translationY
            } else {
                translateX.value = e.translationX + offset.value.x
                translateY.value = e.translationY + offset.value.y
            }
        })
        .onEnd((e) => {
            if (scale.value === 1) {
                const dest = snapPoint(translateY.value, e.velocityY, SNAP_POINTS)
                translateY.value = withTiming(dest, {}, () => {
                    if (dest !== 0) {
                        runOnJS(onClose)()
                    }
                })
            } else {
                offset.value = { x: translateX.value, y: translateY.value }
            }
        })
        .maxPointers(1)

    const composed = Gesture.Simultaneous(panGesture, pinGesture)

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateY.value,
            [-height, 0, height],
            [1 + translateY.value / height, 1, 1 - translateY.value / height],
            Extrapolation.CLAMP,
        ),
    }))

    const imageAnimatedStyle = useAnimatedStyle(() => {
        const limitedTranslateX = interpolate(
            translateX.value,
            [-200, 0, 200], // Input range
            [-100, 0, 100], // Output range (giới hạn)
            Extrapolation.CLAMP // Ngăn giá trị vượt ngoài phạm vi
        );

        const limitedTranslateY = interpolate(
            translateY.value,
            [-200, 0, 200], // Input range
            [-100, 0, 100], // Output range (giới hạn)
            Extrapolation.CLAMP
        );

        return {
            transform: [
                { scale: scale.value },
                {
                    translateX: focalX.value,
                },
                {
                    translateY: focalY.value,
                },
                {
                    translateX: -focalX.value,
                },
                {
                    translateY: -focalY.value,
                },
                { translateY: limitedTranslateY },
                { translateX: limitedTranslateX },
                // {
                //     scale: interpolate(
                //         translateY.value,
                //         [-height, 0, height],
                //         [0, 1, 0],
                //         Extrapolation.CLAMP,
                //     ),
                // },
            ],
            // opacity: interpolate(
            //     translateY.value,
            //     [-height, 0, height],
            //     [0, 1, 0],
            //     Extrapolation.CLAMP,
            // ),
        }

    })

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Modal
                statusBarTranslucent
                transparent
                animationType='none'
                visible={visible}
            >
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <Animated.View style={[styles.backdrop, backdropStyle]}>
                        <Animated.View entering={ZoomIn} style={{ position: 'absolute', top: 40, left: 15, zIndex: 3 }}>
                            <TouchableOpacity hitSlop={getHitSlop(20)} onPress={() => onClose()}>
                                <Icon name='close' size={30} color={'white'} />
                            </TouchableOpacity>
                        </Animated.View>
                        <FlatList
                            horizontal
                            pagingEnabled
                            data={images}
                            renderItem={({ item, index }) => {
                                return (
                                    <GestureDetector gesture={composed} key={index}>
                                        <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
                                            <Animated.View entering={ZoomIn}>
                                                <FastImage
                                                    style={{ ...imageSize }}
                                                    source={item.source}
                                                    resizeMode='contain'
                                                />
                                            </Animated.View>
                                        </Animated.View>
                                    </GestureDetector>
                                )
                            }}
                        />
                    </Animated.View>
                </GestureHandlerRootView>
            </Modal>
        </View>
    )
}

export default LightBox

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
        backgroundColor: 'black',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2
    }
})