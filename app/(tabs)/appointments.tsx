import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  RefreshControl,
} from 'react-native';
import { Calendar, Clock, Check, X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '@/constants/theme';
import { mockAppointments } from '@/data/mockAppointments';
import { mockBarbers } from '@/data/mockBarbers';

type TabType = 'upcoming' | 'past' | 'all';

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Filter appointments based on active tab
  const filteredAppointments = React.useMemo(() => {
    const today = new Date();
    
    switch (activeTab) {
      case 'upcoming':
        return mockAppointments
          .filter(appointment => 
            new Date(appointment.date) >= today || 
            appointment.status === 'pending' || 
            appointment.status === 'confirmed'
          )
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'past':
        return mockAppointments
          .filter(appointment => 
            new Date(appointment.date) < today || 
            appointment.status === 'completed' || 
            appointment.status === 'cancelled'
          )
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'all':
      default:
        return [...mockAppointments].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }
  }, [activeTab]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
      case 'cancelled':
        return theme.colors.error;
      case 'completed':
        return theme.colors.primary;
      default:
        return theme.colors.text.tertiary;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.delay(100).duration(500)}
      >
        <Text style={styles.title}>My Appointments</Text>
      </Animated.View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'upcoming' && styles.activeTabText
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'past' && styles.activeTabText
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'all' && styles.activeTabText
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No appointments found</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const barber = mockBarbers.find(b => b.id === item.barberId);
          
          return (
            <Animated.View 
              style={styles.appointmentCard}
              entering={FadeInDown.delay(100 + (index * 100)).duration(500)}
            >
              <View style={styles.appointmentHeader}>
                <View style={styles.serviceContainer}>
                  <Text style={styles.serviceName}>{item.service}</Text>
                  <View style={styles.statusContainer}>
                    <View 
                      style={[
                        styles.statusDot, 
                        { backgroundColor: getStatusColor(item.status) }
                      ]} 
                    />
                    <Text style={styles.statusText}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.dateTimeContainer}>
                  <View style={styles.iconTextRow}>
                    <Calendar size={14} color={theme.colors.text.secondary} />
                    <Text style={styles.dateTimeText}>
                      {formatDate(new Date(item.date))}
                    </Text>
                  </View>
                  <View style={styles.iconTextRow}>
                    <Clock size={14} color={theme.colors.text.secondary} />
                    <Text style={styles.dateTimeText}>{item.time}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.barberRow}>
                {barber && (
                  <>
                    <Image 
                      source={{ uri: barber.image }} 
                      style={styles.barberImage} 
                    />
                    <View style={styles.barberInfo}>
                      <Text style={styles.barberName}>{barber.name}</Text>
                      <Text style={styles.barberSpecialty}>{barber.specialty}</Text>
                    </View>
                  </>
                )}
              </View>

              {(item.status === 'confirmed' || item.status === 'pending') && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.rescheduleButton]}
                    onPress={() => {/* Handle reschedule */}}
                  >
                    <Text style={styles.actionButtonText}>Reschedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => {/* Handle cancel */}}
                  >
                    <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {item.status === 'completed' && (
                <View style={styles.completedRow}>
                  <Check size={18} color={theme.colors.success} />
                  <Text style={styles.completedText}>Appointment completed</Text>
                </View>
              )}

              {item.status === 'cancelled' && (
                <View style={styles.completedRow}>
                  <X size={18} color={theme.colors.error} />
                  <Text style={[styles.completedText, { color: theme.colors.error }]}>
                    Appointment cancelled
                  </Text>
                </View>
              )}
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border.light,
  },
  activeTab: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    ...theme.typography.body,
    color: theme.colors.text.tertiary,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontFamily: 'Inter-Medium',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 16,
    padding: 16,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  serviceContainer: {
    flex: 1,
  },
  serviceName: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  dateTimeContainer: {
    justifyContent: 'center',
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateTimeText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginBottom: 12,
  },
  barberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barberImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  barberInfo: {
    flex: 1,
  },
  barberName: {
    ...theme.typography.bodySmall,
    fontFamily: 'Inter-Medium',
    color: theme.colors.text.primary,
  },
  barberSpecialty: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  rescheduleButton: {
    backgroundColor: theme.colors.accent,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  actionButtonText: {
    ...theme.typography.button,
    color: theme.colors.text.primary,
  },
  cancelButtonText: {
    color: theme.colors.error,
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  completedText: {
    ...theme.typography.bodySmall,
    color: theme.colors.success,
    marginLeft: 6,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.text.tertiary,
  },
});