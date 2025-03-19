import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const PREVIEW_SIZE = width * 0.8;

const ScanReceipt = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanStatus, setScanStatus] = useState<'waiting' | 'processing' | 'success' | 'error'>('waiting');

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const processReceipt = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    setScanStatus('processing');
    
    try {
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setScanStatus('success');
      
      // Simulate successful processing
      setTimeout(() => {
        setIsProcessing(false);
        router.replace('/bill/manual');
      }, 1500);
    } catch (error) {
      console.error('Error processing receipt:', error);
      setScanStatus('error');
      setIsProcessing(false);
      Alert.alert(
        'Scanning Failed',
        'Could not process the receipt. Please enter details manually.',
        [
          { text: 'Manual Entry', onPress: () => router.replace('/bill/manual') }
        ]
      );
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setScanStatus('waiting');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={capturedImage ? "dark" : "light"} />
      
      {!capturedImage ? (
        // Image selection view
        <View style={styles.placeholderContainer}>
          <MaterialIcons name="add-a-photo" size={80} color="#5B37B7" />
          <Text style={styles.placeholderText}>
            Add a receipt photo to start splitting your bill
          </Text>
          
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={pickImage}
          >
            <Text style={styles.selectButtonText}>Select from Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Image Preview
        <View style={styles.previewContainer}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.headerBackButton} 
              onPress={handleRetake}
            >
              <Ionicons name="arrow-back" size={24} color="#212121" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Receipt Preview</Text>
            <View style={{ width: 40 }} />
          </View>
          
          <View style={styles.imagePreviewContainer}>
            <Image 
              source={{ uri: capturedImage }} 
              style={styles.previewImage} 
              resizeMode="contain"
            />
          </View>
          
          {isProcessing ? (
            <View style={styles.processingContainer}>
              {scanStatus === 'processing' ? (
                <>
                  <ActivityIndicator size="large" color="#5B37B7" />
                  <Text style={styles.processingText}>Analyzing receipt...</Text>
                  <Text style={styles.processingSubtext}>This may take a moment</Text>
                </>
              ) : scanStatus === 'success' ? (
                <>
                  <View style={styles.successIconContainer}>
                    <Ionicons name="checkmark" size={32} color="white" />
                  </View>
                  <Text style={styles.successText}>Receipt scanned successfully!</Text>
                  <Text style={styles.successSubtext}>Taking you to bill entry...</Text>
                </>
              ) : (
                <>
                  <View style={styles.errorIconContainer}>
                    <Ionicons name="close" size={32} color="white" />
                  </View>
                  <Text style={styles.errorText}>Scanning failed</Text>
                  <Text style={styles.errorSubtext}>Please try again or use manual entry</Text>
                </>
              )}
            </View>
          ) : (
            <View style={styles.previewActions}>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={handleRetake}
              >
                <Text style={styles.retakeButtonText}>Retake</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.usePhotoButton}
                onPress={processReceipt}
              >
                <Text style={styles.usePhotoButtonText}>Process Receipt</Text>
              </TouchableOpacity>
            </View>
          )}
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
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  selectButton: {
    backgroundColor: '#5B37B7',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  backButton: {
    backgroundColor: '#EEEEEE',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#212121',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  previewContainer: {
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
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: '90%',
    height: '80%',
    borderRadius: 12,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  retakeButton: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  retakeButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  usePhotoButton: {
    flex: 2,
    backgroundColor: '#5B37B7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  usePhotoButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  processingText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
    marginTop: 16,
  },
  processingSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
    marginTop: 8,
  },
  successIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  successText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  successSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
    marginTop: 8,
  },
  errorIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#212121',
  },
  errorSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#757575',
    marginTop: 8,
  },
});

export default ScanReceipt;
