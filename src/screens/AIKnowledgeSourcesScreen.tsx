import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface PDFSource {
  id: string;
  title: string;
  organization: string;
  category: 'Phosphorus' | 'Potassium' | 'General CKD' | 'Nutrition';
  url: string;
  description: string;
}

const AIKnowledgeSourcesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null);

  const pdfSources: PDFSource[] = [
    // Phosphorus Sources
    {
      id: '1',
      title: 'Phosphorus Guide',
      organization: 'American Kidney Fund',
      category: 'Phosphorus',
      url: 'https://kitchen.kidneyfund.org/wp-content/uploads/2021/08/Phosphorus-Guide.pdf',
      description: 'Comprehensive guide to managing phosphorus in your CKD diet'
    },
    {
      id: '2',
      title: 'Phosphorus Information',
      organization: 'USDA National Agricultural Library',
      category: 'Phosphorus',
      url: 'https://www.nal.usda.gov/sites/default/files/page-files/phosphorus.pdf',
      description: 'Official USDA guidelines on phosphorus content in foods'
    },
    {
      id: '3',
      title: 'Phosphorus Guide',
      organization: 'Rogosin Institute',
      category: 'Phosphorus',
      url: 'https://wellness.rogosininstitute.org/resources/Phosphorus-Guide.pdf',
      description: 'Clinical phosphorus management recommendations'
    },
    {
      id: '4',
      title: 'Phosphorus Guide (Updated)',
      organization: 'American Kidney Fund',
      category: 'Phosphorus',
      url: 'https://kitchen.kidneyfund.org/wp-content/uploads/2021/04/Phosphorus_Guide_090419.pdf',
      description: 'Updated phosphorus dietary guidelines for kidney patients'
    },
    {
      id: '5',
      title: 'Limiting Phosphorus',
      organization: 'National Kidney Foundation',
      category: 'Phosphorus',
      url: 'https://www.kidney.org/sites/default/files/if_you_need_to_limit_phosphorus.pdf',
      description: 'Practical tips for limiting phosphorus intake'
    },
    
    // Potassium Sources
    {
      id: '6',
      title: 'Potassium Guide',
      organization: 'WVU Medicine',
      category: 'Potassium',
      url: 'https://wvumedicine.org/transplant-alliance/wp-content/uploads/sites/80/2024/10/Potassium.pdf',
      description: 'Comprehensive potassium management for transplant patients'
    },
    {
      id: '7',
      title: 'Beyond Bananas: Potassium Guide',
      organization: 'American Kidney Fund',
      category: 'Potassium',
      url: 'https://kitchen.kidneyfund.org/wp-content/uploads/2019/08/Beyond-Bananas-Potassium-Guide.pdf',
      description: 'Complete guide to potassium in foods beyond common sources'
    },
    {
      id: '8',
      title: 'Potassium Restricted Diet',
      organization: 'Northwestern Medicine',
      category: 'Potassium',
      url: 'https://www.nm.org/-/media/northwestern/resources/patients-and-visitors/patient-education/diet-and-nutrition/northwestern-medicine-potassium-restricted-diet.pdf',
      description: 'Medical guidelines for potassium-restricted diets'
    },
    {
      id: '9',
      title: 'Potassium Content of Fruits',
      organization: 'Western Health',
      category: 'Potassium',
      url: 'https://westernhealth.nl.ca/uploads/healthyeating/potassium_content_of_selected_fruits.pdf',
      description: 'Detailed potassium content table for various fruits'
    },
    {
      id: '10',
      title: 'Potassium in Foods Table',
      organization: 'Kaiser Permanente',
      category: 'Potassium',
      url: 'https://mydoctor.kaiserpermanente.org/ncal/Images/Potassium%20_in_Foods_Table_(2011)_ADA_tcm75-653916.pdf',
      description: 'Comprehensive food potassium content reference table'
    },
    {
      id: '11',
      title: 'High Potassium Food List',
      organization: 'My Cardiologist',
      category: 'Potassium',
      url: 'https://mycardiologist.com/wp-content/uploads/2023/12/HighPotassiumFoodList_sglpgs.pdf',
      description: 'List of foods high in potassium to limit or avoid'
    },
    {
      id: '12',
      title: 'Potassium Information',
      organization: 'USDA National Agricultural Library',
      category: 'Potassium',
      url: 'https://www.nal.usda.gov/sites/default/files/page-files/potassium.pdf',
      description: 'Official USDA potassium content guidelines'
    },
    {
      id: '13',
      title: 'Food Sources of Potassium',
      organization: 'Dietary Guidelines for Americans',
      category: 'Potassium',
      url: 'https://www.dietaryguidelines.gov/sites/default/files/2024-08/Food-Sources-Potassium-Standard-508C.pdf',
      description: 'Government dietary guidelines for potassium sources'
    },
    {
      id: '14',
      title: 'Potassium Food Guide',
      organization: 'Kidney Care UK',
      category: 'Potassium',
      url: 'https://www.kidney.org.uk/Handlers/Download.ashx?IDMF=30ba0c29-8c1c-4b6b-b70c-17a739a3b1af',
      description: 'UK-based potassium dietary recommendations'
    },
    
    // General CKD & Nutrition Sources
    {
      id: '15',
      title: 'Nutrition and CKD (Updated 2022)',
      organization: 'UC Davis Health',
      category: 'General CKD',
      url: 'https://health.ucdavis.edu/media-resources/health-education/documents/pdfs/Nutrition%20and%20CKD_Updated2022.pdf',
      description: 'Comprehensive CKD nutrition guide with latest research'
    },
    {
      id: '16',
      title: 'Nutrition and Chronic Kidney Disease',
      organization: 'National Kidney Foundation',
      category: 'General CKD',
      url: 'https://www.kidney.org/sites/default/files/nutrition_and_ckd.pdf',
      description: 'Complete nutritional guidelines for CKD management'
    },
    {
      id: '17',
      title: 'Kidney-Friendly Food List & Tips',
      organization: 'National Kidney Foundation of Michigan',
      category: 'Nutrition',
      url: 'https://nkfm.org/wp-content/uploads/2024/04/Kidney-Friendly-Food-List-Tips_final.pdf',
      description: 'Practical food choices and cooking tips for kidney health'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Phosphorus': return '#8b5cf6';
      case 'Potassium': return '#f59e0b';
      case 'General CKD': return '#10b981';
      case 'Nutrition': return '#0ea5e9';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Phosphorus': return 'flask-outline';
      case 'Potassium': return 'nutrition-outline';
      case 'General CKD': return 'medical-outline';
      case 'Nutrition': return 'restaurant-outline';
      default: return 'document-outline';
    }
  };

  const handleOpenPDF = async (url: string, title: string) => {
    try {
      setLoadingUrl(url);
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Cannot Open PDF',
          `Unable to open ${title}. Please copy the link and open it in your browser.`,
          [
            { text: 'OK', style: 'default' },
            { 
              text: 'Copy Link', 
              onPress: () => {
                // You could implement clipboard functionality here if needed
                Alert.alert('Link', url);
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        `Failed to open ${title}. Please try again later.`
      );
    } finally {
      setLoadingUrl(null);
    }
  };

  const groupedSources = pdfSources.reduce((acc, source) => {
    if (!acc[source.category]) {
      acc[source.category] = [];
    }
    acc[source.category].push(source);
    return acc;
  }, {} as Record<string, PDFSource[]>);

  const categories = Object.keys(groupedSources).sort();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Knowledge Sources</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <View style={styles.introHeader}>
            <Ionicons name="library-outline" size={32} color="#0ea5e9" />
            <Text style={styles.introTitle}>Research-Based Knowledge</Text>
          </View>
          <Text style={styles.introText}>
            Our AI assistant is trained on these trusted medical and nutritional resources to provide 
            evidence-based guidance for CKD management. All sources are from reputable healthcare 
            organizations and government agencies.
          </Text>
        </View>

        {/* Source Categories */}
        {categories.map((category) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: `${getCategoryColor(category)}20` }]}>
                <Ionicons 
                  name={getCategoryIcon(category) as any} 
                  size={20} 
                  color={getCategoryColor(category)} 
                />
              </View>
              <View style={styles.categoryTitleContainer}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <Text style={styles.categoryCount}>
                  {groupedSources[category].length} source{groupedSources[category].length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            <View style={styles.sourcesContainer}>
              {groupedSources[category].map((source) => (
                <TouchableOpacity
                  key={source.id}
                  style={styles.sourceCard}
                  onPress={() => handleOpenPDF(source.url, source.title)}
                  disabled={loadingUrl === source.url}
                >
                  <View style={styles.sourceHeader}>
                    <View style={styles.sourceInfo}>
                      <Text style={styles.sourceTitle}>{source.title}</Text>
                      <Text style={styles.sourceOrganization}>{source.organization}</Text>
                    </View>
                    <View style={styles.sourceAction}>
                      {loadingUrl === source.url ? (
                        <ActivityIndicator size="small" color="#0ea5e9" />
                      ) : (
                        <Ionicons name="open-outline" size={20} color="#0ea5e9" />
                      )}
                    </View>
                  </View>
                  <Text style={styles.sourceDescription}>{source.description}</Text>
                  
                  <View style={styles.sourceMeta}>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(category) }]}>
                      <Text style={styles.categoryBadgeText}>{category}</Text>
                    </View>
                    <View style={styles.pdfIndicator}>
                      <Ionicons name="document-text" size={14} color="#6b7280" />
                      <Text style={styles.pdfText}>PDF</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  categoryCount: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  sourcesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  sourceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  sourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  sourceInfo: {
    flex: 1,
    marginRight: 12,
  },
  sourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  sourceOrganization: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '500',
  },
  sourceAction: {
    padding: 4,
  },
  sourceDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  sourceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  pdfIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pdfText: {
    fontSize: 12,
    color: '#6b7280',
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

export default AIKnowledgeSourcesScreen;
