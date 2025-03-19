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
import { Ionicons, AntDesign } from '@expo/vector-icons';

type Friend = {
  id: string;
  name: string;
};

type TicketItem = {
  id: string;
  name: string;
  quantity: string;
  pricePerUnit: string;
  assignedTo: string[];
};

const EntertainmentBill = () => {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [tickets, setTickets] = useState<TicketItem[]>([
    { id: '1', name: 'Standard Ticket', quantity: '1', pricePerUnit: '', assignedTo: [] }
  ]);
  const [additionalExpenses, setAdditionalExpenses] = useState('');
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

  const handleAddTicket = () => {
    const newId = String(tickets.length + 1);
    setTickets([...tickets, { id: newId, name: '', quantity: '1', pricePerUnit: '', assignedTo: [] }]);
  };

  const handleRemoveTicket = (id: string) => {
    if (tickets.length > 1) {
      setTickets(tickets.filter(ticket => ticket.id !== id));
    }
  };

  const updateTicket = (id: string, field: keyof TicketItem, value: string | string[]) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id ? { ...ticket, [field]: value } : ticket
    ));
  };

  const toggleFriendForTicket = (ticketId: string, friendId: string) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const updatedAssignedTo = ticket.assignedTo.includes(friendId)
          ? ticket.assignedTo.filter(id => id !== friendId)
          : [...ticket.assignedTo, friendId];
        
        return { ...ticket, assignedTo: updatedAssignedTo };
      }
      return ticket;
    }));
  };

  const calculateTicketTotal = (ticket: TicketItem) => {
    const quantity = parseInt(ticket.quantity) || 0;
    const price = parseFloat(ticket.pricePerUnit) || 0;
    return quantity * price;
  };

  const calculateSubtotal = () => {
    return tickets.reduce((total, ticket) => {
      return total + calculateTicketTotal(ticket);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const additional = parseFloat(additionalExpenses) || 0;
    return subtotal + additional;
  };

  const calculateSplitAmounts = () => {
    const result: Record<string, number> = {};
    
    // Initialize all friends with 0
    friends.forEach(friend => {
      result[friend.id] = 0;
    });
    
    // Calculate each friend's portion for tickets
    tickets.forEach(ticket => {
      const ticketTotal = calculateTicketTotal(ticket);
      if (ticketTotal > 0 && ticket.assignedTo.length > 0) {
        const pricePerPerson = ticketTotal / ticket.assignedTo.length;
        
        ticket.assignedTo.forEach(friendId => {
          result[friendId] = (result[friendId] || 0) + pricePerPerson;
        });
      }
    });
    
    // Add proportional additional expenses
    const additionalValue = parseFloat(additionalExpenses) || 0;
    if (additionalValue > 0) {
      // Get all distinct friends who are assigned to at least one ticket
      const involvedFriends = Array.from(
        new Set(tickets.flatMap(ticket => ticket.assignedTo))
      );
      
      if (involvedFriends.length > 0) {
        const additionalPerPerson = additionalValue / involvedFriends.length;
        involvedFriends.forEach(friendId => {
          result[friendId] += additionalPerPerson;
        });
      }
    }
    
    return result;
  };

  const handleSaveBill = () => {
    if (!eventName || !location) {
      Alert.alert('Error', 'Please fill in event name and location');
      return;
    }

    let isValid = true;
    tickets.forEach(ticket => {
      if (!ticket.name || !ticket.pricePerUnit || ticket.assignedTo.length === 0) {
        isValid = false;
      }
    });

    if (!isValid) {
      Alert.alert('Error', 'Please fill in all ticket details and assign each ticket to at least one person');
      return;
    }

    setIsLoading(true);
    
    // Simulate saving to database
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Entertainment bill has been saved and shared with your friends',
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
        <Text style={styles.headerTitle}>Entertainment Split</Text>
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
                  source={require('../../assets/images/entertainment.png')}
                  style={styles.entertainmentImage}
                  resizeMode="contain"
                /> */}
              </View>
              
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Event Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Movie, Concert, Theater"
                    placeholderTextColor="#9E9E9E"
                    value={eventName}
                    onChangeText={setEventName}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Location</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter location"
                    placeholderTextColor="#9E9E9E"
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <View style={styles.dateButton}>
                    <Text style={styles.dateText}>{formatDate(date)}</Text>
                    <Ionicons name="calendar-outline" size={20} color="#757575" />
                  </View>
                </View>
                
                <View style={styles.ticketsContainer}>
                  <Text style={styles.sectionTitle}>Tickets</Text>
                  
                  {tickets.map((ticket, index) => (
                    <View key={ticket.id} style={styles.ticketItem}>
                      <View style={styles.ticketHeader}>
                        <Text style={styles.ticketNumber}>Ticket {index + 1}</Text>
                        {tickets.length > 1 && (
                          <TouchableOpacity 
                            onPress={() => handleRemoveTicket(ticket.id)}
                            style={styles.removeButton}
                          >
                            <AntDesign name="close" size={18} color="#FF5252" />
                          </TouchableOpacity>
                        )}
                      </View>
                      
                      <View style={styles.ticketNameRow}>
                        <Text style={styles.ticketLabel}>Ticket Type</Text>
                        <TextInput
                          style={styles.ticketInput}
                          placeholder="e.g., Standard, VIP"
                          placeholderTextColor="#9E9E9E"
                          value={ticket.name}
                          onChangeText={(value) => updateTicket(ticket.id, 'name', value)}
                        />
                      </View>
                      
                      <View style={styles.ticketPriceRow}>
                        <View style={styles.ticketQuantityContainer}>
                          <Text style={styles.ticketLabel}>Quantity</Text>
                          <TextInput
                            style={styles.ticketInput}
                            placeholder="1"
                            placeholderTextColor="#9E9E9E"
                            keyboardType="numeric"
                            value={ticket.quantity}
                            onChangeText={(value) => updateTicket(ticket.id, 'quantity', value)}
                          />
                        </View>
                        
                        <View style={styles.ticketPriceContainer}>
                          <Text style={styles.ticketLabel}>Price per ticket</Text>
                          <TextInput
                            style={styles.ticketInput}
                            placeholder="0.00"
                            placeholderTextColor="#9E9E9E"
                            keyboardType="decimal-pad"
                            value={ticket.pricePerUnit}
                            onChangeText={(value) => updateTicket(ticket.id, 'pricePerUnit', value)}
                          />
                        </View>
                      </View>
                      
                      <View style={styles.ticketAssignContainer}>
                        <Text style={styles.ticketLabel}>Assign to</Text>
                        <View style={styles.friendsList}>
                          {friends.map(friend => (
                            <TouchableOpacity
                              key={friend.id}
                              style={[
                                styles.friendChip,
                                ticket.assignedTo.includes(friend.id) && styles.friendChipSelected
                              ]}
                              onPress={() => toggleFriendForTicket(ticket.id, friend.id)}
                            >
                              <Text
                                style={[
                                  styles.friendChipText,
                                  ticket.assignedTo.includes(friend.id) && styles.friendChipTextSelected
                                ]}
                              >
                                {friend.name}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                      
                      <View style={styles.ticketTotalRow}>
                        <Text style={styles.ticketTotalLabel}>Total:</Text>
                        <Text style={styles.ticketTotalValue}>
                          ${calculateTicketTotal(ticket).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  ))}
                  
                  <TouchableOpacity 
                    style={styles.addTicketButton}
                    onPress={handleAddTicket}
                  >
                    <Ionicons name="add-circle-outline" size={20} color="#5B37B7" />
                    <Text style={styles.addTicketText}>Add Ticket</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.additionalExpensesContainer}>
                  <Text style={styles.sectionTitle}>Additional Expenses</Text>
                  <TextInput
                    style={styles.additionalExpensesInput}
                    placeholder="Enter amount (e.g., parking, food)"
                    placeholderTextColor="#9E9E9E"
                    keyboardType="decimal-pad"
                    value={additionalExpenses}
                    onChangeText={setAdditionalExpenses}
                  />
                </View>
                
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
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
              <Text style={styles.summaryTitle}>{eventName}</Text>
              <Text style={styles.summarySubtitle}>{location} • {formatDate(date)}</Text>
              
              <View style={styles.summaryDivider} />
              
              <Text style={styles.ticketsSummaryTitle}>Tickets</Text>
              
              {tickets.map(ticket => (
                <View key={ticket.id} style={styles.summaryTicketRow}>
                  <Text style={styles.summaryTicketDetail}>
                    {ticket.name} (x{ticket.quantity})
                  </Text>
                  <Text style={styles.summaryTicketValue}>
                    ${calculateTicketTotal(ticket).toFixed(2)}
                  </Text>
                </View>
              ))}
              
              <View style={styles.summaryAdditionalRow}>
                <Text style={styles.summaryTicketDetail}>Additional Expenses</Text>
                <Text style={styles.summaryTicketValue}>
                  ${(parseFloat(additionalExpenses) || 0).toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.summaryTotalRow}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>${calculateTotal().toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryDivider} />
              
              <Text style={styles.splitDetailsTitle}>How it's split</Text>
              
              {Object.entries(calculateSplitAmounts()).map(([friendId, amount]) => {
                if (amount <= 0) return null;
                const friend = friends.find(f => f.id === friendId);
                if (!friend) return null;
                
                return (
                  <View key={friendId} style={styles.splitDetailRow}>
                    <Text style={styles.splitDetailName}>{friend.name}</Text>
                    <Text style={styles.splitDetailAmount}>${amount.toFixed(2)}</Text>
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
    paddingBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  entertainmentImage: {
    width: 150,
    height: 150,
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
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  ticketsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginBottom: 12,
  },
  ticketItem: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#5B37B7',
  },
  removeButton: {
    padding: 4,
  },
  ticketNameRow: {
    marginBottom: 12,
  },
  ticketPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ticketQuantityContainer: {
    flex: 1,
    marginRight: 10,
  },
  ticketPriceContainer: {
    flex: 2,
  },
  ticketLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
    marginBottom: 8,
  },
  ticketInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  ticketAssignContainer: {
    marginBottom: 12,
  },
  friendsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  friendChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
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
  ticketTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  ticketTotalLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  ticketTotalValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#5B37B7',
  },
  addTicketButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3EFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#5B37B7',
  },
  addTicketText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#5B37B7',
  },
  additionalExpensesContainer: {
    marginBottom: 20,
  },
  additionalExpensesInput: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#5B37B7',
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
    marginVertical: 20,
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
    marginBottom: 8,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
  ticketsSummaryTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginBottom: 12,
  },
  summaryTicketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  summaryTicketDetail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#212121',
    flex: 2,
  },
  summaryTicketValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    flex: 1,
    textAlign: 'right',
  },
  summaryAdditionalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 4,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  summaryTotalValue: {
    fontSize: 16,
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

export default EntertainmentBill;
