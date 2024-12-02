import { StatusBar, View } from "react-native"
import Card from "./card"
import { useSharedValue } from "react-native-reanimated"

const cards = [
    { source: require("./assets/death.png") },
    { source: require("./assets/chariot.png") },
    { source: require("./assets/devil.png") },
    { source: require("./assets/fool.png") },
    { source: require("./assets/hermit.png") },
    { source: require("./assets/high-priestess.png") },
    { source: require("./assets/judegment.png") },
    { source: require("./assets/justice.png") },
    { source: require("./assets/moon.png") },
    { source: require("./assets/pendu.png") },
    { source: require("./assets/strength.png") },
    { source: require("./assets/sun.png") },
    { source: require("./assets/temperance.png") },
    { source: require("./assets/tower.png") },
    { source: require("./assets/wheel.png") },
    { source: require("./assets/world.png") },
]

const GestureHandler = () => {
    const shuffleBack = useSharedValue(false)
    return (
        <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
            <StatusBar hidden />
            {cards.map((card, index) => {
                return <Card card={card} key={index} index={index} shuffleBack={shuffleBack} />
            })}
        </View>
    )
}

export default GestureHandler