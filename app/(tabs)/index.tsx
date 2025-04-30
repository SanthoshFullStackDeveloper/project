import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Calendar, Clock, MapPin, Scissors } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { mockAppointments } from '@/data/mockAppointments';
import { mockBarbers } from '@/data/mockBarbers';
import { mockServices } from '@/data/mockServices';

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Get upcoming appointments (not in the past and not completed)
  const upcomingAppointments = mockAppointments
    .filter(appointment => 
      new Date(appointment.date) > new Date() && 
      appointment.status !== 'completed'
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Format date
  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name.split(' ')[0] || 'Guest'}</Text>
            <Text style={styles.welcomeText}>Welcome to Supreme Cuts</Text>
          </View>
          <View style={styles.logoContainer}>
            <Scissors size={24} color={theme.colors.primary} />
          </View>
        </View>

        {/* Next Appointment */}
        {upcomingAppointments.length > 0 ? (
          <Animated.View 
            style={styles.nextAppointmentCard}
            entering={FadeInDown.delay(200).duration(500)}
          >
            <View style={styles.appointmentHeader}>
              <Text style={styles.sectionTitle}>Your Next Appointment</Text>
              <TouchableOpacity 
                onPress={() => router.push('/appointments')}
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.appointmentDetails}>
              <View style={styles.appointmentInfo}>
                <View style={styles.appointmentRow}>
                  <Calendar size={16} color={theme.colors.text.secondary} />
                  <Text style={styles.appointmentText}>
                    {formatDate(new Date(upcomingAppointments[0].date))}
                  </Text>
                </View>
                <View style={styles.appointmentRow}>
                  <Clock size={16} color={theme.colors.text.secondary} />
                  <Text style={styles.appointmentText}>{upcomingAppointments[0].time}</Text>
                </View>
                <View style={styles.appointmentRow}>
                  <Scissors size={16} color={theme.colors.text.secondary} />
                  <Text style={styles.appointmentText}>{upcomingAppointments[0].service}</Text>
                </View>
                <View style={styles.appointmentRow}>
                  <MapPin size={16} color={theme.colors.text.secondary} />
                  <Text style={styles.appointmentText}>123 Barber St, City</Text>
                </View>
              </View>

              <View style={styles.barberContainer}>
                {mockBarbers
                  .filter(barber => barber.id === upcomingAppointments[0].barberId)
                  .map(barber => (
                    <View key={barber.id} style={styles.barberInfo}>
                      <Image 
                        source={{ uri: barber.image }} 
                        style={styles.barberImage} 
                      />
                      <Text style={styles.barberName}>{barber.name}</Text>
                    </View>
                  ))
                }
              </View>
            </View>

            <TouchableOpacity 
              style={styles.rescheduleButton}
              onPress={() => {/* Handle reschedule */}}
            >
              <Text style={styles.rescheduleText}>Reschedule</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View 
            style={styles.nextAppointmentCard}
            entering={FadeInDown.delay(200).duration(500)}
          >
            <Text style={styles.sectionTitle}>No Upcoming Appointments</Text>
            <Text style={styles.noAppointmentText}>Book your next haircut today</Text>
            <TouchableOpacity 
              style={[styles.rescheduleButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => router.push('/services')}
            >
              <Text style={[styles.rescheduleText, { color: theme.colors.text.inverse }]}>Book Now</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Popular Services */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            <TouchableOpacity 
              onPress={() => router.push('/services')}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={mockServices.slice(0, 3)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.servicesList}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.serviceCard}
                onPress={() => {/* Handle service selection */}}
              >
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.serviceImage} 
                />
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{item.name}</Text>
                  <View style={styles.serviceMeta}>
                    <Text style={styles.servicePrice}>${item.price}</Text>
                    <Text style={styles.serviceDuration}>{item.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Featured Barbers */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Barbers</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={mockBarbers.filter(barber => barber.available)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.barbersList}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.barberCard}
                onPress={() => {/* Handle barber selection */}}
              >
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.barberCardImage} 
                />
                <Text style={styles.barberCardName}>{item.name}</Text>
                <Text style={styles.barberSpecialty}>{item.specialty}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <Text style={styles.ratingCount}>★</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  greeting: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
  },
  welcomeText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextAppointmentCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appointmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginLeft: 8,
  },
  barberContainer: {
    marginLeft: 16,
  },
  barberInfo: {
    alignItems: 'center',
  },
  barberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  barberName: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  rescheduleButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    marginTop: 16,
  },
  rescheduleText: {
    ...theme.typography.button,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  noAppointmentText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginVertical: 12,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
  },
  viewAllButton: {
    padding: 4,
  },
  viewAllText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
  },
  servicesList: {
    paddingHorizontal: 20,
  },
  serviceCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  serviceImage: {
    width: '100%',
    height: 120,
  },
  serviceInfo: {
    padding: 12,
  },
  serviceName: {
    ...theme.typography.bodySmall,
    fontFamily: 'Inter-Medium',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  serviceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  servicePrice: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontFamily: 'Inter-Medium',
  },
  serviceDuration: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  barbersList: {
    paddingHorizontal: 20,
  },
  barberCard: {
    width: 140,
    marginRight: 16,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  barberCardImage: {
    width: '100%',
    height: 140,
  },
  barberCardName: {
    ...theme.typography.bodySmall,
    fontFamily: 'Inter-Medium',
    color: theme.colors.text.primary,
    marginTop: 8,
    marginHorizontal: 8,
  },
  barberSpecialty: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    marginHorizontal: 8,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  ratingText: {
    ...theme.typography.caption,
    fontFamily: 'Inter-Medium',
    color: theme.colors.text.primary,
  },
  ratingCount: {
    ...theme.typography.caption,
    color: theme.colors.accent,
    marginLeft: 4,
  },
});