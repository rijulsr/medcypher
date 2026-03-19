import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, BackHandler, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import {CircularActivityIndicator} from '../../components';
import {useTheme} from '../../hooks';
import {modelStore} from '../../store';
import {
  buildExtractionPrompt,
  parseExtractionResult,
} from '../../utils/medical/prompts';
import {MedicalOCRStackParamList} from './MedicalOCRNavigator';

type ProcessingScreenNavigationProp = StackNavigationProp<
  MedicalOCRStackParamList,
  'MedicalOCRProcessing'
>;
type ProcessingScreenRouteProp = RouteProp<
  MedicalOCRStackParamList,
  'MedicalOCRProcessing'
>;

interface Props {
  navigation: ProcessingScreenNavigationProp;
  route: ProcessingScreenRouteProp;
}

export const ProcessingScreen: React.FC<Props> = ({navigation, route}) => {
  const theme = useTheme();
  const {imageUri} = route.params;

  const [tokensPerSec, setTokensPerSec] = useState<number>(0);
  const [statusText, setStatusText] = useState('Initialising...');

  // Refs so callbacks always see latest values without re-registering effects
  const isCancelledRef = useRef(false);
  const isProcessingRef = useRef(false);
  const tokenCountRef = useRef(0);
  const startTimeRef = useRef(0);

  // ── Android back button handling ────────────────────────────────────────
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isProcessingRef.current) {
          isCancelledRef.current = true;
          modelStore.context?.stopCompletion();
          navigation.goBack();
          return true; // consume the event
        }
        return false;
      },
    );
    return () => subscription.remove();
  }, [navigation]);

  // ── Main extraction flow ─────────────────────────────────────────────────
  const runExtraction = useCallback(async () => {
    // 1. Check that a model is loaded
    if (!modelStore.context) {
      Alert.alert(
        'No Model Loaded',
        'Please load a vision model from the Models page first.',
        [{text: 'OK', onPress: () => navigation.goBack()}],
        {cancelable: false},
      );
      return;
    }

    // 2. Check that it is a vision / multimodal model
    setStatusText('Checking model capabilities...');
    const isMultimodal = await modelStore.isMultimodalEnabled();
    if (!isMultimodal) {
      Alert.alert(
        'Vision Model Required',
        'The loaded model does not support image input.\nPlease load a vision model (e.g. LLaVA) from the Models page first.',
        [{text: 'OK', onPress: () => navigation.goBack()}],
        {cancelable: false},
      );
      return;
    }

    // 3. Verify the captured image file exists
    setStatusText('Preparing image...');
    try {
      // RNFS expects a bare path without the file:// scheme on Android
      const barePath = imageUri.startsWith('file://')
        ? imageUri.slice(7)
        : imageUri;
      const exists = await RNFS.exists(barePath);
      if (!exists) {
        Alert.alert(
          'Image Not Found',
          'The captured photo could not be read. Please retake the photo.',
          [{text: 'OK', onPress: () => navigation.goBack()}],
          {cancelable: false},
        );
        return;
      }
    } catch {
      // Non-fatal – proceed and let llama.rn handle any path issues
    }

    // 4. Run the vision completion
    isProcessingRef.current = true;
    tokenCountRef.current = 0;
    startTimeRef.current = Date.now();
    setStatusText('Processing...');

    const prompt = buildExtractionPrompt();

    // Pass the file:// URI directly – llama.rn reads it natively on Android.
    // On iOS the file:// prefix is stripped by the existing startImageCompletion
    // helper; here we call context.completion() directly for OCR-specific params.
    try {
      const result = await modelStore.context!.completion(
        {
          messages: [
            {
              role: 'user',
              content: [
                {type: 'text', text: prompt},
                {type: 'image_url', image_url: {url: imageUri}},
              ],
            },
          ],
          temperature: 0.7,
          n_predict: 4096,
        },
        data => {
          if (data.token) {
            tokenCountRef.current += 1;
            const elapsedSec =
              (Date.now() - startTimeRef.current) / 1000;
            if (elapsedSec > 0) {
              setTokensPerSec(
                Math.round(tokenCountRef.current / elapsedSec),
              );
            }
          }
        },
      );

      isProcessingRef.current = false;

      if (isCancelledRef.current) {
        return;
      }

      const extractedData = parseExtractionResult(result.text);
      navigation.replace('MedicalOCRResults', {extractedData});
    } catch (error) {
      isProcessingRef.current = false;

      if (isCancelledRef.current) {
        // User cancelled via back button – already navigated back
        return;
      }

      const message =
        error instanceof Error ? error.message : 'Unknown error occurred.';
      Alert.alert('Extraction Failed', message, [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    }
  }, [imageUri, navigation]);

  useEffect(() => {
    runExtraction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const s = styles(theme);

  return (
    <View style={s.container}>
      <CircularActivityIndicator color={theme.colors.primary} size={56} />

      <Text variant="titleMedium" style={s.statusText}>
        {statusText}
      </Text>

      {tokensPerSec > 0 && (
        <Text variant="bodySmall" style={s.statsText}>
          {tokensPerSec} tokens/s
        </Text>
      )}

      <Text variant="bodySmall" style={s.hintText}>
        Press back to cancel
      </Text>
    </View>
  );
};

const styles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 32,
    },
    statusText: {
      color: theme.colors.onBackground,
      textAlign: 'center',
    },
    statsText: {
      color: theme.colors.primary,
    },
    hintText: {
      color: theme.colors.onBackground,
      opacity: 0.4,
      marginTop: 8,
    },
  });
