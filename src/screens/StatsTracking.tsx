/*MIT License

Copyright (c) 2018 indiespirit

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
*/

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
  
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';

import * as UserDataContext from '../context/UserDataContext';



const StatsTracking: React.FC = () => {
  const [nutritionHistory, setNutritionHistory] = React.useState<any[]>([]);  
  const [numDays, setNumDays] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [showGraphs, setShowGrpahs] = useState(false);
  const [PotassiumData, setPotassiumData] = React.useState<any[]>([]);  
  const [FatData, setFatData] = React.useState<any[]>([]);  
  const [SugerData, setSugerData] =  React.useState<any[]>([]);  
  const [CalorieData, setCalorieData] = React.useState<any[]>([]);  
  const [FiberData, setFiberData] =  React.useState<any[]>([]);  
  const [SodiumData, setSodiumData] =  React.useState<any[]>([]);  
  const [ProteinData, setProtienData] =  React.useState<any[]>([]);  
  const [PhosphorusData, setPhosphorusData] =  React.useState<any[]>([]);  
  const [labels, setLabels] = useState<string[]>([]);


  useEffect(() => {
    setNutritionHistory(UserDataContext.getHistoryData());
  }, []); 

  const handleGraphs = async () => {
    setIsLoading(true);
    try {
      // Simulate data processing delay
      const days = Math.min(parseInt(numDays || '0', 10) || 0, nutritionHistory?.length || 0);
      const labels: number[] = Array.from({ length: days }, (_, i) => i + 1).reverse();
      setLabels(labels.map(String));
      const PotassiumValues = nutritionHistory?.slice(-days).map((entry) => entry.potassium).reverse();
      
      setPotassiumData(PotassiumValues);
      const FatValues = nutritionHistory?.slice(-days).map((entry) => entry.fat).reverse();
      setFatData(FatValues);
      const SugerValues = nutritionHistory?.slice(-days).map((entry) => entry.suger).reverse();
      
      setSugerData(SugerValues);
      const CalorieValues = nutritionHistory?.slice(-days).map((entry) => entry.calories).reverse();
      
      setCalorieData(CalorieValues);
      const FiberValues = nutritionHistory?.slice(-days).map((entry) => entry.fiber).reverse();
      
      setFiberData(FiberValues);
      const ProteinValues = nutritionHistory?.slice(-days).map((entry) => entry.protein).reverse();
      
      setProtienData(ProteinValues);
      const SodiumValues = nutritionHistory?.slice(-days).map((entry) => entry.sodium).reverse();
      
      setSodiumData(SodiumValues);
      const PhosphurusValues = nutritionHistory?.slice(-days).map((entry) => entry.phosphorus).reverse();
      
      setPhosphorusData(PhosphurusValues);
      setShowGrpahs(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate graphs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }
  
  

  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stats Tracking</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Number of Days</Text>
          <TextInput
            style={styles.input}
            value={numDays}
            onChangeText={setNumDays}
            placeholder="Enter the number of days to see your history"
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleGraphs}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.buttonText}>Generate Graphs</Text>
            )}
          </TouchableOpacity>
        </View>

        {showGraphs && (
          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Potassium Tracking</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: labels,
                  datasets: [
                    {
                      data: [...PotassiumData]
                    }
                  ]
                }}
                width={350}
                height={220}
                yAxisLabel=""
                yAxisSuffix="mg"
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: "#0ea5e9",
                  backgroundGradientFrom: "#0ea5e9",
                  backgroundGradientTo: "#0284c7",
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffffff"
                  }
                }}
                bezier
                style={styles.chart}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  inputSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  chartSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  introSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4b5563',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    fontWeight: '500',
  },
  footerInfo: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  footerIcon: {
    marginTop: 2,
  },
  footerText: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default StatsTracking;
