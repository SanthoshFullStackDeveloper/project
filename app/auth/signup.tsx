import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { Mail, Lock, User, Scissors } from 'lucide-react-native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp 
} from 'react-native-reanimated';
import { theme } from '@/constants/theme';
import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupScreen() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
  });

  const validateInputs = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
    };
    
    let isValid = true;

    if (!name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!gender) {
      newErrors.gender = 'Gender is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;
    
    setLoading(true);
    try {
      const success = await signup(email, password, name, gender);
      
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Signup Failed', 'This email may already be in use. Please try a different email or sign in.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Animated.View 
            style={styles.logoContainer} 
            entering={FadeIn.delay(100).duration(600)}
          >
            <View style={styles.logoBackground}>
              <Scissors size={40} color={theme.colors.accent} />
            </View>
          </Animated.View>
          
          <Animated.Text 
            style={styles.title}
            entering={FadeInDown.delay(200).duration(600)}
          >
            Create Account
          </Animated.Text>
          <Animated.Text 
            style={styles.subtitle}
            entering={FadeInDown.delay(300).duration(600)}
          >
            Sign up for a new barber shop account
          </Animated.Text>
        </View>

        <Animated.View 
          style={styles.formContainer}
          entering={FadeInUp.delay(400).duration(600)}
        >
          <TextInput
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            error={errors.name}
            icon={<User size={20} color={theme.colors.text.tertiary} />}
          />

          <TextInput
            label="Email"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            icon={<Mail size={20} color={theme.colors.text.tertiary} />}
          />

          {/* Gender Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Gender</Text>
            <View style={[
              styles.pickerWrapper,
              errors.gender ? { borderColor: 'red' } : {}
            ]}>
              <Picker
  selectedValue={gender}
  onValueChange={(value) => setGender(value)}
  style={{ color: theme.colors.text.tertiary }} // set Picker text color
>
  <Picker.Item label="Select Gender" value=""color={theme.colors.text.tertiary} /> 
  <Picker.Item label="Male" value="male" color={theme.colors.text.tertiary} />
  <Picker.Item label="Female" value="female" color={theme.colors.text.tertiary} />
  <Picker.Item label="Other" value="other" color={theme.colors.text.tertiary} />
</Picker>

            </View>
            {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}
          </View>

          <TextInput
            label="Password"
            placeholder="Create a secure password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            icon={<Lock size={20} color={theme.colors.text.tertiary} />}
          />

          <TextInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
            icon={<Lock size={20} color={theme.colors.text.tertiary} />}
          />

          <Button
            title="Create Account"
            onPress={handleSignup}
            variant="primary"
            size="large"
            isLoading={loading}
            style={styles.signupButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  signupButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  loginText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  loginLink: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontFamily: 'Inter-Medium',
  },
  pickerContainer: {
    marginBottom: 16,
    color: theme.colors.text.secondary,
  },
  pickerLabel: {
    ...theme.typography.bodySmall,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.secondary,
  },
  pickerWrapper: {
    
    borderWidth: 1,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    color: theme.colors.text.secondary,
  },
  errorText: {
    color: theme.colors.error, // replaces 'red'
    marginTop: 4,
    ...theme.typography.caption,
  },
  
});
