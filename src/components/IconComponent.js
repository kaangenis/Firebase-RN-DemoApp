import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import DeviceInfo from './DeviceInfo'

const IconComponent = ({ propIcon, propNavigate }) => {
    return (

        <View>

            <TouchableOpacity onPress={() => propNavigate()}>

                <Image
                    source={{ uri: propIcon }}
                    style={styles.iconStyle}
                    resizeMode='contain'

                />

            </TouchableOpacity>

        </View>

    )
}

export default IconComponent

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconStyle: {
        width: DeviceInfo.screenWidth * 0.1,
        height: DeviceInfo.screenHeight * 0.1
    }
})