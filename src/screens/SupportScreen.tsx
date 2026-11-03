import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  Keyboard,
  StatusBar,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../theme';
import { AnimatedButton } from '../components/AnimatedButton';
import { PillChip } from '../components/PillChip';
import { themeAlert } from '../components/ThemeDialog';
import {
  PhoneIcon,
  MailIcon,
  MessageSquareIcon,
  HeadphonesIcon,
  ClockIcon,
  CheckIcon,
  AlertCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ShieldIcon,
  FileTextIcon,
  HelpCircleIcon,
  SendIcon,
} from '../components/Icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type SupportTab = 'channels' | 'ticket' | 'faq' | 'grievance';

export interface SupportTicket {
  id: string;
  category: string;
  applicationId: string;
  subject: string;
  description: string;
  status: 'In Review' | 'Investigating' | 'Resolved';
  date: string;
  priority: 'Normal' | 'High' | 'Urgent';
  resolutionNotes?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Applications' | 'Disbursements' | 'KYC & Legal';
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-2026-8941',
    category: 'Document Verification',
    applicationId: 'RRA-2026-00124',
    subject: 'Aadhaar OKYC re-verification status',
    description: 'Uploaded revised Aadhaar PDF with QR code for loan RRA-2026-00124.',
    status: 'In Review',
    date: '02 Nov 2026, 11:20 AM',
    priority: 'High',
    resolutionNotes: 'Document handed to Senior Verification Officer. Verification ETA: 3 hours.',
  },
  {
    id: 'TKT-2026-8802',
    category: 'Tenure Modification',
    applicationId: 'RRA-2026-00098',
    subject: 'Tenure extension from 36 to 48 months',
    description: 'Requested lower EMI by extending loan repayment tenure.',
    status: 'Resolved',
    date: '28 Oct 2026, 04:15 PM',
    priority: 'Normal',
    resolutionNotes: 'Approved by Chandigarh Credit Desk. Revised sanction letter issued.',
  },
];

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Applications',
    question: 'How long does loan document verification take?',
    answer:
      'Digital document verification typically takes 2 to 4 business hours. If physical re-verification or additional salary credit proofs are required, our credit team finalizes the review within 24 to 48 business hours.',
  },
  {
    id: 'faq-2',
    category: 'Applications',
    question: 'Can I modify my loan amount or tenure after submitting?',
    answer:
      'Yes. While your application is in "Pending" or "Under Review" status, you can submit a support ticket or contact your assigned branch advisor to adjust the tenure or amount prior to final sanction.',
  },
  {
    id: 'faq-3',
    category: 'Applications',
    question: 'What documents are required for digital sanction?',
    answer:
      'Mandatory proofs include: PAN card, Aadhaar card (front and back), last 3 months salary slips or income statement, and 6 months bank statement in original PDF format.',
  },
  {
    id: 'faq-4',
    category: 'Disbursements',
    question: 'How quickly is the loan disbursed after final approval?',
    answer:
      'Once your loan application receives "Approved" status and the digital loan agreement is signed via Aadhaar e-Sign, funds are disbursed directly to your verified bank account within 2 to 4 hours.',
  },
  {
    id: 'faq-5',
    category: 'Disbursements',
    question: 'Are there any hidden fees or pre-closure penalties?',
    answer:
      'No hidden fees. Ridhi Ratnam Associates operates under transparent RBI Fair Practices guidelines. Prepayment and foreclosure on individual floating-rate loans carry zero foreclosure charges.',
  },
  {
    id: 'faq-6',
    category: 'KYC & Legal',
    question: 'How does Ridhi Ratnam safeguard personal and financial data?',
    answer:
      'All customer data is encrypted in transit using TLS 1.3 and stored securely in accordance with the Digital Personal Data Protection (DPDP) Act and RBI master directions for digital lending.',
  },
];

interface SupportScreenProps {
  viewerRole: 'client' | 'agent';
  onBack: () => void;
}

