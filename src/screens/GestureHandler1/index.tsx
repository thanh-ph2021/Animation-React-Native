import { useState } from 'react'
import { Pressable, View } from 'react-native'
import FastImage from 'react-native-fast-image'

import { width } from '../../Utils'
import LightBox from './LightBox'

const sources = [
    {
        source: require('./assets/natural1.jpeg'),
    },
    {
        source: require("./assets/natural.jpg"),
    }
]

const GestureHandler1 = () => {

    const [visible, setVisible] = useState(false)

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <Pressable onPress={() => {
                setVisible(pre => !pre)
            }}>
                <FastImage
                    style={{ width: width - 10, height: 200, borderRadius: 10 }}
                    source={require('./assets/natural1.jpeg')}
                />
            </Pressable>
            <LightBox visible={visible} onRequestClose={() => setVisible(false)} sources={sources} />
        </View>
    )
}

export default GestureHandler1