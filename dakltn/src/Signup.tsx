import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // ✅ thêm icon

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

type Props = {
  navigation: SignUpScreenNavigationProp;
};

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* ✅ Icon logo */}
      <Icon name="credit-card-outline" size={60} color="#007BFF" style={{ marginBottom: 10 }} />

      <Text style={styles.title}>Sign Up</Text>

      {/* Username */}
      <View style={styles.inputContainer}>
        <Icon name="account-outline" size={20} color="#888" style={styles.inputIcon} />
        <TextInput placeholder="Username" style={styles.input} placeholderTextColor="#888" />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Icon name="email-outline" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          placeholderTextColor="#888"
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          placeholderTextColor="#888"
        />
      </View>

      {/* SIGN UP */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>SIGN UP</Text>
      </TouchableOpacity>

      <Text style={styles.signUpText}>Sign up with</Text>

      {/* Google Button */}
      <TouchableOpacity style={styles.googleButton}>
        <Icon name="google" size={20} color="#fff" />
        <Text style={styles.googleButtonText}>CONTINUE WITH GOOGLE</Text>
      </TouchableOpacity>

      {/* Link Login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signUpLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#000' },

  // input có icon
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    width: '80%',
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 45,
    color: '#000',
  },

  button: { backgroundColor: '#007BFF', paddingVertical: 12, borderRadius: 8, width: '80%', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },

  signUpText: { marginVertical: 12, textAlign: 'center', color: '#000' },

  googleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    borderRadius: 8,
    width: '80%',
    marginTop: 10,
  },
  googleButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },

  signUpLink: { marginTop: 14, color: '#007BFF', textAlign: 'center' },
});

export default SignUpScreen;
