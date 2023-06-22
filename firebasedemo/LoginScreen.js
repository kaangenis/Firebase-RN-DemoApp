import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

//Navigation kütüphanesinin import edilmesi:
import { useNavigation } from '@react-navigation/native';

//Responsive Design için "DeviceInfo.js" isimli Dimension componentini içeren .js dosyasının importlanması:
import DeviceInfo from '../components/DeviceInfo'

//Firebase Config dosyasının "firebaseConfig.js" ve Firebase "initializeApp" fonksiyonunun importlanması:
import firebaseConfig from '../components/firebaseConfig'
import { initializeApp } from "firebase/app";

//Firebase authentication servisi olan "getAuth" ve "signInWithEmailAndPassword" fonksiyonlarının importlanması:
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

//Giriş yapan kullanıcının giriş bilgilerini tutmak için "AsyncStorage" kütüphanesinin import edilmesi:
import AsyncStorage from '@react-native-async-storage/async-storage';



const LoginScreen = () => {
    //Statelerin tanımlanması:

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [secureText, setSecureText] = useState(true)

    //React Navigation Native kütüphanesinin import edilip kullanılması:

    const navigation = useNavigation()

    //Firebase app'in initialize edilmesi ve authentication servisinin config ile çalıştırılması:

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const authenticationFunction = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {

                //Eğer authentication işlemi başarıyla gerçekleşirse bu kod bloğu çalışacaktır.

                const user = userCredential.user;
                console.log(user)

                /* 

                    AsyncStorage kütüphanesi kullanılarak kullanıcının giriş bilgilerini hafızaya kaydetme 
                    ve uygulama yeniden başlatıldığında tekrar kayıt bilgilerinin alınmaması için AsyncStorage
                    kütüphanesinin "setItem" fonksiyonunun kullanımı: 

                */

                try {
                    await AsyncStorage.setItem('uid', user.uid)
                    await AsyncStorage.setItem('email', email)
                    await AsyncStorage.setItem('password', password)

                    //Authentication işlemi gerçekleştikten sonra "HomeScreen" route'una yönlendirme işlemi:

                    navigation.replace("HomeScreen")

                } catch (err) {
                    console.log(err)
                }

            })
            .catch((error) => {

                //Eğer authentication esnasında bir problem çıkarsa ".catch" ile bu kod bloğu çalışacaktır.

                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
                Alert.alert(errorCode, errorMessage)

            });
    }

    //Kullanıcının giriş bilgilerinin kaydedilmesinin ardından otomatik olarak giriş yapmasını sağlayan fonksiyon: 

    const tryLogin = async () => {

        //AsyncStorage kütüphanesinin "getItem" fonksiyonu ile hafızada tutulan "uid", "email", "password" gibi bilgilerin çağrılması:

        const mailStorage = await AsyncStorage.getItem("email")
        const passwordStorage = await AsyncStorage.getItem("password")
        const uidStorage = await AsyncStorage.getItem("uid")

        //Gelen bilgiler "null" değilse Firebase authentication servisi ile kullanıcı otomatik olarak login işlemini gerçekleştirecektir.

        if (mailStorage != null && passwordStorage != null) {

            signInWithEmailAndPassword(auth, mailStorage, passwordStorage)
                .then(async (userCredential) => {

                    console.log("2. authentication çalıştı.")

                    //Eğer authentication işlemi başarıyla gerçekleşirse bu kod bloğu çalışacaktır.

                    const user = userCredential.user;
                    console.log(user)

                    //Authentication işlemi gerçekleştikten sonra "HomeScreen" route'una yönlendirme işlemi:

                    if (user) {
                        navigation.replace("HomeScreen");
                    }


                })
                .catch((error) => {

                    //Authentication işlemi esnasında bir problem çıkarsa bu kod bloğu çalışacaktır.

                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode, errorMessage)
                    Alert.alert(errorCode, errorMessage)

                });
        }
        else {
            console.log("No login info")
        }


        console.log(mailStorage, passwordStorage, uidStorage)

    }

    /*
    
        React hooklarından birisi olan "useEffect" ile "LoginScreen.js" dosyası her çalıştığında
        "tryLogin()" isimli fonksiyon çalıştırılacak. Kullanıcı kendi tercihi ile çıkış yapmadığı sürece
        "tryLogin()" isimli fonksiyon kullanıcının otomatik olarak uygulamaya giriş yapmasını sağlayacak.
    
    */

    useEffect(() => { tryLogin() }, [])


    return (
        <SafeAreaView style={styles.mainView}>

            <View style={styles.headerView}>

                <Image
                    source={require('../images/firebaseLogo.png')}
                    style={styles.firebaseLogo}
                    resizeMode='contain'

                />

                <Text style={styles.headerTitle}>Welcome to the Firebase demo app.</Text>

            </View>

            <View style={styles.middleView}>

                <Text style={styles.inputTitleView}>E-Mail</Text>

                <TextInput
                    style={styles.inputView}
                    placeholder='example@mail.com'
                    textAlign='center'
                    value={email}
                    onChangeText={(valMail) => setEmail(valMail)}
                />

                <Text style={styles.inputTitleView}>Password</Text>

                <View style={{ flexDirection: 'row' }}>

                    <TextInput
                        style={[styles.inputView, { left: DeviceInfo.screenWidth * 0.035 }]}
                        placeholder='********'
                        textAlign='center'
                        value={password}
                        onChangeText={(valPassword) => setPassword(valPassword)}
                        secureTextEntry={secureText}
                    />

                    <TouchableOpacity onPress={() => setSecureText(!secureText)}>

                        <View style={{ alignSelf: 'center' }}>

                            <Image
                                source={require('../images/showpassword.png')}
                                style={styles.showPasswordImage}
                                resizeMode='contain'
                            />

                        </View>

                    </TouchableOpacity>

                </View>

            </View>

            <View style={styles.buttonView}>

                <TouchableOpacity onPress={() => authenticationFunction()}>

                    <View style={styles.loginButton}>

                        <Text style={styles.loginButtonText}>Login</Text>

                    </View>

                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.replace("RegisterScreen")}>

                    <Text style={styles.registerText}>Don't have an account, Click to Register.</Text>

                </TouchableOpacity>

            </View>


        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    mainView: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFA611'
    },
    headerView: {
        flex: 1.75,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#059BE5',
        width: DeviceInfo.screenWidth * 0.95,
        height: DeviceInfo.screenHeight * 0.75,
        borderWidth: 5,
        borderColor: 'lightgray',
        borderRadius: 20
    },
    headerTitle: {
        fontSize: DeviceInfo.screenWidth * 0.1,
        fontWeight: '100',
        color: 'white',
        textAlign: 'center',
        bottom: DeviceInfo.screenHeight * 0.085
    },
    firebaseLogo: {
        width: DeviceInfo.screenWidth * 0.5,
        height: DeviceInfo.screenHeight * 0.5,
        bottom: DeviceInfo.screenHeight * 0.035
    },
    middleView: {
        flex: 0.75,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: DeviceInfo.screenHeight * 0.025,
        top: DeviceInfo.screenHeight * 0.025
    },
    inputView: {
        width: DeviceInfo.screenWidth * 0.75,
        height: DeviceInfo.screenHeight * 0.05,
        borderWidth: 0.5,
        borderRadius: 10,
        marginBottom: DeviceInfo.screenHeight * 0.025
    },
    showPasswordImage: {
        width: DeviceInfo.screenWidth * 0.075,
        height: DeviceInfo.screenHeight * 0.075,
        right: DeviceInfo.screenWidth * 0.05,
        bottom: DeviceInfo.screenHeight * 0.0125
    },
    inputTitleView: {
        fontSize: DeviceInfo.screenWidth * 0.075,
        fontWeight: '200',
        alignSelf: 'flex-start'
    },
    buttonView: {
        flex: 0.5,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    loginButton: {
        width: DeviceInfo.screenWidth * 0.6,
        height: DeviceInfo.screenHeight * 0.06,
        backgroundColor: '#059BE5',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray'
    },
    loginButtonText: {
        fontSize: DeviceInfo.screenHeight * 0.0425,
        fontWeight: '200',
        color: 'white',
    },
    registerText: {
        fontSize: DeviceInfo.screenHeight * 0.025,
        fontWeight: '200',
        fontStyle: 'italic',
        textAlign: 'center'
    }
})