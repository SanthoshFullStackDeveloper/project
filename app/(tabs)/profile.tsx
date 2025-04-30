import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
} from 'react-native';
import { User, Mail, Phone, Calendar, CreditCard, Heart, Settings, Bell, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    {
      title: 'My Appointments',
      icon: <Calendar size={22} color={theme.colors.primary} />,
      onPress: () => router.push('/appointments'),
    },
    {
      title: 'Payment Methods',
      icon: <CreditCard size={22} color={theme.colors.primary} />,
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      title: 'Favorite Barbers',
      icon: <Heart size={22} color={theme.colors.primary} />,
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      title: 'Settings',
      icon: <Settings size={22} color={theme.colors.primary} />,
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      title: 'Notifications',
      icon: <Bell size={22} color={theme.colors.primary} />,
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      title: 'Help & Support',
      icon: <HelpCircle size={22} color={theme.colors.primary} />,
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={styles.header}
          entering={FadeInDown.delay(100).duration(500)}
        >
          <Text style={styles.title}>Profile</Text>
        </Animated.View>

        <Animated.View 
          style={styles.profileCard}
          entering={FadeInDown.delay(200).duration(500)}
        >
          <View style={styles.profileImagePlaceholder}>
            <User size={40} color={theme.colors.accent} />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            
            <View style={styles.infoRow}>
              <Mail size={16} color={theme.colors.text.secondary} />
              <Text style={styles.infoText}>{user?.email || 'email@example.com'}</Text>
            </View>
            
            {user?.phone && (
              <View style={styles.infoRow}>
                <Phone size={16} color={theme.colors.text.secondary} />
                <Text style={styles.infoText}>{user.phone}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          style={styles.menuContainer}
          entering={FadeInDown.delay(300).duration(500)}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeftSection}>
                {item.icon}
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <ChevronRight size={18} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(400).duration(500)}
        >
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={22} color={theme.colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    marginBottom: 24,
  },
  profileImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginLeft: 6,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary,
  },
  editButtonText: {
    ...theme.typography.caption,
    color: theme.colors.text.inverse,
    fontFamily: 'Inter-Medium',
  },
  menuContainer: {
    backgroundColor: theme.colors.background,
    marginHorizontal: 20,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    marginBottom: 24,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  menuItemLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  logoutText: {
    ...theme.typography.body,
    color: theme.colors.error,
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
  },
});