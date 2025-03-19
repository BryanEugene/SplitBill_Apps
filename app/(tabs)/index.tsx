import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    // Fetch data from database
    const fetchData = async () => {
      // Simulate API/database call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTotalSpent(425.75);
      setRecentTransactions([
        { id: 1, title: 'Dinner at Olive Garden', amount: 86.50, date: '2023-10-15', participants: 4, category: 'food' },
        { id: 2, title: 'Movie Night', amount: 48.25, date: '2023-10-10', participants: 3, category: 'entertainment' },
        { id: 3, title: 'Basketball Court', amount: 65.00, date: '2023-10-05', participants: 6, category: 'sports' },
      ]);
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const navigateToCategory = (category: string) => {
    router.push(`/bill/${category.toLowerCase()}`);
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'food':
        return <Ionicons name="restaurant-outline" size={24} color="#FF9800" />;
      case 'entertainment':
        return <Ionicons name="film-outline" size={24} color="#5B37B7" />;
      case 'accommodation':
        return <Ionicons name="bed-outline" size={24} color="#FF5722" />;
      case 'sports':
        return <Ionicons name="basketball-outline" size={24} color="#4CAF50" />;
      default:
        return <Ionicons name="receipt-outline" size={24} color="#5B37B7" />;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B37B7" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey, {user?.name || 'there'}!</Text>
          <Text style={styles.subTitle}>Track & split your expenses</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/lego/1.jpg' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Total Amount Card */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total Spent This Month</Text>
          <Text style={styles.amountValue}>{formatCurrency(totalSpent)}</Text>
          <TouchableOpacity style={styles.viewAllButton} onPress={() => router.push('/analytics')}>
            <Text style={styles.viewAllText}>View Analytics</Text>
            <Ionicons name="arrow-forward" size={16} color="#5B37B7" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
        
        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Add Expense</Text>
          <TouchableOpacity onPress={() => router.push('/bill/scan')}>
            <Text style={styles.seeAllText}>Scan Receipt</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.categoriesContainer}>
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigateToCategory('manual')}
          >
            <View style={[styles.categoryIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="restaurant-outline" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.categoryTitle}>Food & Drinks</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigateToCategory('accommodation')}
          >
            <View style={[styles.categoryIcon, { backgroundColor: '#FBE9E7' }]}>
              <Ionicons name="bed-outline" size={24} color="#FF5722" />
            </View>
            <Text style={styles.categoryTitle}>Accommodation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigateToCategory('entertainment')}
          >
            <View style={[styles.categoryIcon, { backgroundColor: '#F3EFFF' }]}>
              <Ionicons name="film-outline" size={24} color="#5B37B7" />
            </View>
            <Text style={styles.categoryTitle}>Entertainment</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.categoriesContainer}>
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigateToCategory('sports')}
          >
            <View style={[styles.categoryIcon, { backgroundColor: '#E0F7FA' }]}>
              <Ionicons name="basketball-outline" size={24} color="#00BCD4" />
            </View>
            <Text style={styles.categoryTitle}>Sports</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigateToCategory('manual')}
          >
            <View style={[styles.categoryIcon, { backgroundColor: '#FFF8E1' }]}>
              <Ionicons name="car-outline" size={24} color="#FFC107" />
            </View>
            <Text style={styles.categoryTitle}>Transportation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigateToCategory('manual')}
          >
            <View style={[styles.categoryIcon, { backgroundColor: '#F9FBE7' }]}>
              <Ionicons name="add" size={24} color="#8BC34A" />
            </View>
            <Text style={styles.categoryTitle}>Other</Text>
          </TouchableOpacity>
        </View>
        
        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/history')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {recentTransactions.map(transaction => (
          <TouchableOpacity key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionIconContainer}>
              {getCategoryIcon(transaction.category)}
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionTitle}>{transaction.title}</Text>
              <Text style={styles.transactionSubtitle}>
                {new Date(transaction.date).toLocaleDateString()} • {transaction.participants} people
              </Text>
            </View>
            <Text style={styles.transactionAmount}>${transaction.amount.toFixed(2)}</Text>
          </TouchableOpacity>
        ))}
        
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#5B37B7',
    fontFamily: 'Poppins-Medium',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#212121',
  },
  subTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#E1E1E1',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  amountCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  amountLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
  },
  amountValue: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#212121',
    marginTop: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#5B37B7',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#212121',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#5B37B7',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoryCard: {
    width: '30%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    textAlign: 'center',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  transactionSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#212121',
  },
  bottomSpace: {
    height: 100,
  },
});

export default Dashboard;
