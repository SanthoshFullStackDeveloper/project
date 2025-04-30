import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
} from 'react-native';
import { Clock, DollarSign } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { theme } from '@/constants/theme';
import { mockServices } from '@/data/mockServices';

export default function ServicesScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={styles.header}
        entering={FadeInDown.delay(100).duration(500)}
      >
        <Text style={styles.title}>Our Services</Text>
        <Text style={styles.subtitle}>Select a service to book an appointment</Text>
      </Animated.View>

      <FlatList
        data={mockServices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item, index }) => (
          <Animated.View 
            entering={FadeInDown.delay(100 + (index * 100)).duration(500)}
            style={styles.serviceCard}
          >
            <Image 
              source={{ uri: item.image }} 
              style={styles.serviceImage} 
            />
            <View style={styles.serviceContent}>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.serviceDescription}>{item.description}</Text>
              
              <View style={styles.serviceMetaContainer}>
                <View style={styles.serviceMeta}>
                  <View style={styles.metaItem}>
                    <DollarSign size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.metaText}>${item.price}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.metaText}>{item.duration}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.bookButton}
                  onPress={() => {/* Handle booking */}}
                >
                  <Text style={styles.bookButtonText}>Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
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
    marginBottom: 8,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  serviceCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 16,
    overflow: 'hidden',
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  serviceImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  serviceContent: {
    padding: 16,
  },
  serviceName: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  serviceDescription: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: 16,
  },
  serviceMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text.secondary,
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
  },
  bookButtonText: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
  },
});