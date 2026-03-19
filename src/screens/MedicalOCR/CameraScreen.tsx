import React, {useCallback, useRef, useState} from 'react';
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {useTheme} from '../../hooks';
import {CameraIcon, CloseIcon} from '../../assets/icons';
import {MedicalOCRStackParamList} from './MedicalOCRNavigator';

type CapturedPhoto = {uri: string};

export const CameraScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<StackNavigationProp<MedicalOCRStackParamList, 'MedicalOCRCamera'>>();
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);

  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(
    null,
  );
  const [isCameraActive, setIsCameraActive] = useState(true);

  const handleRequestPermission = useCallback(async () => {
    const granted = await requestPermission();
    if (!granted) {
      Alert.alert(
        'Camera Permission Required',
        'MedCypher needs camera access to capture medical documents. Please enable it in Settings.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => Linking.openSettings()},
        ],
      );
    }
  }, [requestPermission]);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current) {
      return;
    }
    try {
      const photo = await cameraRef.current.takePhoto({
        flash,
      });
      setCapturedPhoto({uri: `file://${photo.path}`});
      setIsCameraActive(false);
    } catch (e) {
      Alert.alert('Capture Failed', 'Could not take photo. Please try again.');
    }
  }, [flash]);

  const handleRetake = useCallback(() => {
    setCapturedPhoto(null);
    setIsCameraActive(true);
  }, []);

  const handleUsePhoto = useCallback(() => {
    if (!capturedPhoto) {
      return;
    }
    navigation.navigate('MedicalOCRProcessing', {imageUri: capturedPhoto.uri});
  }, [capturedPhoto, navigation]);

  const s = styles(theme, insets);

  // Permission not yet requested
  if (!hasPermission) {
    return (
      <View style={s.centered}>
        <CameraIcon
          width={48}
          height={48}
          stroke={theme.colors.onBackground}
        />
        <Text variant="titleMedium" style={s.permissionTitle}>
          Camera Access Needed
        </Text>
        <Text variant="bodyMedium" style={s.permissionBody}>
          Grant camera permission to capture medical documents.
        </Text>
        <TouchableOpacity
          style={s.permissionButton}
          onPress={handleRequestPermission}>
          <Text style={s.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Preview after capture
  if (capturedPhoto) {
    return (
      <View style={s.fullScreen}>
        <Image source={{uri: capturedPhoto.uri}} style={s.preview} />
        <View style={s.previewActions}>
          <TouchableOpacity style={[s.actionBtn, s.retakeBtn]} onPress={handleRetake}>
            <Text style={s.retakeBtnText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, s.usePhotoBtn]} onPress={handleUsePhoto}>
            <Text style={s.usePhotoBtnText}>Use Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // No camera device available
  if (!device) {
    return (
      <View style={s.centered}>
        <Text variant="bodyMedium" style={s.permissionBody}>
          No camera device found on this device.
        </Text>
      </View>
    );
  }

  // Live camera view
  return (
    <View style={s.fullScreen}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isCameraActive}
        photo
      />

      {/* Flash toggle */}
      <TouchableOpacity
        style={[s.topRight, {top: insets.top + 16}]}
        onPress={() => setFlash(f => (f === 'off' ? 'on' : 'off'))}>
        <Text style={s.flashLabel}>{flash === 'on' ? '⚡ ON' : '⚡ OFF'}</Text>
      </TouchableOpacity>

      {/* Capture button */}
      <View style={[s.captureRow, {paddingBottom: insets.bottom + 24}]}>
        <TouchableOpacity style={s.captureOuter} onPress={handleCapture}>
          <View style={s.captureInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = (theme: ReturnType<typeof useTheme>, insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    fullScreen: {
      flex: 1,
      backgroundColor: '#000',
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      backgroundColor: theme.colors.background,
      gap: 16,
    },
    permissionTitle: {
      color: theme.colors.onBackground,
      textAlign: 'center',
    },
    permissionBody: {
      color: theme.colors.onBackground,
      textAlign: 'center',
      opacity: 0.7,
    },
    permissionButton: {
      marginTop: 8,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: theme.borders.default,
    },
    permissionButtonText: {
      color: theme.colors.onPrimary ?? '#fff',
      fontWeight: '600',
    },
    topRight: {
      position: 'absolute',
      right: 16,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    flashLabel: {
      color: '#fff',
      fontSize: 13,
      fontWeight: '600',
    },
    captureRow: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    captureOuter: {
      width: 76,
      height: 76,
      borderRadius: 38,
      borderWidth: 4,
      borderColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    captureInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#fff',
    },
    preview: {
      flex: 1,
      resizeMode: 'cover',
    },
    previewActions: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingBottom: insets.bottom + 24,
      paddingTop: 16,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    actionBtn: {
      paddingHorizontal: 28,
      paddingVertical: 14,
      borderRadius: theme.borders.default,
      minWidth: 120,
      alignItems: 'center',
    },
    retakeBtn: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.5)',
    },
    retakeBtnText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    usePhotoBtn: {
      backgroundColor: '#22c55e',
    },
    usePhotoBtnText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 16,
    },
  });
