import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Divider, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp} from '@react-navigation/native';

import {useTheme} from '../../hooks';
import {FIELDS_BY_TYPE, MedicalField} from '../../utils/medical/fields';
import {MedicalOCRStackParamList} from './MedicalOCRNavigator';

type ResultsScreenRouteProp = RouteProp<
  MedicalOCRStackParamList,
  'MedicalOCRResults'
>;

interface Props {
  route: ResultsScreenRouteProp;
}

// Section label per field type
const SECTION_LABELS: Record<string, string> = {
  numerical: 'Numerical Values',
  measurement: 'Measurements',
  labelled_text: 'Medical History & Examination',
  unlabelled_text: 'Treatment & Followup Notes',
};

interface FieldRowProps {
  field: MedicalField;
  value: string | number | null | undefined;
  theme: ReturnType<typeof useTheme>;
}

const FieldRow: React.FC<FieldRowProps> = ({field, value, theme}) => {
  const s = rowStyles(theme);
  const hasValue = value !== null && value !== undefined && value !== '';

  return (
    <View style={s.row}>
      <Text variant="labelSmall" style={s.fieldName}>
        {field.name}
      </Text>
      <Text
        variant="bodyMedium"
        style={[s.fieldValue, !hasValue && s.fieldValueNull]}>
        {hasValue ? String(value) : '—'}
      </Text>
    </View>
  );
};

const rowStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    row: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      gap: 2,
    },
    fieldName: {
      color: theme.colors.onSurfaceVariant ?? theme.colors.onBackground,
      opacity: 0.7,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    fieldValue: {
      color: theme.colors.onBackground,
    },
    fieldValueNull: {
      opacity: 0.35,
    },
  });

export const ResultsScreen: React.FC<Props> = ({route}) => {
  const theme = useTheme();
  const {extractedData} = route.params;

  // Count how many fields were actually found
  const foundCount = useMemo(
    () =>
      Object.values(extractedData).filter(
        v => v !== null && v !== undefined && v !== '',
      ).length,
    [extractedData],
  );

  const s = styles(theme);

  return (
    <SafeAreaView style={s.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.scrollContent}>
        {/* Summary banner */}
        <View style={s.summaryBanner}>
          <Text variant="titleMedium" style={s.summaryTitle}>
            Extraction Complete
          </Text>
          <Text variant="bodySmall" style={s.summarySubtitle}>
            {foundCount} of {Object.keys(extractedData).length} fields
            extracted
          </Text>
        </View>

        {/* Sections */}
        {(
          ['numerical', 'measurement', 'labelled_text', 'unlabelled_text'] as const
        ).map(type => {
          const fields = FIELDS_BY_TYPE[type];
          const sectionHasData = fields.some(f => {
            const v = extractedData[f.name];
            return v !== null && v !== undefined && v !== '';
          });

          return (
            <View key={type} style={s.section}>
              <View style={s.sectionHeader}>
                <Text variant="titleSmall" style={s.sectionTitle}>
                  {SECTION_LABELS[type]}
                </Text>
                {!sectionHasData && (
                  <Text variant="bodySmall" style={s.sectionEmpty}>
                    Not found
                  </Text>
                )}
              </View>
              <Divider />
              {fields.map((field, idx) => (
                <React.Fragment key={field.name}>
                  <FieldRow
                    field={field}
                    value={extractedData[field.name]}
                    theme={theme}
                  />
                  {idx < fields.length - 1 && (
                    <Divider style={s.rowDivider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    summaryBanner: {
      paddingVertical: 20,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.primaryContainer ?? theme.colors.primary,
      gap: 4,
    },
    summaryTitle: {
      color:
        theme.colors.onPrimaryContainer ?? theme.colors.onPrimary ?? '#fff',
      fontWeight: '700',
    },
    summarySubtitle: {
      color:
        theme.colors.onPrimaryContainer ?? theme.colors.onPrimary ?? '#fff',
      opacity: 0.8,
    },
    section: {
      marginTop: 16,
      backgroundColor: theme.colors.surface ?? theme.colors.background,
      borderRadius: 8,
      marginHorizontal: 12,
      overflow: 'hidden',
      elevation: 1,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    sectionTitle: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    sectionEmpty: {
      color: theme.colors.onBackground,
      opacity: 0.4,
    },
    rowDivider: {
      marginLeft: 16,
    },
  });
