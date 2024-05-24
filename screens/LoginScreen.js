// REACT
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  PermissionsAndroid,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import DeviceNumber from 'react-native-device-number';
import axios from 'axios';

// THEME
import { themeColors } from '../theme';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handlePhoneNumber = async () => {
    try {
      const res = await DeviceNumber.get();

      setPhoneNumber(res.mobileNumber);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(
        'https://ams-silk.vercel.app/api/student/login',
        {
          phoneNumber,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(data);

      if (!data.success) {
        Alert.alert('Error', data.message || 'Something went wrong');
      }

      if (data.success) {
        navigation.navigate('Home', { user: data.data });
      }
    } catch (error) {}
  };

  return (
    <View
      className="flex-1 bg-white"
      style={{ backgroundColor: themeColors.bg }}
    >
      <SafeAreaView className="flex ">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-green-500 p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center">
          <Image
            source={require('../assets/images/login.png')}
            style={{ width: 200, height: 200 }}
          />
        </View>
      </SafeAreaView>

      <View
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        className="flex-1 bg-white px-8 pt-8"
      >
        <View className="form space-y-2">
          <Text className="text-gray-800 ml-2">Phone Number</Text>
          <TouchableOpacity
            className="flex  bg-gray-100 p-4 rounded-2xl border-2 "
            onPress={handlePhoneNumber}
          >
            <Text className="text-gray-800">
              {phoneNumber ? phoneNumber : 'Enter Phone Number'}
            </Text>
          </TouchableOpacity>

          <Text className="text-gray-700 ml-2">Password</Text>

          <TextInput
            className="p-2 bg-gray-100 text-gray-800 rounded-2xl border-2"
            secureTextEntry
            placeholder="*****"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />

          <TouchableOpacity className="flex items-end">
            <Text className="text-gray-800 mb-5">Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            className="py-3 bg-green-500 rounded-xl"
          >
            <Text className="text-xl font-bold text-center text-gray-800">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
