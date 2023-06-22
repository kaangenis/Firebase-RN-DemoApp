import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DeviceInfo from './DeviceInfo'

const PersonCard = ({
    propUsername,
    propName,
    propSurname,
    propAge,
    propCity,
    propCountry,
    propMarriage,
    propDriver,
    propBackground,
    propTextColor
}) => {

    return (

        <View style={[styles.mainView, { backgroundColor: propBackground }]}>

            <View style={{ alignSelf: 'flex-start', paddingBottom: 20, paddingHorizontal: 15 }}>

                <Text style={[styles.textStyle, { fontSize: 36, fontWeight: '300', color: propTextColor }]}>{propUsername}</Text>

            </View>

            <Text style={[styles.textStyle, { color: propTextColor }]}>Fullname: {propName} {propSurname}</Text>
            <Text style={[styles.textStyle, { color: propTextColor }]}>Location: {propCity} / {propCountry}</Text>
            <Text style={[styles.textStyle, { color: propTextColor }]}>Age: {propAge}</Text>
            <Text style={[styles.textStyle, { color: propTextColor }]}>Marriage Status: {propMarriage}</Text>
            <Text style={[styles.textStyle, { color: propTextColor }]}>Driver License: {propDriver}</Text>

        </View>

    )
}

export default PersonCard

const styles = StyleSheet.create({
    mainView: {
        width: DeviceInfo.screenWidth * 0.9,
        height: DeviceInfo.screenHeight * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 20,
        marginBottom:10
    },
    textStyle: {
        fontSize: DeviceInfo.screenWidth * 0.06,
        fontWeight: '200',
    }
})