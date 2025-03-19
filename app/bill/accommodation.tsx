import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Friend = {
  id: string;
  name: string;
};

const AccommodationBill = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000)); // Tomorrow
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>(['me']);
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mocked friends data
  const friends: Friend[] = [
    { id: 'me', name: 'Me (You)' },
    { id: 'friend1', name: 'John Smith' },
    { id: 'friend2', name: 'Sarah Davis' },
    { id: 'friend3', name: 'Mike Johnson' },
    { id: 'friend4', name: 'Emma Wilson' },
  ];

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev => {
      if (prev.includes(friendId)) {
        return prev.filter(id => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  const calculateDays = () => {
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculatePerPerson = () => {
    const totalPrice = parseFloat(price) || 0;
    if (selectedFriends.length === 0) return 0;
    return totalPrice / selectedFriends.length;
  };

  const handleSaveBill = () => {
    if (!name.trim() || !price.trim() || selectedFriends.length === 0) {
      Alert.alert('Error', 'Please fill in all fields and select at least one person');
      return;
    }

    setIsLoading(true);
    
    // Simulate saving to database
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Accommodation bill has been saved and shared with your friends',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    }, 1500);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accommodation Split</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {!showSummary ? (
            <>
              <View style={styles.imageContainer}>
                {/* <Image
                  source={require('../../assets/images/accommodation.png')}
                  style={styles.accommodationImage}
                  resizeMode="contain"
                /> */}
              </View>
              
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Accommodation Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Mountain Cabin, Hotel Room"
                    placeholderTextColor="#9E9E9E"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Total Price</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter total price"
                    placeholderTextColor="#9E9E9E"
                    keyboardType="decimal-pad"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>
                
                <View style={styles.dateContainer}>
                  <View style={styles.dateInput}>
                    <Text style={styles.inputLabel}>Check-in Date</Text>
                    <TouchableOpacity 
                      style={styles.dateButton}
                      onPress={() => setShowCheckInPicker(true)}
                    >
                      <Text style={styles.dateText}>{formatDate(checkIn)}</Text>
                      <Ionicons name="calendar-outline" size={20} color="#757575" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.dateInput}>
                    <Text style={styles.inputLabel}>Check-out Date</Text>
                    <TouchableOpacity 
                      style={styles.dateButton}
                      onPress={() => setShowCheckOutPicker(true)}
                    >
                      <Text style={styles.dateText}>{formatDate(checkOut)}</Text>
                      <Ionicons name="calendar-outline" size={20} color="#757575" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.stayDetails}>
                  <Text style={styles.stayInfoText}>
                    {calculateDays()} night{calculateDays() !== 1 ? 's' : ''}
                  </Text>
                </View>
                
                <View style={styles.friendsContainer}>
                  <Text style={styles.inputLabel}>Split with</Text>
                  <View style={styles.friendsList}>
                    {friends.map(friend => (
                      <TouchableOpacity
                        key={friend.id}
                        style={[
                          styles.friendChip,
                          selectedFriends.includes(friend.id) && styles.friendChipSelected
                        ]}
                        onPress={() => toggleFriend(friend.id)}
                      >
                        <Text
                          style={[
                            styles.friendChipText,
                            selectedFriends.includes(friend.id) && styles.friendChipTextSelected
                          ]}
                        >
                          {friend.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.summaryButton}
                  onPress={() => setShowSummary(true)}
                >
                  <Text style={styles.summaryButtonText}>See Split Summary</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>{name}</Text>
              <Text style={styles.summarySubtitle}>
                {formatDate(checkIn)} - {formatDate(checkOut)} • {calculateDays()} night{calculateDays() !== 1 ? 's' : ''}
              </Text>
              
              <View style={styles.summaryDivider} />
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Total Price</Text>
                <Text style={styles.priceValue}>${parseFloat(price).toFixed(2)}</Text>
              </View>
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Number of People</Text>
                <Text style={styles.priceValue}>{selectedFriends.length}</Text>
              </View>
              
              <View style={styles.priceRowHighlighted}>
                <Text style={styles.priceLabel}>Each Person Pays</Text>
                <Text style={styles.highlightedPrice}>${calculatePerPerson().toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryDivider} />
              
              <Text style={styles.splitDetailsTitle}>Split Details</Text>
              
              {selectedFriends.map(friendId => {
                const friend = friends.find(f => f.id === friendId);
                return (
                  <View key={friendId} style={styles.splitDetailRow}>
                    <Text style={styles.splitDetailName}>{friend?.name}</Text>
                    <Text style={styles.splitDetailAmount}>${calculatePerPerson().toFixed(2)}</Text>
                  </View>
                );
              })}
              
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setShowSummary(false)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveBill}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save & Share</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          <View style={styles.bottomSpace} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  accommodationImage: {
    width: 180,
    height: 180,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateInput: {
    width: '48%',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  stayDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  stayInfoText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#5B37B7',
  },
  friendsContainer: {
    marginBottom: 20,
  },
  friendsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  friendChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F5F7',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  friendChipSelected: {
    backgroundColor: '#5B37B7',
  },
  friendChipText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
  },
  friendChipTextSelected: {
    color: 'white',
  },
  summaryButton: {
    backgroundColor: '#5B37B7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  summaryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#212121',
  },
  summarySubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
    marginBottom: 16,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceRowHighlighted: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  priceLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  priceValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  highlightedPrice: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#5B37B7',
  },
  splitDetailsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginBottom: 12,
  },
  splitDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  splitDetailName: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  splitDetailAmount: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#5B37B7',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#5B37B7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  bottomSpace: {
    height: 100,
  },
});

export default AccommodationBill;
