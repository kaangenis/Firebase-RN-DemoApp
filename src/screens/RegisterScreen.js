import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

//Navigation kütüphanesinin verimli çalışması için "GoBackButton" custom componentinin importlanması:
import GoBackButton from '../components/GoBackButton'

//Responsive Design için "DeviceInfo.js" isimli Dimension componentini içeren .js dosyasının importlanması:
import DeviceInfo from '../components/DeviceInfo'

//Firebase authentication servisi olan "getAuth" ve "signInWithEmailAndPassword" fonksiyonlarının importlanması:
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

//Firebase Config dosyasının "firebaseConfig.js" ve Firebase "initializeApp" fonksiyonunun importlanması:
import firebaseConfig from '../components/firebaseConfig'
import { initializeApp } from "firebase/app";

//Firebase database servisi olan Firestore'un ve alt işlemlerini gerçekleştiren "doc" ve "setDoc" fonksiyonlarının importlanması:
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
    //Statelerin belirlenmesi

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")
    const [age, setAge] = useState("")
    const [marriageStatus, setMarriageStatus] = useState("")
    const [driverLicense, setDriverLicense] = useState("")

    //React Navigation Native kütüphanesinin import edilip kullanılması:

    const navigation = useNavigation()

    //Firebase app'in initialize edilmesi ve authentication servisinin config ile çalıştırılması:

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    //Firestore database'in config ile initialize edilme işlemi:

    const db = getFirestore(app);

    const registerUserAndSaveInfo = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {

                //Yeni kullanıcı kaydetme işlemi başarıyla gerçekleşirse bu kod bloğu çalışacak.

                const user = userCredential.user;
                console.log(user)

                //Kullanıcıdan alınan bilgilerin Firestore'a kaydedilme işlemi:

                /* Farklı Veri Tiplerini Create ve Read işlemleri için örnekler çeşitlendirildi. */

                await setDoc(doc(db, "UserInfo", user.uid), {
                    username: username,
                    fullName: { firstName: name, lastName: surname },
                    location: { city: city, country: country },
                    age: age,
                    status: { isMarried: marriageStatus, isDriver: driverLicense },
                    hobbies: []
                });

                //Kullanıcıya "Alert" componenti ile bildirim gönderme işlemi:

                Alert.alert("New user registered successfully.", `User ID:  ${user.uid}`)

                //"LoginScreen" sayfasına yönlendirme işlemi:

                navigation.replace("LoginScreen")

            })
            .catch((error) => {

                //Yeni kullanıcı kaydetme işlemi esnasında herhangi bir hatayla karşılaşıldığında ".catch" ile bu kod bloğu çalışacak.

                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
                Alert.alert(errorCode, errorMessage)
            });

    }



    return (
        <SafeAreaView style={styles.mainView}>

            <View style={styles.headerView}>

                <GoBackButton
                    navigationRoute={"LoginScreen"} />

                <Text style={styles.headerTitle}>Register new account</Text>

            </View>

            <View style={styles.middleView}>

                <ScrollView>

                    <Text style={styles.inputTitleView}>Name:</Text>

                    <TextInput
                        style={styles.inputView}
                        placeholder='Enter your first name'
                        textAlign='center'
                        value={name}
                        onChangeText={(valName) => setName(valName)}
                    />

                    <Text style={styles.inputTitleView}>Surname:</Text>

                    <TextInput
                        style={styles.inputView}
                        placeholder='Enter your last name'
                        textAlign='center'
                        value={surname}
                        onChangeText={(valSurname) => setSurname(valSurname)}
                    />

                    <Text style={styles.inputTitleView}>Username:</Text>

                    <TextInput
                        style={styles.inputView}
                        placeholder='Enter your username'
                        textAlign='center'
                        value={username}
                        onChangeText={(valUsername) => setUsername(valUsername)}
                    />

                    <Text style={styles.inputTitleView}>Mail Address:</Text>

                    <TextInput
                        style={styles.inputView}
                        placeholder='Enter your mail'
                        textAlign='center'
                        value={email}
                        onChangeText={(valMail) => setEmail(valMail)}
                    />

                    <Text style={styles.inputTitleView}>Password:</Text>

                    <TextInput
                        style={styles.inputView}
                        placeholder='Enter your password'
                        textAlign='center'
                        value={password}
                        onChangeText={(valPassword) => setPassword(valPassword)}
                        secureTextEntry={true}
                    />

                    <Text style={styles.inputTitleView}>Country:</Text>

                    <TextInput
                        style={styles.inputView}
                        placeholder='Enter your location info'
                        textAlign='center'
                        value={country}
                        onChangeText={(valCountry) => setCountry(valCountry)}
                    />

                    <Text style={styles.inputTitleView}>City:</Text>

                    <TextInput
                        style={styles.inputView}
                        placeholder='Enter your location info'
                        textAlign='center'
                        value={city}
                        onChangeText={(valCity) => setCity(valCity)}
                    />

                    <Text style={styles.inputTitleView}>Age:</Text>

                    <TextInput
                        style={styles.inputView}
                        placeholder='Enter your age'
                        textAlign='center'
                        value={age}
                        onChangeText={(valAge) => setAge(valAge)}
                    />

                    <Text style={styles.inputTitleView}>Marriage Status:</Text>

                    <TextInput
                        style={styles.inputView}
                        placeholder='Enter your marriage status'
                        textAlign='center'
                        value={marriageStatus}
                        onChangeText={(valMarriage) => setMarriageStatus(valMarriage)}
                    />

                    <Text style={styles.inputTitleView}>Driver License:</Text>

                    <TextInput
                        style={styles.inputView}
                        placeholder='Enter your driver license status'
                        textAlign='center'
                        value={driverLicense}
                        onChangeText={(valDriver) => setDriverLicense(valDriver)}
                    />

                </ScrollView>

            </View>

            <View style={styles.buttonView}>

                <TouchableOpacity onPress={() => registerUserAndSaveInfo()}>

                    <View style={styles.buttonBox}>

                        <Text style={styles.buttonTitle}>Register</Text>

                    </View>

                </TouchableOpacity>

            </View>

        </SafeAreaView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    mainView: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFCB2B'
    },
    headerView: {
        flex: 0.5,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignSelf: 'flex-start'
    },
    headerTitle: {
        fontSize: 36,
        fontWeight: '200',
        alignSelf: 'center',
        textAlign: 'center',
        padding: 10
    },
    middleView: {
        flex: 2
    },
    inputView: {
        width: DeviceInfo.screenWidth * 0.75,
        height: DeviceInfo.screenHeight * 0.05,
        borderWidth: 0.5,
        borderRadius: 10,
        marginBottom: DeviceInfo.screenHeight * 0.025
    },
    inputTitleView: {
        fontSize: DeviceInfo.screenWidth * 0.05,
        fontWeight: '200',
        alignSelf: 'flex-start',
        marginBottom: DeviceInfo.screenWidth * 0.01
    },
    buttonView: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonBox: {
        width: DeviceInfo.screenWidth * 0.55,
        height: DeviceInfo.screenHeight * 0.075,
        backgroundColor: '#FF8964',
        borderWidth: 0.5,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonTitle: {
        fontSize: 32,
        fontWeight: '200',
        fontStyle: 'italic',
        color: 'black'
    }
})