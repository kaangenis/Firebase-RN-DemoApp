import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import DeviceInfo from './DeviceInfo'
import { useNavigation } from '@react-navigation/native'


const ButtonComponent = ({ propTitle, propFunction, propColor, propNavigate }) => {

    const navigation = useNavigation()

    return (
        <TouchableOpacity onPress={() => propFunction()}>

            <View style={[styles.mainView, { backgroundColor: propColor }]}>

                <Text style={styles.titleStyle}>{propTitle}</Text>

            </View>

        </TouchableOpacity>
    )
}

export default ButtonComponent

const styles = StyleSheet.create({
    mainView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: DeviceInfo.screenWidth * 0.5,
        height: DeviceInfo.screenHeight * 0.06,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10,
    },
    titleStyle: {
        fontSize: DeviceInfo.screenWidth * 0.0625,
        fontWeight: '200'
    }
})