export const SupportScreen: React.FC<SupportScreenProps> = ({
  viewerRole,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<SupportTab>('channels');

  // Android hardware / gesture back button handling
  useEffect(() => {
    const handleBackPress = () => {
      if (activeTab !== 'channels') {
        setActiveTab('channels');
        return true;
      }
      onBack();
      return true;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backSubscription.remove();
  }, [activeTab, onBack]);

  // Ticket Form States
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [selectedCategory, setSelectedCategory] = useState('Application Status');
  const [applicationId, setApplicationId] = useState(
    viewerRole === 'client' ? 'RRA-2026-00124' : 'General Agent Inquiry'
  );
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [requestCallback, setRequestCallback] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSuccessId, setTicketSuccessId] = useState<string | null>(null);

  // FAQ Accordion State
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState<'All' | 'Applications' | 'Disbursements' | 'KYC & Legal'>('All');

  const toggleFaq = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const handleCallHotline = () => {
    const phoneNumber = viewerRole === 'client' ? '18001234567' : '18004197434';
    const displayPhone = viewerRole === 'client' ? '1800 123 4567' : '1800 419 7434';
    themeAlert(
      'Priority Phone Support',
      `Connecting to Ridhi Ratnam ${
        viewerRole === 'client' ? 'Client Concierge Desk' : 'Agent Partner Operations Desk'
      } at ${displayPhone}.\n\nOperating Hours:\nMonday – Saturday: 9:00 AM – 6:00 PM IST`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Dial Hotline',
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`).catch(() => {
              themeAlert('Phone Call', `Dialing ${displayPhone} is not supported on this device.`);
            });
          },
        },
      ]
    );
  };

  const handleSendEmail = () => {
    const emailAddress = viewerRole === 'client' ? 'support@ridhiratnam.com' : 'agentdesk@ridhiratnam.com';
    themeAlert(
      'Official Support Email',
      `Direct your written inquiry to ${emailAddress}.\nExpected response time: within 2 hours during business hours.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Compose Email',
          onPress: () => {
            Linking.openURL(
              `mailto:${emailAddress}?subject=Ridhi Ratnam Support Request - ${viewerRole.toUpperCase()}`
            ).catch(() => {
              themeAlert('Email', `Mail client could not be launched on this device.`);
            });
          },
        },
      ]
    );
  };

  const handleWhatsAppChat = () => {
    themeAlert(
      'Instant Advisory Chat',
      'Connecting to your designated Ridhi Ratnam branch advisor via encrypted support channel.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Chat',
          onPress: () => {
            Linking.openURL('https://wa.me/919876543210?text=Hello%20Ridhi%20Ratnam%20Support').catch(() => {
              themeAlert('Chat Support', 'Chat service launched for verified mobile line.');
            });
          },
        },
      ]
    );
  };

  const handleCreateTicket = () => {
    if (!ticketSubject.trim()) {
      themeAlert('Missing Subject', 'Please enter a brief subject for your support request.');
      return;
    }
    if (!ticketDescription.trim()) {
      themeAlert('Missing Details', 'Please provide a description so our team can assist you effectively.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const newTicketId = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTicket: SupportTicket = {
        id: newTicketId,
        category: selectedCategory,
        applicationId: applicationId.trim() || 'General Inquiry',
        subject: ticketSubject.trim(),
        description: ticketDescription.trim(),
        status: 'In Review',
        date: 'Just now',
        priority,
        resolutionNotes: requestCallback
          ? 'Priority callback registered. A senior specialist will call your registered number within 30 minutes.'
          : 'Ticket received and queued for credit desk investigation.',
      };

      setTickets([newTicket, ...tickets]);
      setTicketSuccessId(newTicketId);
      setTicketSubject('');
      setTicketDescription('');

      themeAlert(
        'Support Ticket Created',
        `Your request #${newTicketId} has been registered successfully. Our advisory desk has been notified.`,
        [{ text: 'View Ticket', onPress: () => setActiveTab('ticket') }]
      );
    }, 900);
  };

  const filteredFaqs = FAQ_DATA.filter((item) =>
    faqCategoryFilter === 'All' ? true : item.category === faqCategoryFilter
  );

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="light-content" />

      {/* Top Black Header (Matching App-wide Header Style) */}
      <View style={[styles.blackHeader, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.headerBackBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeftIcon size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerCategory}>CUSTOMER CARE & ADVISORY</Text>
          <Text style={styles.headerMainTitle}>Help & Support Desk</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCallHotline}
          style={styles.quickCallPillDark}
          accessibilityRole="button"
          accessibilityLabel="Call Priority Support Hotline"
        >
          <PhoneIcon size={14} color="#FFFFFF" />
          <Text style={styles.quickCallTextDark}>Call</Text>
        </TouchableOpacity>
      </View>

      {/* Curved Content Sheet Container */}
      <View style={styles.curvedSheetContainer}>
        {/* Segmented Control Tabs */}
        <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarScroll}
        >
          <TouchableOpacity
            testID="tab-support-channels"
            activeOpacity={0.7}
            onPress={() => setActiveTab('channels')}
            style={[styles.tabButton, activeTab === 'channels' && styles.tabButtonActive]}
          >
            <HeadphonesIcon
              size={14}
              color={activeTab === 'channels' ? '#FFFFFF' : '#64748B'}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'channels' && styles.tabButtonTextActive,
              ]}
            >
              Contact Desk
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="tab-support-ticket"
            activeOpacity={0.7}
            onPress={() => setActiveTab('ticket')}
            style={[styles.tabButton, activeTab === 'ticket' && styles.tabButtonActive]}
          >
            <MessageSquareIcon
              size={14}
              color={activeTab === 'ticket' ? '#FFFFFF' : '#64748B'}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'ticket' && styles.tabButtonTextActive,
              ]}
            >
              {`Tickets (${tickets.length})`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="tab-support-faq"
            activeOpacity={0.7}
            onPress={() => setActiveTab('faq')}
            style={[styles.tabButton, activeTab === 'faq' && styles.tabButtonActive]}
          >
            <HelpCircleIcon
              size={14}
              color={activeTab === 'faq' ? '#FFFFFF' : '#64748B'}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'faq' && styles.tabButtonTextActive,
              ]}
            >
              FAQs & Guides
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="tab-support-grievance"
            activeOpacity={0.7}
            onPress={() => setActiveTab('grievance')}
            style={[styles.tabButton, activeTab === 'grievance' && styles.tabButtonActive]}
          >
            <ShieldIcon
              size={14}
              color={activeTab === 'grievance' ? '#FFFFFF' : '#64748B'}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'grievance' && styles.tabButtonTextActive,
              ]}
            >
              Redressal & Legal
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        {/* ============================================================== */}
        {/* TAB 1: CONTACT DESK & CHANNELS */}
        {/* ============================================================== */}
        {activeTab === 'channels' && (
          <View>
            {/* Dedicated Hero Banner */}
            <View style={styles.heroCard}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.statusIndicatorDot} />
                <Text style={styles.heroBadgeText}>LIVE HELP DESK ACTIVE</Text>
              </View>
              <Text style={styles.heroHeading}>
                {viewerRole === 'client'
                  ? 'We are here to assist your financial journey.'
                  : 'Partner Support & Operations Dispatch Desk'}
              </Text>
              <Text style={styles.heroSub}>
                {viewerRole === 'client'
                  ? 'Connect with certified loan counselors and get real-time assistance on your loan applications.'
                  : 'Dedicated agent escalation hotline for branch approvals, commission queries, and verification overrides.'}
              </Text>

              {/* Quick Dial Primary CTA */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCallHotline}
                style={styles.heroCallPill}
              >
                <PhoneIcon size={16} color="#FFFFFF" />
                <Text style={styles.heroCallPillText}>
                  {viewerRole === 'client'
                    ? 'Toll-Free Helpline: 1800 123 4567'
                    : 'Agent Operations: 1800 419 7434'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Assigned Relationship Manager Card */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>
                  {viewerRole === 'client' ? 'Dedicated Loan Officer' : 'Regional Branch Director'}
                </Text>
                <View style={styles.verifiedBadge}>
                  <CheckIcon size={12} color="#10B981" />
                  <Text style={styles.verifiedBadgeText}>Assigned</Text>
                </View>
              </View>

              <View style={styles.advisorProfileRow}>
                <View style={styles.advisorAvatar}>
                  <Text style={styles.advisorInitials}>
                    {viewerRole === 'client' ? 'RS' : 'SM'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.advisorName}>
                    {viewerRole === 'client' ? 'Rahul Sharma' : 'Sanjay Malhotra'}
                  </Text>
                  <Text style={styles.advisorDesignation}>
                    {viewerRole === 'client'
                      ? 'Senior Loan Advisor • Chandigarh Branch'
                      : 'Regional Operations Hub Director'}
                  </Text>
                  <Text style={styles.advisorCode}>
                    {viewerRole === 'client' ? 'Verification Officer • Chandigarh' : 'Branch Hub: Chandigarh Central'}
                  </Text>
                </View>
              </View>

              {/* Advisor Quick Action Buttons */}
              <View style={styles.advisorActionGrid}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleCallHotline}
                  style={styles.advisorActionBtn}
                >
                  <PhoneIcon size={14} color="#0D0E12" />
                  <Text style={styles.advisorActionText}>Direct Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleWhatsAppChat}
                  style={styles.advisorActionBtn}
                >
                  <MessageSquareIcon size={14} color="#0D0E12" />
                  <Text style={styles.advisorActionText}>Chat Message</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleSendEmail}
                  style={styles.advisorActionBtn}
                >
                  <MailIcon size={14} color="#0D0E12" />
                  <Text style={styles.advisorActionText}>Send Email</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Communication Channels List */}
            <View style={styles.sectionCard}>
              <Text style={styles.cardTitle}>Official Support Channels</Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleCallHotline}
                style={styles.channelItem}
              >
                <View style={styles.channelIconBox}>
                  <PhoneIcon size={16} color="#0D0E12" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.channelName}>Toll-Free Priority Line</Text>
                  <Text style={styles.channelValue}>
                    {viewerRole === 'client' ? '1800 123 4567' : '1800 419 7434'}
                  </Text>
                  <Text style={styles.channelTiming}>Mon – Sat, 9:00 AM – 6:00 PM IST</Text>
                </View>
                <ChevronRightIcon size={14} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSendEmail}
                style={styles.channelItem}
              >
                <View style={styles.channelIconBox}>
                  <MailIcon size={16} color="#0D0E12" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.channelName}>Official Support Email</Text>
                  <Text style={styles.channelValue}>
                    {viewerRole === 'client' ? 'support@ridhiratnam.com' : 'agentdesk@ridhiratnam.com'}
                  </Text>
                  <Text style={styles.channelTiming}>2-hour response turnaround during business hours</Text>
                </View>
                <ChevronRightIcon size={14} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleWhatsAppChat}
                style={[styles.channelItem, { borderBottomWidth: 0 }]}
              >
                <View style={styles.channelIconBox}>
                  <MessageSquareIcon size={16} color="#0D0E12" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.channelName}>Instant Advisory Desk</Text>
                  <Text style={styles.channelValue}>WhatsApp & Live Messaging</Text>
                  <Text style={styles.channelTiming}>Direct document upload troubleshooting</Text>
                </View>
                <ChevronRightIcon size={14} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Quick Raise Ticket CTA */}
            <View style={styles.ticketBannerCard}>
              <View style={styles.ticketBannerLeft}>
                <Text style={styles.ticketBannerTitle}>Have an issue or document query?</Text>
                <Text style={styles.ticketBannerSub}>
                  Raise an official support ticket to track progress with guaranteed resolution SLA.
                </Text>
              </View>
              <AnimatedButton
                title="Raise Ticket"
                variant="black"
                onPress={() => setActiveTab('ticket')}
                style={styles.ticketBannerBtn}
              />
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SUPPORT TICKETS & CREATION */}
        {/* ============================================================== */}
        {activeTab === 'ticket' && (
          <View>
            {/* Create Ticket Card */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>Raise a Support Ticket</Text>
                <Text style={styles.requiredNotice}>* Required Fields</Text>
              </View>

              {/* Category Selection */}
              <Text style={styles.fieldLabel}>Inquiry Category *</Text>
              <View style={styles.chipsRow}>
                {[
                  'Application Status',
                  'Document Verification',
                  'Sanction & Disbursal',
                  'Interest & EMI',
                  'Technical App Issue',
                ].map((cat) => (
                  <PillChip
                    key={cat}
                    label={cat}
                    selected={selectedCategory === cat}
                    onPress={() => setSelectedCategory(cat)}
                    accentColor={colors.primaryBlack}
                    style={styles.catChip}
                  />
                ))}
              </View>

              {/* Related Application ID */}
              <Text style={styles.fieldLabel}>Related Application / Reference ID</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. RRA-2026-00124 or General Inquiry"
                placeholderTextColor="#94A3B8"
                value={applicationId}
                onChangeText={setApplicationId}
              />

              {/* Ticket Subject */}
              <Text style={styles.fieldLabel}>Subject Summary *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Brief summary of your query or problem"
                placeholderTextColor="#94A3B8"
                value={ticketSubject}
                onChangeText={setTicketSubject}
              />

              {/* Ticket Description */}
              <Text style={styles.fieldLabel}>Detailed Description *</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaInput]}
                placeholder="Please describe the issue, document reference, or error message in detail..."
                placeholderTextColor="#94A3B8"
                value={ticketDescription}
                onChangeText={setTicketDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Priority Selector */}
              <Text style={styles.fieldLabel}>Priority Level</Text>
              <View style={styles.priorityRow}>
                {(['Normal', 'High', 'Urgent'] as const).map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    activeOpacity={0.7}
                    onPress={() => setPriority(lvl)}
                    style={[
                      styles.priorityPill,
                      priority === lvl && styles.priorityPillActive,
                      lvl === 'Urgent' && priority === 'Urgent' && styles.priorityPillUrgent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityPillText,
                        priority === lvl && styles.priorityPillTextActive,
                      ]}
                    >
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Request Callback Checkbox */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setRequestCallback(!requestCallback)}
                style={styles.checkboxRow}
              >
                <View
                  style={[
                    styles.checkboxBox,
                    requestCallback && styles.checkboxBoxChecked,
                  ]}
                >
                  {requestCallback && <CheckIcon size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxLabel}>
                  Request urgent phone callback from an advisory specialist
                </Text>
              </TouchableOpacity>

              {/* Submit Ticket Button */}
              <AnimatedButton
                title={isSubmitting ? 'Registering Ticket...' : 'Submit Support Ticket'}
                showChevronTriple={!isSubmitting}
                variant="black"
                loading={isSubmitting}
                onPress={handleCreateTicket}
                style={styles.submitTicketBtn}
              />
            </View>

            {/* Existing Active Tickets Section */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>Your Support Tickets ({tickets.length})</Text>
                <Text style={styles.ticketCountSub}>Track resolution progress</Text>
              </View>

              {tickets.map((ticket) => (
                <View key={ticket.id} style={styles.ticketCardItem}>
                  <View style={styles.ticketItemHeader}>
                    <View style={styles.ticketIdRow}>
                      <Text style={styles.ticketIdText}>{ticket.id}</Text>
                      <View
                        style={[
                          styles.ticketStatusBadge,
                          ticket.status === 'Resolved'
                            ? styles.badgeResolved
                            : styles.badgeInReview,
                        ]}
                      >
                        <Text
                          style={[
                            styles.ticketStatusText,
                            ticket.status === 'Resolved'
                              ? styles.textResolved
                              : styles.textInReview,
                          ]}
                        >
                          {ticket.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.ticketDateText}>{ticket.date}</Text>
                  </View>

                  <Text style={styles.ticketSubjectText}>{ticket.subject}</Text>
                  <Text style={styles.ticketDescText}>{ticket.description}</Text>

                  <View style={styles.ticketMetaRow}>
                    <Text style={styles.ticketMetaTag}>Ref: {ticket.applicationId}</Text>
                    <Text style={styles.ticketMetaTag}>Priority: {ticket.priority}</Text>
                  </View>

                  {ticket.resolutionNotes && (
                    <View style={styles.ticketResolutionBox}>
                      <View style={styles.resolutionHeader}>
                        <ClockIcon size={12} color="#0D0E12" />
                        <Text style={styles.resolutionTitle}>Advisory Desk Note</Text>
                      </View>
                      <Text style={styles.resolutionText}>{ticket.resolutionNotes}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* TAB 3: FAQ & KNOWLEDGE BASE */}
        {/* ============================================================== */}
        {activeTab === 'faq' && (
          <View>
            {/* Category Filter Chips */}
            <View style={styles.faqFilterContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.faqFilterScroll}
              >
                {(['All', 'Applications', 'Disbursements', 'KYC & Legal'] as const).map(
                  (cat) => (
                    <PillChip
                      key={cat}
                      label={cat}
                      selected={faqCategoryFilter === cat}
                      onPress={() => setFaqCategoryFilter(cat)}
                      accentColor={colors.primaryBlack}
                      style={styles.faqFilterChip}
                    />
                  )
                )}
              </ScrollView>
            </View>

            {/* FAQ Accordion List */}
            <View style={styles.sectionCard}>
              <Text style={styles.cardTitle}>Frequently Asked Questions</Text>
              <Text style={styles.faqSub}>
                Instant answers to the most common queries regarding loans, documents, and approvals.
              </Text>

              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <View key={faq.id} style={styles.faqAccordionItem}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => toggleFaq(faq.id)}
                      style={styles.faqQuestionRow}
                      accessibilityRole="button"
                    >
                      <View style={styles.faqIconBox}>
                        <HelpCircleIcon size={14} color="#0D0E12" />
                      </View>
                      <Text style={styles.faqQuestionText}>{faq.question}</Text>
                      <ChevronRightIcon
                        size={14}
                        color="#64748B"
                        style={{
                          transform: [{ rotate: isExpanded ? '90deg' : '0deg' }],
                        }}
                      />
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.faqAnswerContainer}>
                        <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                        <View style={styles.faqCategoryBadge}>
                          <Text style={styles.faqCategoryText}>{faq.category}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Still Need Help Box */}
            <View style={styles.stillNeedCard}>
              <HeadphonesIcon size={22} color="#0D0E12" />
              <Text style={styles.stillNeedTitle}>Couldn't find what you need?</Text>
              <Text style={styles.stillNeedSub}>
                Our advisory team is available to assist you personally via direct phone call or ticket.
              </Text>
              <View style={styles.stillNeedBtnRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleCallHotline}
                  style={styles.stillNeedBtn}
                >
                  <PhoneIcon size={14} color="#0D0E12" />
                  <Text style={styles.stillNeedBtnText}>Call Advisor</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setActiveTab('ticket')}
                  style={[styles.stillNeedBtn, styles.stillNeedBtnDark]}
                >
                  <MessageSquareIcon size={14} color="#FFFFFF" />
                  <Text style={[styles.stillNeedBtnText, { color: '#FFFFFF' }]}>
                    Raise Ticket
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* TAB 4: GRIEVANCE REDRESSAL & REGULATORY DISCLOSURES */}
        {/* ============================================================== */}
        {activeTab === 'grievance' && (
          <View>
            {/* Regulatory Compliance Badge */}
            <View style={styles.sectionCard}>
              <View style={styles.grievanceHeaderRow}>
                <ShieldIcon size={20} color="#CDA148" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.grievanceTitle}>RBI Fair Practices & Grievance Policy</Text>
                  <Text style={styles.grievanceSub}>
                    Ridhi Ratnam Associates operates under strict compliance with Reserve Bank of India (RBI) Digital Lending Master Directions.
                  </Text>
                </View>
              </View>

              {/* 3-Tier Redressal Mechanism */}
              <Text style={[styles.cardTitle, { marginTop: 18, marginBottom: 12 }]}>
                3-Tier Redressal Escalation Matrix
              </Text>

              {/* Level 1 */}
              <View style={styles.tierCard}>
                <View style={styles.tierHeader}>
                  <View style={styles.tierBadge}>
                    <Text style={styles.tierBadgeText}>LEVEL 1</Text>
                  </View>
                  <Text style={styles.tierRole}>Branch Relationship Desk</Text>
                </View>
                <Text style={styles.tierDesc}>
                  Direct consultation with your designated loan counselor or branch manager for fast-track resolution.
                </Text>
                <Text style={styles.tierSla}>Turnaround SLA: Within 24 business hours</Text>
              </View>

              {/* Level 2 */}
              <View style={styles.tierCard}>
                <View style={styles.tierHeader}>
                  <View style={[styles.tierBadge, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.tierBadgeText, { color: '#B45309' }]}>LEVEL 2</Text>
                  </View>
                  <Text style={styles.tierRole}>Principal Nodal Grievance Officer</Text>
                </View>
                <Text style={styles.tierDesc}>
                  If your issue is unresolved within 7 business days, escalate to the Principal Grievance Redressal Officer.
                </Text>
                <View style={styles.officerDetailsBox}>
                  <Text style={styles.officerName}>Officer: Mr. Vikas Mehra</Text>
                  <Text style={styles.officerInfo}>Email: grievance@ridhiratnam.com</Text>
                  <Text style={styles.officerInfo}>Hotline: 0172-4928100 (Direct Desk)</Text>
                  <Text style={styles.officerInfo}>
                    Address: SCO 84-85, Sector 17-C, Chandigarh – 160017
                  </Text>
                </View>
                <Text style={styles.tierSla}>Turnaround SLA: Within 48 business hours</Text>
              </View>

              {/* Level 3 */}
              <View style={[styles.tierCard, { borderBottomWidth: 0 }]}>
                <View style={styles.tierHeader}>
                  <View style={[styles.tierBadge, { backgroundColor: '#EDE9FE' }]}>
                    <Text style={[styles.tierBadgeText, { color: '#6D28D9' }]}>LEVEL 3</Text>
                  </View>
                  <Text style={styles.tierRole}>RBI Integrated Ombudsman</Text>
                </View>
                <Text style={styles.tierDesc}>
                  If your grievance is not redressed within 30 days, customers have the right to appeal to the Reserve Bank of India Ombudsman via cms.rbi.org.in or dial 14448.
                </Text>
                <Text style={styles.tierSla}>Apex Regulatory Redressal</Text>
              </View>
            </View>

            {/* Legal Disclosures Box */}
            <View style={styles.legalBox}>
              <Text style={styles.legalHeader}>Regulatory & Fair Practices Notice</Text>
              <Text style={styles.legalBody}>
                Ridhi Ratnam Associates does not levy any arbitrary fees or charges without advance disclosure in the Key Fact Statement (KFS). Customers are entitled to a complete statement of account, loan agreement copy, and sanction letter free of cost upon request.
              </Text>
              <Text style={styles.legalFooter}>
                CIN: U65929CH2020PTC043219 • RBI Certified Lending Partner
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.topBarBlack,
  },
  blackHeader: {
    backgroundColor: colors.topBarBlack,
    paddingHorizontal: 20,
    paddingBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCallPillDark: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glassBackground,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    gap: 5,
  },
  quickCallTextDark: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  curvedSheetContainer: {
    flex: 1,
    backgroundColor: colors.sheetBackground,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.lg,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    gap: 4,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D0E12',
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerCategory: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#CDA148',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  headerMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  quickCallPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 5,
  },
  quickCallText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D0E12',
  },
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  tabBarScroll: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#0D0E12',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    padding: spacing.lg,
  },
  heroCard: {
    backgroundColor: '#0D0E12',
    borderRadius: 24,
    padding: 20,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  statusIndicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#CDA148',
    letterSpacing: 0.8,
  },
  heroHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 6,
    lineHeight: 24,
  },
  heroSub: {
    fontSize: 12.5,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroCallPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: borderRadius.pill,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  heroCallPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8EAED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: spacing.lg,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D0E12',
    letterSpacing: -0.2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  advisorProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  advisorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0D0E12',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#CDA148',
  },
  advisorInitials: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  advisorName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D0E12',
  },
  advisorDesignation: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  advisorCode: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CDA148',
    marginTop: 2,
  },
  advisorActionGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  advisorActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 9,
    gap: 6,
  },
  advisorActionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0D0E12',
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  channelIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D0E12',
  },
  channelValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CDA148',
    marginTop: 1,
  },
  channelTiming: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  ticketBannerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  ticketBannerLeft: {
    flex: 1,
  },
  ticketBannerTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0D0E12',
    marginBottom: 2,
  },
  ticketBannerSub: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
  ticketBannerBtn: {
    minWidth: 110,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 12,
  },
  requiredNotice: {
    fontSize: 11,
    color: '#94A3B8',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  catChip: {
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0D0E12',
  },
  textAreaInput: {
    height: 96,
    paddingTop: 10,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  priorityPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priorityPillActive: {
    backgroundColor: '#0D0E12',
    borderColor: '#0D0E12',
  },
  priorityPillUrgent: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  priorityPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  priorityPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#0D0E12',
    borderColor: '#0D0E12',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
  },
  submitTicketBtn: {
    marginTop: 8,
    width: '100%',
  },
  ticketCountSub: {
    fontSize: 11.5,
    color: '#64748B',
  },
  ticketCardItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  ticketItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ticketIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketIdText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D0E12',
  },
  ticketStatusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  badgeInReview: {
    backgroundColor: '#FEF3C7',
  },
  badgeResolved: {
    backgroundColor: '#DCFCE7',
  },
  ticketStatusText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  textInReview: {
    color: '#B45309',
  },
  textResolved: {
    color: '#15803D',
  },
  ticketDateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  ticketSubjectText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0D0E12',
    marginBottom: 4,
  },
  ticketDescText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 8,
  },
  ticketMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  ticketMetaTag: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#EDE9FE',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  ticketResolutionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resolutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  resolutionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D0E12',
  },
  resolutionText: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
  },
  faqFilterContainer: {
    marginBottom: 12,
  },
  faqFilterScroll: {
    gap: 6,
  },
  faqFilterChip: {
    marginRight: 4,
  },
  faqSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
    lineHeight: 17,
  },
  faqAccordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 12,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  faqIconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#0D0E12',
    lineHeight: 18,
  },
  faqAnswerContainer: {
    paddingLeft: 36,
    paddingTop: 8,
  },
  faqAnswerText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 6,
  },
  faqCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  faqCategoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  stillNeedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8EAED',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  stillNeedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D0E12',
    marginTop: 8,
    marginBottom: 4,
  },
  stillNeedSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 14,
  },
  stillNeedBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  stillNeedBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 10,
    gap: 6,
  },
  stillNeedBtnDark: {
    backgroundColor: '#0D0E12',
    borderColor: '#0D0E12',
  },
  stillNeedBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D0E12',
  },
  grievanceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  grievanceTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 2,
  },
  grievanceSub: {
    fontSize: 11.5,
    color: '#78350F',
    lineHeight: 16,
  },
  tierCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 14,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tierBadge: {
    backgroundColor: '#E0F2FE',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  tierBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0369A1',
  },
  tierRole: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D0E12',
  },
  tierDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginTop: 2,
  },
  tierSla: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CDA148',
    marginTop: 4,
  },
  officerDetailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
    marginBottom: 4,
  },
  officerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D0E12',
    marginBottom: 2,
  },
  officerInfo: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 16,
  },
  legalBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 14,
  },
  legalHeader: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 4,
  },
  legalBody: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 6,
  },
  legalFooter: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
});
