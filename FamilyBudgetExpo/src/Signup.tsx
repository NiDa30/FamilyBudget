import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackParamList } from "../App";
import { auth } from "../firebaseConfig";

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Signup"
>;

type Props = {
  navigation: SignUpScreenNavigationProp;
};

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);

  // Validation helpers
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (
    password: string
  ): { color: string; text: string } => {
    if (password.length === 0) return { color: "#999", text: "" };
    if (password.length < 6) return { color: "#f44336", text: "Quá yếu" };
    if (password.length < 8) return { color: "#ff9800", text: "Yếu" };

    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasNumber && hasLetter && hasSpecial) {
      return { color: "#4caf50", text: "Mạnh" };
    }
    return { color: "#ffc107", text: "Trung bình" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignUp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Validation
    if (!trimmedUsername) {
      Alert.alert("Lỗi", "Vui lòng nhập tên đăng nhập");
      return;
    }

    if (trimmedUsername.length < 3) {
      Alert.alert("Lỗi", "Tên đăng nhập phải có ít nhất 3 ký tự");
      return;
    }

    if (!trimmedEmail) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      Alert.alert("Lỗi", "Email không đúng định dạng");
      return;
    }

    if (!trimmedPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu");
      return;
    }

    if (trimmedPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (!trimmedConfirmPassword) {
      Alert.alert("Lỗi", "Vui lòng xác nhận mật khẩu");
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    if (!agreeTerms) {
      Alert.alert("Lỗi", "Bạn cần đồng ý với Điều khoản và Chính sách bảo mật");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        trimmedPassword
      );

      await updateProfile(userCredential.user, {
        displayName: trimmedUsername,
      });

      console.log("✅ Đăng ký thành công:", userCredential.user.email);

      Alert.alert(
        "🎉 Chúc mừng!",
        `Chào mừng ${trimmedUsername}! Tài khoản của bạn đã được tạo thành công.`,
        [
          {
            text: "Đăng nhập ngay",
            onPress: () => {
              setUsername("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");
              setAgreeTerms(false);
              navigation.navigate("Login");
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("❌ Lỗi đăng ký:", error.code);

      let errorTitle = "Lỗi đăng ký";
      let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại.";
      let showLoginButton = false;

      switch (error.code) {
        case "auth/email-already-in-use":
          errorTitle = "Email đã được sử dụng";
          errorMessage =
            "Email này đã được đăng ký. Bạn có muốn đăng nhập không?";
          showLoginButton = true;
          break;
        case "auth/invalid-email":
          errorTitle = "Email không hợp lệ";
          errorMessage = "Định dạng email không đúng. Vui lòng kiểm tra lại.";
          break;
        case "auth/operation-not-allowed":
          errorTitle = "Tính năng chưa được bật";
          errorMessage =
            "Đăng ký bằng email/password chưa được kích hoạt. Vui lòng liên hệ quản trị viên.";
          break;
        case "auth/weak-password":
          errorTitle = "Mật khẩu yếu";
          errorMessage =
            "Mật khẩu quá đơn giản. Vui lòng sử dụng mật khẩu mạnh hơn (ít nhất 6 ký tự).";
          break;
        case "auth/network-request-failed":
          errorTitle = "Lỗi kết nối";
          errorMessage =
            "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.";
          break;
        case "auth/too-many-requests":
          errorTitle = "Quá nhiều yêu cầu";
          errorMessage =
            "Bạn đã thử quá nhiều lần. Vui lòng đợi một lúc rồi thử lại.";
          break;
        default:
          errorMessage = error.message || "Đã xảy ra lỗi không xác định.";
      }

      if (showLoginButton) {
        Alert.alert(errorTitle, errorMessage, [
          { text: "Hủy", style: "cancel" },
          {
            text: "Đăng nhập",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
      } else {
        Alert.alert(errorTitle, errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    Alert.alert(
      "Thông báo",
      "Đăng ký Google cần cấu hình thêm. Vui lòng sử dụng email/password."
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section with Illustration */}
        <View style={styles.headerSection}>
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.decorativeCircle3} />

          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Icon name="account-plus" size={48} color="#fff" />
            </View>
          </View>

          <Text style={styles.title}>Tạo tài khoản mới</Text>
          <Text style={styles.subtitle}>
            Bắt đầu quản lý tài chính thông minh hơn
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Username Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Tên đăng nhập</Text>
            <View
              style={[
                styles.inputContainer,
                isUsernameFocused && styles.inputContainerFocused,
              ]}
            >
              <Icon
                name="account-outline"
                size={22}
                color={isUsernameFocused ? "#1E88E5" : "#9E9E9E"}
              />
              <TextInput
                placeholder="Chọn tên đăng nhập"
                style={styles.input}
                placeholderTextColor="#BDBDBD"
                autoCapitalize="words"
                value={username}
                onChangeText={setUsername}
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
                editable={!loading}
              />
              {username.length >= 3 && (
                <Icon name="check-circle" size={20} color="#4caf50" />
              )}
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <View
              style={[
                styles.inputContainer,
                isEmailFocused && styles.inputContainerFocused,
              ]}
            >
              <Icon
                name="email-outline"
                size={22}
                color={isEmailFocused ? "#1E88E5" : "#9E9E9E"}
              />
              <TextInput
                placeholder="example@email.com"
                style={styles.input}
                placeholderTextColor="#BDBDBD"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                editable={!loading}
              />
              {email.length > 0 && isValidEmail(email) && (
                <Icon name="check-circle" size={20} color="#4caf50" />
              )}
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Mật khẩu</Text>
            <View
              style={[
                styles.inputContainer,
                isPasswordFocused && styles.inputContainerFocused,
              ]}
            >
              <Icon
                name="lock-outline"
                size={22}
                color={isPasswordFocused ? "#1E88E5" : "#9E9E9E"}
              />
              <TextInput
                placeholder="Tối thiểu 6 ký tự"
                style={styles.input}
                secureTextEntry={!showPassword}
                placeholderTextColor="#BDBDBD"
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
                style={styles.eyeIcon}
                disabled={loading}
              >
                <Icon
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#9E9E9E"
                />
              </TouchableOpacity>
            </View>
            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View style={styles.passwordStrengthContainer}>
                <View style={styles.strengthBar}>
                  <View
                    style={[
                      styles.strengthBarFill,
                      {
                        width: `${Math.min(
                          (password.length / 12) * 100,
                          100
                        )}%`,
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.strengthText,
                    { color: passwordStrength.color },
                  ]}
                >
                  {passwordStrength.text}
                </Text>
              </View>
            )}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
            <View
              style={[
                styles.inputContainer,
                isConfirmPasswordFocused && styles.inputContainerFocused,
              ]}
            >
              <Icon
                name="lock-check-outline"
                size={22}
                color={isConfirmPasswordFocused ? "#1E88E5" : "#9E9E9E"}
              />
              <TextInput
                placeholder="Nhập lại mật khẩu"
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#BDBDBD"
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setIsConfirmPasswordFocused(true)}
                onBlur={() => setIsConfirmPasswordFocused(false)}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
                style={styles.eyeIcon}
                disabled={loading}
              >
                <Icon
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#9E9E9E"
                />
              </TouchableOpacity>
            </View>
            {confirmPassword.length > 0 && password === confirmPassword && (
              <View style={styles.matchIndicator}>
                <Icon name="check-circle" size={16} color="#4caf50" />
                <Text style={styles.matchText}>Mật khẩu khớp</Text>
              </View>
            )}
          </View>

          {/* Terms & Conditions Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreeTerms(!agreeTerms)}
            activeOpacity={0.7}
            disabled={loading}
          >
            <View
              style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}
            >
              {agreeTerms && <Icon name="check" size={16} color="#fff" />}
            </View>
            <Text style={styles.checkboxText}>
              Tôi đồng ý với <Text style={styles.linkText}>Điều khoản</Text> và{" "}
              <Text style={styles.linkText}>Chính sách bảo mật</Text>
            </Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.signUpButton,
              (!agreeTerms || loading) && styles.signUpButtonDisabled,
            ]}
            onPress={handleSignUp}
            activeOpacity={0.9}
            disabled={!agreeTerms || loading}
          >
            {loading ? (
              <>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.signUpButtonText}>Đang xử lý...</Text>
              </>
            ) : (
              <>
                <Text style={styles.signUpButtonText}>Đăng ký</Text>
                <Icon name="arrow-right" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Hoặc đăng ký với</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Sign Up Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.8}
              onPress={handleGoogleSignUp}
              disabled={loading}
            >
              <Icon name="google" size={24} color="#DB4437" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Icon name="facebook" size={24} color="#4267B2" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Icon name="apple" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    backgroundColor: "#1E88E5",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    position: "relative",
    overflow: "hidden",
  },
  decorativeCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    top: 120,
    left: -40,
  },
  decorativeCircle3: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    bottom: 20,
    right: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "400",
  },
  formSection: {
    backgroundColor: "#fff",
    marginTop: -20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#424242",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FAFAFA",
    height: 56,
  },
  inputContainerFocused: {
    borderColor: "#1E88E5",
    backgroundColor: "#fff",
    shadowColor: "#1E88E5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#212121",
    marginLeft: 12,
    fontWeight: "500",
  },
  eyeIcon: {
    padding: 4,
  },
  passwordStrengthContainer: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  strengthBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    textAlign: "right",
    fontWeight: "600",
  },
  matchIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  matchText: {
    fontSize: 12,
    color: "#4caf50",
    fontWeight: "500",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#BDBDBD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#1E88E5",
    borderColor: "#1E88E5",
  },
  checkboxText: {
    fontSize: 13,
    color: "#616161",
    flex: 1,
    lineHeight: 18,
  },
  linkText: {
    color: "#1E88E5",
    fontWeight: "600",
  },
  signUpButton: {
    backgroundColor: "#1E88E5",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#1E88E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    gap: 8,
  },
  signUpButtonDisabled: {
    backgroundColor: "#BDBDBD",
    shadowOpacity: 0.1,
  },
  signUpButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    color: "#9E9E9E",
    fontSize: 13,
    marginHorizontal: 16,
    fontWeight: "500",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 28,
  },
  socialButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 15,
    color: "#757575",
    fontWeight: "400",
  },
  loginLink: {
    fontSize: 15,
    color: "#1E88E5",
    fontWeight: "700",
  },
});

export default SignUpScreen;
