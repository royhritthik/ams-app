// REACT
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { Dialog } from 'react-native-simple-dialogs';

// THEME
import { themeColors } from '../theme';

export default function HomeScreen({ route, navigation }) {
  const [section, setSection] = React.useState(null);
  const [student, setStudent] = React.useState(null);
  const [filteredSection, setFilteredSection] = React.useState(null);
  const [attendence, setAttendence] = React.useState(null);
  const [courseId, setCourseId] = React.useState(null);
  const [seatNo, setSeatNo] = React.useState(null);
  const [clicked, setClicked] = React.useState(false);
  const [clickedId, setClickedId] = React.useState(null);
  const [dialogVisible, setDialogVisible] = React.useState(false);

  const fetchSection = async () => {
    try {
      const response = await fetch('https://ams-silk.vercel.app/api/section', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!data.success) {
        console.log(data.message);
      }

      if (data.success) {
        setSection(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStudent = async () => {
    try {
      const response = await fetch(
        `https://ams-silk.vercel.app/api/student/${route.params.user.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        console.log(data.message);
      }

      if (data.success) {
        setStudent(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAttendence = async () => {
    try {
      const response = await fetch(
        `https://ams-silk.vercel.app/api/attendence`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        console.log(data.message);
      }

      if (data.success) {
        setAttendence(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchSection();
    getStudent();
  }, []);

  React.useEffect(() => {
    if (section && student) {
      const filtered = section.find((item) => item.id === student.Section.id);
      setFilteredSection(filtered);
    }
  }, [section, student]);

  const markAttendence = async () => {
    try {
      const response = await fetch(
        `https://ams-silk.vercel.app/api/attendence/studentseat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentId: route.params.user.id,
            attendenenceId: clickedId,
            seatNo: seatNo,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        console.log(data.message);
        Alert.alert('Error', data.message);
      }

      if (data.success) {
        Alert.alert('Success', data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView className="h-full bg-white">
      <SafeAreaView className="flex-1">
        <View className="mt-4">
          <Text className="text-center text-2xl font-bold text-gray-800">
            Available Courses
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="p-4"
          >
            {filteredSection?.SectionOnCourse?.map((item) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setCourseId(item.course.id);
                    getAttendence();
                  }}
                  key={item.id}
                  className="border bg-blue-500 p-4 my-2"
                >
                  <Text className="text-white text-lg">
                    {item.course.name} ({item.course.code})
                  </Text>
                  <Text className="text-white">ID: {item.course.id}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View className="mt-4">
            <Text className="text-center text-2xl font-bold text-gray-800">
              Attendence
            </Text>

            <View className=" mt-4">
              {attendence?.map((item) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (item.submitted) {
                        Alert.alert('Error', 'Already Submitted');
                        return;
                      }

                      setDialogVisible(true);
                      setClickedId(item.id);
                    }}
                    key={item.id}
                    className="border bg-blue-500 p-4 my-2 flex-row justify-between mx-4 rounded-xl"
                  >
                    <Text className="text-white">{item.date}</Text>
                    <Text className="text-white">
                      {item.submitted ? 'Submitted' : 'Pending by faculty'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Dialog
              visible={dialogVisible}
              title="Enter Seat No"
              onTouchOutside={() => setDialogVisible(false)}
            >
              <View className="flex-col justify-center mt-4 mx-12">
                <TextInput
                  className="p-2 bg-gray-100 text-gray-800 rounded-2xl mb-3 border-2 w-full "
                  placeholder="Enter Seat No"
                  value={seatNo}
                  onChangeText={(text) => setSeatNo(text)}
                />

                <TouchableOpacity
                  onPress={markAttendence}
                  className="py-3 bg-green-500 rounded-xl"
                >
                  <Text className="font-xl font-bold text-center text-gray-700">
                    Mark Attendance
                  </Text>
                </TouchableOpacity>
              </View>
            </Dialog>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
