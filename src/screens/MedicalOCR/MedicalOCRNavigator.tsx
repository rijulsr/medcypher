import React from 'react';
import {IconButton} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation, ParamListBase} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';

import {useTheme} from '../../hooks';
import {CameraScreen} from './CameraScreen';
import {ProcessingScreen} from './ProcessingScreen';
import {ResultsScreen} from './ResultsScreen';

export type MedicalExtractionResult = Record<string, string | number | null>;

export type MedicalOCRStackParamList = {
  MedicalOCRCamera: undefined;
  MedicalOCRProcessing: {imageUri: string};
  MedicalOCRResults: {extractedData: MedicalExtractionResult};
};

const Stack = createStackNavigator<MedicalOCRStackParamList>();

type DrawerNav = DrawerNavigationProp<ParamListBase>;

export const MedicalOCRNavigator: React.FC = () => {
  const theme = useTheme();
  const drawerNav = useNavigation<DrawerNav>();

  const sharedScreenOptions = {
    headerStyle: {backgroundColor: theme.colors.background},
    headerTintColor: theme.colors.onBackground,
  };

  return (
    <Stack.Navigator screenOptions={sharedScreenOptions}>
      <Stack.Screen
        name="MedicalOCRCamera"
        component={CameraScreen}
        options={{
          title: 'Medical OCR',
          headerLeft: () => (
            <IconButton
              icon="menu"
              iconColor={theme.colors.onBackground}
              onPress={() => drawerNav.openDrawer()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="MedicalOCRProcessing"
        component={ProcessingScreen}
        options={{
          title: 'Analysing Document',
          // Prevent swiping back mid-extraction; user must use back button
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="MedicalOCRResults"
        component={ResultsScreen}
        options={{title: 'Extraction Results'}}
      />
    </Stack.Navigator>
  );
};
