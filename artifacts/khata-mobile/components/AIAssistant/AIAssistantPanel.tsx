
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { ChatMessage } from './types';
import { QUICK_QUESTIONS, detectIntent, getStructuredReply, getAiExplanation } from './aiAssistantData';
import { useAssistantData } from '@/hooks/useAssistantData';
import { useBusiness } from '@/contexts/BusinessContext';
import { formatCurrency } from '@/lib/format';

const FONT_FAMILY = Platform.select({ web: '"Times New Roman", Times, serif', default: 'serif' });

interface Props {
  onClose: () => void;
  topOffset?: number;
}

let idCounter = 0;
const nextId = () => `msg_${Date.now()}_${idCounter++}`;

function RobotAvatar({ size = 30, tint = '#fff' }: { size?: number; tint?: string }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: tint === '#fff' ? 'rgba(255,255,255,0.2)' : tint + '18',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Feather name="cpu" size={Math.round(size * 0.55)} color={tint} />
    </View>
  );
}

function UserAvatar({ size = 26, colors }: { size?: number; colors: any }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Feather name="user" size={Math.round(size * 0.55)} color={colors.primaryForeground} />
    </View>
  );
}

export function AIAssistantPanel({ onClose, topOffset = 60 }: Props) {
  const colors = useColors();
  const router = useRouter();
  const { business } = useBusiness();
  const assistantData = useAssistantData();
  const fmt = (n: number) => formatCurrency(n, business?.currency);
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 900;
  const isTablet = Platform.OS === 'web' && width >= 600 && width < 900;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: Platform.OS !== 'web' }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(anim, { toValue: 0, duration: 150, useNativeDriver: Platform.OS !== 'web' }).start(() => onClose());
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = { id: nextId(), role: 'user', text: trimmed, createdAt: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      await new Promise((r) => setTimeout(r, 250));
      const intent = detectIntent(trimmed);
      const reply = intent
        ? getStructuredReply(intent, assistantData, fmt)
        : await getAiExplanation(trimmed, business?.id);
      const aiMsg: ChatMessage = {
        id: nextId(),
        role: 'assistant',
        text: reply.text,
        createdAt: Date.now(),
        actions: reply.actions,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          text: "Sorry, I couldn't retrieve that information right now. Please try again.",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  };

  const clearChat = () => setMessages([]);

   const panelStyle = isDesktop
    ? [styles.panelDesktop, { top: topOffset, maxHeight: `calc(100vh - ${topOffset + 16}px)` as any }]
    : isTablet
    ? [styles.panelTablet, { top: topOffset, maxHeight: `calc(100vh - ${topOffset + 16}px)` as any }]
    : [styles.panelMobile];

  return (
    <Animated.View
      style={[
        panelStyle,
        {
          opacity: anim,
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
            { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.panel,
          { flex: 1, minHeight: 0, backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
        ]}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <RobotAvatar size={34} tint="#fff" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.headerTitle, { color: colors.primaryForeground, fontFamily: FONT_FAMILY }]}>
              Khata AI Assistant
            </Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={[styles.statusText, { color: colors.primaryForeground, fontFamily: FONT_FAMILY }]}>
                Online
              </Text>
            </View>
          </View>
          {messages.length > 0 && (
            <Pressable onPress={clearChat} hitSlop={8} style={styles.headerBtn}>
              <Feather name="trash-2" size={18} color={colors.primaryForeground} />
            </Pressable>
          )}
          <Pressable onPress={handleClose} hitSlop={8} style={styles.headerBtn}>
            <Feather name="x" size={20} color={colors.primaryForeground} />
          </Pressable>
        </View>

        {/* Body */}
        <View style={{ flex: 1, minHeight: 0 }}>
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.bubbleRow, { justifyContent: 'flex-start' }]}>
              <RobotAvatar size={26} tint={colors.primary} />
              <View
                style={[
                  styles.bubble,
                  styles.welcomeBubble,
                  { backgroundColor: colors.secondary, borderRadius: colors.radius, marginLeft: 8 },
                ]}
              >
                <Text style={[styles.bubbleText, { color: colors.secondaryForeground, fontFamily: FONT_FAMILY }]}>
                  Hi! 👋 I'm your Khata AI Assistant.{'\n'}I'm here to help you with your business.
                </Text>
              </View>
            </View>

            <Text style={[styles.quickLabel, { color: colors.primary, fontFamily: FONT_FAMILY }]}>
              Quick Questions
            </Text>
            <View style={styles.quickGrid}>
              {QUICK_QUESTIONS.map((q) => (
                <Pressable
                  key={q.id}
                  onPress={() => send(q.prompt)}
                  style={({ pressed }) => [
                    styles.quickChip,
                    {
                      backgroundColor: colors.primary + '12',
                      borderColor: colors.primary + '30',
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.quickChipText, { color: colors.primary, fontFamily: FONT_FAMILY }]}>
                    {q.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
  ref={listRef}
  data={messages}
  keyExtractor={(m) => m.id}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={styles.messageList}
            renderItem={({ item }) => {
              const isUser = item.role === 'user';
              return (
                <View style={[styles.bubbleRow, { justifyContent: isUser ? 'flex-end' : 'flex-start' }]}>
                  {!isUser && <RobotAvatar size={26} tint={colors.primary} />}
                  <View
                    style={[
                      styles.bubble,
                      {
                        backgroundColor: isUser ? colors.primary : colors.secondary,
                        borderRadius: colors.radius,
                        marginLeft: isUser ? 0 : 8,
                        marginRight: isUser ? 8 : 0,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        {
                          color: isUser ? colors.primaryForeground : colors.secondaryForeground,
                          fontFamily: FONT_FAMILY,
                        },
                      ]}
                    >
                      {item.text}
                    </Text>
                    <Text
                      style={[
                        styles.bubbleTimestamp,
                        {
                          color: isUser ? colors.primaryForeground : colors.mutedForeground,
                          fontFamily: FONT_FAMILY,
                        },
                      ]}
                    >
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    {!!item.actions?.length && (
                      <View style={styles.actionsRow}>
                        {item.actions.map((a) => (
                          <Pressable
                            key={a.route}
                            onPress={() => router.push(a.route as any)}
                            style={[styles.actionBtn, { borderColor: colors.border }]}
                          >
                            <Text style={[styles.actionBtnText, { color: colors.tint, fontFamily: FONT_FAMILY }]}>
                              {a.label}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </View>
                  {isUser && <UserAvatar size={26} colors={colors} />}
                </View>
              );
            }}
            ListFooterComponent={
              isTyping ? (
                <View style={[styles.bubbleRow, { justifyContent: 'flex-start' }]}>
                  <RobotAvatar size={26} tint={colors.primary} />
                  <View
                    style={[
                      styles.bubble,
                      { backgroundColor: colors.secondary, borderRadius: colors.radius, marginLeft: 8 },
                    ]}
                  >
                    <ActivityIndicator size="small" color={colors.mutedForeground} />
                  </View>
                </View>
              ) : null
            }
          />
        )}
        </View>
        {/* Input */}
        <View style={[styles.inputRow, { borderTopColor: colors.border }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send(input)}
            placeholder="Ask me anything about your business..."
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.input,
              {
                color: colors.foreground,
                backgroundColor: colors.background,
                borderColor: colors.border,
                fontFamily: FONT_FAMILY,
              },
            ]}
            returnKeyType="send"
          />
          <Pressable
            onPress={() => send(input)}
            disabled={!input.trim() || isTyping}
            style={[
              styles.sendBtn,
              { backgroundColor: colors.primary, opacity: !input.trim() || isTyping ? 0.5 : 1 },
            ]}
          >
            <Feather name="send" size={16} color={colors.primaryForeground} />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    overflow: 'hidden',
    // @ts-ignore
    boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
  },
  panelDesktop: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    right: 16,
    width: 380,
    // maxHeight: 'calc(100vh - 32px)' as any,
    // @ts-ignore
    zIndex: 999,
  },
  panelTablet: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    right: 16,
    width: 340,
    // maxHeight: 'calc(100vh - 32px)' as any,
    // @ts-ignore
    zIndex: 999,
  },
  panelMobile: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // @ts-ignore
    zIndex: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 14.5, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  statusDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#22C55E' },
  statusText: { fontSize: 11.5, fontWeight: '500' },
  headerBtn: { padding: 6, marginLeft: 4 },
  emptyState: { flex: 1, padding: 16, paddingTop: 18 },
  quickLabel: { fontSize: 11.5, fontWeight: '700', marginTop: 18, marginBottom: 8, marginLeft: 4 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickChip: { paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderRadius: 20 },
  quickChipText: { fontSize: 12.5, fontWeight: '600' },
  messageList: { padding: 12, gap: 12 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end' },
  bubble: { maxWidth: '75%', paddingHorizontal: 12, paddingVertical: 9 },
  bubbleTimestamp: { fontSize: 10, marginTop: 3 },
  welcomeBubble: { maxWidth: '85%' },
  bubbleText: { fontSize: 13.5, lineHeight: 19 },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderRadius: 6 },
  actionBtnText: { fontSize: 12, fontWeight: '600' },
  inputRow: { flexDirection: 'row', gap: 8, padding: 10, borderTopWidth: 1, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, fontSize: 13.5 },
  sendBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
});