import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { formatCurrency } from '../../utils/helpers';

type Transaction = {
  id: number;
  title: string;
  amount: number;
  date: string;
  participants: number;
  category: 'food' | 'entertainment' | 'accommodation' | 'sports';
};

const CategoryIcon = ({ category }: { category: Transaction['category'] }) => {
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

const History = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Transaction['category'] | 'all'>('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTransactions([
        { id: 1, title: 'Dinner at Olive Garden', amount: 86.50, date: '2023-10-15', participants: 4, category: 'food' },
        { id: 2, title: 'Movie Night', amount: 48.25, date: '2023-10-10', participants: 3, category: 'entertainment' },
        { id: 3, title: 'Basketball Court', amount: 65.00, date: '2023-10-05', participants: 6, category: 'sports' },
        { id: 4, title: 'Weekend Cabin', amount: 210.50, date: '2023-09-25', participants: 5, category: 'accommodation' },
        { id: 5, title: 'Pizza Party', amount: 42.75, date: '2023-09-20', participants: 4, category: 'food' },
        { id: 6, title: 'Concert Tickets', amount: 180.00, date: '2023-09-15', participants: 2, category: 'entertainment' },
        { id: 7, title: 'Tennis Court', amount: 35.00, date: '2023-09-10', participants: 4, category: 'sports' },
        { id: 8, title: 'Thai Restaurant', amount: 64.50, date: '2023-09-05', participants: 3, category: 'food' },
      ]);
      
      setLoading(false);
    };
    
    fetchTransactions();
  }, []);

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(t => t.category === filter);

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity style={styles.transactionCard}>
      <View style={[styles.categoryIconContainer, getCategoryColor(item.category)]}>
        <CategoryIcon category={item.category} />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionDate}>
          {new Date(item.date).toLocaleDateString()} • {item.participants} people
        </Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
        <Text style={styles.perPerson}>
          {formatCurrency(item.amount / item.participants)} / person
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getCategoryColor = (category: Transaction['category']) => {
    switch(category) {
      case 'food':
        return { backgroundColor: '#FFF3E0' };
      case 'entertainment':
        return { backgroundColor: '#EDE7F6' };
      case 'accommodation':
        return { backgroundColor: '#FBE9E7' };
      case 'sports':
        return { backgroundColor: '#E8F5E9' };
      default:
        return { backgroundColor: '#F3EFFF' };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B37B7" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'food' && styles.activeFilter]}
            onPress={() => setFilter('food')}
          >
            <Text style={[styles.filterText, filter === 'food' && styles.activeFilterText]}>Food</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'entertainment' && styles.activeFilter]}
            onPress={() => setFilter('entertainment')}
          >
            <Text style={[styles.filterText, filter === 'entertainment' && styles.activeFilterText]}>Entertainment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'accommodation' && styles.activeFilter]}
            onPress={() => setFilter('accommodation')}
          >
            <Text style={[styles.filterText, filter === 'accommodation' && styles.activeFilterText]}>Accommodation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'sports' && styles.activeFilter]}
            onPress={() => setFilter('sports')}
          >
            <Text style={[styles.filterText, filter === 'sports' && styles.activeFilterText]}>Sports</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {filteredTransactions.length > 0 ? (
        <FlatList
          data={filteredTransactions}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="history" size={80} color="#E0E0E0" />
          <Text style={styles.emptyText}>No transactions found</Text>
          <Text style={styles.emptySubtext}>Transactions will appear here once you start splitting bills</Text>
        </View>
      )}
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#212121',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  activeFilter: {
    backgroundColor: '#5B37B7',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#757575',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#212121',
    marginBottom: 4,
  },
  perPerson: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
    textAlign: 'center',
  },
});

export default History;
