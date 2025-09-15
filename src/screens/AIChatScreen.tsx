import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { ChatMessage } from '../types';
import { chatBot, chatBotWithContext } from '../api_chat/API';
import * as UserDataContext from '../context/UserDataContext';
const AIChatScreen: React.FC = () => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [inputText, setInputText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [userContext, setUserContext] = React.useState<any>(null);
  const [dailyNutrition, setDailyNutrition] = React.useState<any>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true);
  const scrollViewRef = React.useRef<ScrollView>(null);

  // Load user context and daily nutrition data when component mounts
  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('🤖 Loading user context for AI chat...');
        
        // Load CKD data
        const ckdData = await UserDataContext.getCkdDataAsync();
        setUserContext({
          ckdStage: ckdData.ckdStage,
          fluidLimit: ckdData.fluidLimit,
          dietaryPreferences: ckdData.dietaryPreferences,
          egfrValue: ckdData.egfrValue,
          doctorNotes: ckdData.doctorNotes,
        });

        // Load today's nutrition data
        const todaysData = await UserDataContext.getNutritionDataAsync();
        setDailyNutrition({
          calories: todaysData.calories || 0,
          protein: todaysData.protein || 0,
          sodium: todaysData.sodium || 0,
          potassium: todaysData.potassium || 0,
          phosphorus: todaysData.phosphorus || 0,
          fiber: todaysData.fiber || 0,
        });

        console.log('✅ User context loaded for AI chat');
      } catch (error) {
        console.error('❌ Failed to load user context:', error);
      }
    };

    loadUserData();

    // Add listener for nutrition data changes (when meals are logged/deleted)
    const removeListener = UserDataContext.addDataChangeListener(async () => {
      try {
        console.log('🔄 Updating nutrition data for AI context...');
        const updatedNutritionData = await UserDataContext.getNutritionDataAsync();
        setDailyNutrition({
          calories: updatedNutritionData.calories || 0,
          protein: updatedNutritionData.protein || 0,
          sodium: updatedNutritionData.sodium || 0,
          potassium: updatedNutritionData.potassium || 0,
          phosphorus: updatedNutritionData.phosphorus || 0,
          fiber: updatedNutritionData.fiber || 0,
        });
      } catch (error) {
        console.error('❌ Failed to update nutrition data:', error);
      }
    });

    return () => {
      removeListener();
    };
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setShouldAutoScroll(true); // Auto-scroll when user sends a message

    try {
      let response: string;
      
      // Use context-aware chatbot if user data is available, otherwise fallback to basic chatbot
      if (userContext && dailyNutrition) {
        console.log('🤖 Sending message with user context to AI...');
        console.log('👤 User Context:', {
          ckdStage: userContext.ckdStage,
          fluidLimit: userContext.fluidLimit,
          dietaryPreferences: userContext.dietaryPreferences,
          egfrValue: userContext.egfrValue,
        });
        console.log('🍽️ Daily Nutrition:', dailyNutrition);
        console.log("Sodium value:", dailyNutrition.sodium);
        console.log("Keys:", Object.keys(dailyNutrition));
        response = await chatBotWithContext(inputText, userContext, dailyNutrition);
      } else {
        console.log('🤖 Sending message to basic AI (no context available)...');
        response = await chatBot(inputText);
      }
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setShouldAutoScroll(true); // Auto-scroll when AI responds
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setShouldAutoScroll(true); // Auto-scroll when error message is shown
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: any) => {
    try {
      let date: Date;
      
      if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
        // Firestore Timestamp object
        date = (timestamp as any).toDate();
      } else if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
        // Firestore Timestamp-like object
        date = new Date((timestamp as any).seconds * 1000);
      } else {
        date = new Date(); // Fallback to current time
      }
      
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Error formatting chat timestamp:', error);
      return 'Unknown time';
    }
  };

  React.useEffect(() => {
    // Only auto scroll to bottom when shouldAutoScroll is true
    if (shouldAutoScroll) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      // Reset the flag after scrolling
      setShouldAutoScroll(false);
    }
  }, [messages, shouldAutoScroll]);

  const quickQuestions = [
    "What should I eat today?",
    "Can I eat bananas?",
    "How much water should I drink?",
    "What foods are low in potassium?",
    "Help me plan my meals",
    "What's my protein limit?",
  ];

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 20}
      >
        <View style={styles.content}>
          {/* Header */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.header}>
              <View style={styles.aiInfo}>
                <View style={styles.aiAvatar}>
                  <Ionicons name="medical" size={24} color="white" />
                </View>
                <View>
                  <Text style={styles.aiName}>CKD Nutrition Assistant</Text>
                  <View style={styles.statusContainer}>
                    <Text style={styles.aiStatus}>Online • Ready to help</Text>
                    {userContext && dailyNutrition && (
                      <View style={styles.contextIndicator}>
                        <Ionicons name="checkmark-circle" size={12} color="#10b981" />
                        <Text style={styles.contextText}>Personalized</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>

          {/* Messages */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={() => setShouldAutoScroll(false)} // Disable auto-scroll when user manually scrolls
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            removeClippedSubviews={false}
          >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userMessageBubble : styles.aiMessageBubble,
                ]}
              >
                {message.isUser ? (
                  <Text
                    style={[
                      styles.messageText,
                      styles.userMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                ) : (
                  <Markdown
                    style={markdownStyles}
                  >
                    {message.text}
                  </Markdown>
                )}
                <Text
                  style={[
                    styles.messageTime,
                    message.isUser ? styles.userMessageTime : styles.aiMessageTime,
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </View>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <View style={styles.aiMessageContainer}>
              <View style={styles.aiMessageBubble}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Questions */}
        {messages.length <= 2 && (
          <View style={styles.quickQuestionsContainer}>
            <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.quickQuestions}>
                {quickQuestions.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickQuestionButton}
                    onPress={() => handleQuickQuestion(question)}
                  >
                    <Text style={styles.quickQuestionText}>{question}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about your CKD nutrition..."
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={(!inputText.trim() || isLoading) ? '#9ca3af' : 'white'} 
            />
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ This AI assistant provides general information only. Always consult your healthcare provider for medical advice.
          </Text>
        </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  aiInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  aiStatus: {
    fontSize: 12,
    color: '#22c55e',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userMessageBubble: {
    backgroundColor: '#0ea5e9',
  },
  aiMessageBubble: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: '#1f2937',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiMessageTime: {
    color: '#6b7280',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6b7280',
    marginHorizontal: 2,
    // TODO: Add animation
  },
  quickQuestionsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  quickQuestions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickQuestionButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  quickQuestionText: {
    fontSize: 14,
    color: '#374151',
  },
  inputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  disclaimer: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f59e0b',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#92400e',
    textAlign: 'center',
    lineHeight: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contextIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  contextText: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '500',
  },
});

// Markdown styles for AI messages
const markdownStyles = {
  body: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 22,
  },
  heading1: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#1f2937',
    marginVertical: 8,
  },
  heading2: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#1f2937',
    marginVertical: 6,
  },
  heading3: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#1f2937',
    marginVertical: 4,
  },
  paragraph: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 22,
    marginVertical: 4,
  },
  strong: {
    fontWeight: 'bold' as const,
    color: '#1f2937',
  },
  em: {
    fontStyle: 'italic' as const,
    color: '#1f2937',
  },
  list_item: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 22,
    marginVertical: 2,
  },
  bullet_list: {
    marginVertical: 4,
  },
  ordered_list: {
    marginVertical: 4,
  },
  code_inline: {
    backgroundColor: '#f3f4f6',
    padding: 2,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#374151',
  },
  fence: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#374151',
  },
  blockquote: {
    backgroundColor: '#f9fafb',
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
    paddingLeft: 12,
    paddingVertical: 8,
    marginVertical: 8,
  },
  link: {
    color: '#0ea5e9',
    textDecorationLine: 'underline' as const,
  },
  hr: {
    backgroundColor: '#e5e7eb',
    height: 1,
    marginVertical: 16,
  },
};

export default AIChatScreen;
