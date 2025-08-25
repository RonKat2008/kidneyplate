import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
// TODO: Install and configure a chart library like react-native-chart-kit or victory-native
// For now, using a simple visual representation
import { LabValueForm } from '../components/LabValueForm';
import { LabValue } from '../types';
import { labAPI, mockLabValues } from '../utils/mockData';

const { width } = Dimensions.get('window');

const LabTrackerScreen: React.FC = () => {
  const [labValues, setLabValues] = React.useState<LabValue[]>(mockLabValues);
  const [selectedLabType, setSelectedLabType] = React.useState<LabValue['type']>('eGFR');

  const handleAddLabValue = async (newLabValue: Omit<LabValue, 'id'>) => {
    try {
      // TODO: Replace with actual API call
      const result = await labAPI.saveLabValue(newLabValue);
      
      if (result.success) {
        const labValueWithId: LabValue = {
          ...newLabValue,
          id: result.id,
        };
        
        setLabValues(prev => [labValueWithId, ...prev]);
        Alert.alert('Success', 'Lab value added successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save lab value. Please try again.');
    }
  };

  const getLabDataForChart = (type: LabValue['type']) => {
    return labValues
      .filter(lab => lab.type === type)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((lab, index) => ({
        x: index + 1,
        y: lab.value,
        date: lab.date,
      }));
  };

  const getCurrentLabValue = (type: LabValue['type']) => {
    const latestLab = labValues
      .filter(lab => lab.type === type)
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
    
    return latestLab || null;
  };

  const getStatusColor = (value: number, normalRange: { min: number; max: number }) => {
    if (value < normalRange.min || value > normalRange.max) {
      return '#ef4444'; // Red for abnormal
    }
    return '#22c55e'; // Green for normal
  };

  const labTypes = [
    { type: 'eGFR' as const, name: 'eGFR', unit: 'mL/min/1.73m²' },
    { type: 'creatinine' as const, name: 'Creatinine', unit: 'mg/dL' },
    { type: 'potassium' as const, name: 'Potassium', unit: 'mEq/L' },
    { type: 'BUN' as const, name: 'BUN', unit: 'mg/dL' },
    { type: 'albumin' as const, name: 'Albumin', unit: 'g/dL' },
    { type: 'phosphorus' as const, name: 'Phosphorus', unit: 'mg/dL' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Lab Value Form */}
        <LabValueForm onSubmit={handleAddLabValue} />

        {/* Lab Values Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Lab Values</Text>
          <View style={styles.labGrid}>
            {labTypes.map((labType) => {
              const currentValue = getCurrentLabValue(labType.type);
              return (
                <View key={labType.type} style={styles.labCard}>
                  <Text style={styles.labName}>{labType.name}</Text>
                  {currentValue ? (
                    <>
                      <Text
                        style={[
                          styles.labValue,
                          { color: getStatusColor(currentValue.value, currentValue.normalRange) },
                        ]}
                      >
                        {currentValue.value} {labType.unit}
                      </Text>
                      <Text style={styles.labDate}>
                        {currentValue.date.toLocaleDateString()}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.noData}>No data</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Lab Value Trends Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lab Value Trends</Text>
          
          {/* Chart Type Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartSelector}>
            {labTypes.map((labType) => {
              const hasData = getLabDataForChart(labType.type).length > 0;
              return (
                <Text
                  key={labType.type}
                  style={[
                    styles.chartTypeButton,
                    selectedLabType === labType.type && styles.chartTypeButtonSelected,
                    !hasData && styles.chartTypeButtonDisabled,
                  ]}
                  onPress={() => hasData && setSelectedLabType(labType.type)}
                >
                  {labType.name}
                </Text>
              );
            })}
          </ScrollView>

          {/* Simple Chart Visualization */}
          <View style={styles.chartContainer}>
            {getLabDataForChart(selectedLabType).length > 0 ? (
              <View style={styles.simpleChart}>
                <Text style={styles.chartTitle}>
                  {labTypes.find(lt => lt.type === selectedLabType)?.name} Trend
                </Text>
                <View style={styles.chartBars}>
                  {getLabDataForChart(selectedLabType).map((dataPoint, index) => {
                    const maxValue = Math.max(...getLabDataForChart(selectedLabType).map(d => d.y));
                    const height = (dataPoint.y / maxValue) * 120;
                    return (
                      <View key={index} style={styles.chartBarContainer}>
                        <View style={[styles.chartBar, { height }]} />
                        <Text style={styles.chartBarValue}>{dataPoint.y}</Text>
                        <Text style={styles.chartBarDate}>
                          {dataPoint.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Text>
                      </View>
                    );
                  })}
                </View>
                <Text style={styles.chartNote}>
                  * This is a simplified chart view. TODO: Integrate a proper chart library.
                </Text>
              </View>
            ) : (
              <View style={styles.noChartData}>
                <Text style={styles.noChartDataText}>
                  No data available for {labTypes.find(lt => lt.type === selectedLabType)?.name}
                </Text>
                <Text style={styles.noChartDataSubtext}>
                  Add lab values to see trends over time
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Lab Value History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Lab Values</Text>
          {labValues.length > 0 ? (
            labValues
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 10)
              .map((lab) => (
                <View key={lab.id} style={styles.historyItem}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyType}>{lab.type}</Text>
                    <Text style={styles.historyDate}>
                      {lab.date.toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.historyContent}>
                    <Text
                      style={[
                        styles.historyValue,
                        { color: getStatusColor(lab.value, lab.normalRange) },
                      ]}
                    >
                      {lab.value} {lab.unit}
                    </Text>
                    <Text style={styles.historyRange}>
                      Normal: {lab.normalRange.min}-{lab.normalRange.max} {lab.unit}
                    </Text>
                  </View>
                </View>
              ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No lab values recorded</Text>
              <Text style={styles.emptyStateSubtext}>
                Add your first lab value using the form above
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  labGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    gap: 8,
  },
  labCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    width: (width - 48) / 2,
    alignItems: 'center',
  },
  labName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  labValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  labDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  noData: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  chartSelector: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  chartTypeButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    textAlign: 'center',
  },
  chartTypeButtonSelected: {
    backgroundColor: '#0ea5e9',
    color: 'white',
  },
  chartTypeButtonDisabled: {
    opacity: 0.5,
  },
  chartContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  simpleChart: {
    padding: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    marginBottom: 16,
  },
  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  chartBar: {
    backgroundColor: '#0ea5e9',
    width: 20,
    borderRadius: 4,
    marginBottom: 4,
    minHeight: 4,
  },
  chartBarValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  chartBarDate: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center',
  },
  chartNote: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  noChartData: {
    alignItems: 'center',
    padding: 40,
  },
  noChartDataText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  noChartDataSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  historyDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  historyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyRange: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default LabTrackerScreen;
