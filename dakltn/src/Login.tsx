import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Icon name="credit-card-outline" size={60} color="#007BFF" style={styles.logo} />
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <Icon name="account-outline" size={20} color="#888" style={styles.inputIcon} />
        <TextInput placeholder="Username" style={styles.input} placeholderTextColor="#888" autoCapitalize="none" />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={20} color="#888" style={styles.inputIcon} />
        <TextInput placeholder="Password" style={styles.input} secureTextEntry placeholderTextColor="#888" autoCapitalize="none" />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Trangchu')}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password!</Text>
      </TouchableOpacity>

      <Text style={styles.signUpText}>Login with</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Icon name="google" size={20} color="#fff" />
        <Text style={styles.googleButtonText}>CONTINUE WITH GOOGLE</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signUpLink}>Don't have an account? Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
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
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    width: '80%',
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  forgotPassword: {
    color: 'red',
    textAlign: 'right',
    width: '80%',
    marginTop: 5,
  },
  signUpText: {
    marginVertical: 12,
    textAlign: 'center',
    color: '#000',
  },
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
  googleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  signUpLink: {
    marginTop: 14,
    color: '#007BFF',
    textAlign: 'center',
  },
});

export default LoginScreen;