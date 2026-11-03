import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { useAppTheme, borderRadius, spacing } from '../../theme';
import {
  KycDocument,
  KycDocumentConfig,
  DEFAULT_KYC_DOCUMENT_CONFIGS,
  KycSubmission,
} from '../../types/kyc';
import {
  ShieldIcon,
  FileTextIcon,
  CheckIcon,
  AlertCircleIcon,
  UploadCloudIcon,
  CameraIcon,
  CrossIcon,
  UserIcon,
  LockIcon,
  BuildingIcon,
} from '../Icons';
import { AnimatedButton } from '../AnimatedButton';
import { themeAlert } from '../ThemeDialog';
import { submitKycDocuments } from '../../services/kycService';

interface KycDocumentUploadFormProps {
  clientInfo?: {
    name: string;
    email: string;
    phone: string;
    clientId: string;
  };
  documentConfigs?: KycDocumentConfig[];
  onSubmitSuccess?: (submission: KycSubmission) => void;
  onCancel?: () => void;
}

export const KycDocumentUploadForm: React.FC<KycDocumentUploadFormProps> = ({
  clientInfo = {
    name: 'Amit Verma',
    email: 'amit.client@ridhiratnam.demo',
    phone: '+91 9876543210',
    clientId: 'RRA-CL-1001',
  },
  documentConfigs = DEFAULT_KYC_DOCUMENT_CONFIGS,
  onSubmitSuccess,
  onCancel,
}) => {
  const { colors, isDark } = useAppTheme();

  // Uploaded docs state map: documentConfig.id -> KycDocument | null
  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: KycDocument | null }>({
    aadhaar: {
      id: 'doc-init-1',
      type: 'aadhaar',
      name: 'Aadhaar Card',
      fileName: 'aadhaar_card_masked_eKYC.pdf',
      fileSize: '1.8 MB',
      uploadDate: 'Today',
      status: 'Uploaded',
    },
    pan: {
      id: 'doc-init-2',
      type: 'pan',
      name: 'PAN Card',
      fileName: 'pan_card_amit_verma.jpg',
      fileSize: '820 KB',
      uploadDate: 'Today',
      status: 'Uploaded',
    },
    address_proof: null,
    photograph: null,
    additional: null,
  });

  const [selectedConfigForUpload, setSelectedConfigForUpload] = useState<KycDocumentConfig | null>(null);
  const [previewDoc, setPreviewDoc] = useState<KycDocument | null>(null);
  const [isPickerModalVisible, setIsPickerModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Check required docs uploaded
  const requiredConfigs = documentConfigs.filter((c) => c.required);
  const allRequiredUploaded = requiredConfigs.every((c) => Boolean(uploadedDocs[c.id]));

  // Open Document Picker
  const handleOpenPicker = (config: KycDocumentConfig) => {
    setSelectedConfigForUpload(config);
    setIsPickerModalVisible(true);
  };

  // Attach Document
  const handleAttachDocument = (source: 'camera' | 'gallery' | 'file') => {
    if (!selectedConfigForUpload) return;

    const config = selectedConfigForUpload;
    const extension = source === 'file' ? 'pdf' : 'jpg';
    const cleanClient = clientInfo.name.toLowerCase().replace(/\s+/g, '_');
    const newDoc: KycDocument = {
      id: `doc-${Date.now()}`,
      type: config.id,
      name: config.name,
      fileName: `${config.id}_${cleanClient}_verified.${extension}`,
      fileSize: source === 'file' ? '1.4 MB' : '920 KB',
      uploadDate: 'Just now',
      status: 'Uploaded',
    };

    setUploadedDocs((prev) => ({
      ...prev,
      [config.id]: newDoc,
    }));

    setIsPickerModalVisible(false);
    setSelectedConfigForUpload(null);

    themeAlert(
      'Document Attached',
      `${config.name} (${newDoc.fileName}) has been successfully attached and encrypted for upload.`
    );
  };

  // Remove Document
  const handleRemoveDocument = (configId: string, docName: string) => {
    themeAlert(
      'Remove Document',
      `Are you sure you want to remove ${docName}? You will need to re-upload it before submitting.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setUploadedDocs((prev) => ({
              ...prev,
              [configId]: null,
            }));
          },
        },
      ]
    );
  };

  // Final Submission
  const handleSubmitConfirmation = () => {
    if (!allRequiredUploaded) {
      themeAlert(
        'Incomplete Submission',
        'Please upload all mandatory documents (Aadhaar, PAN, Address Proof, and Photograph) before submitting.'
      );
      return;
    }

    const docList = Object.values(uploadedDocs).filter(Boolean) as KycDocument[];

    themeAlert(
      'Confirm KYC Submission',
      `You are submitting ${docList.length} documents for verification by Ridhi Ratnam Associates.\n\nAll files will be securely submitted to the agency compliance desk under RBI DPDP guidelines.`,
      [
        { text: 'Review Again', style: 'cancel' },
        {
          text: 'Confirm & Submit',
          onPress: async () => {
            setSubmitting(true);
            try {
              const submission = await submitKycDocuments({
                clientId: clientInfo.clientId,
                clientName: clientInfo.name,
                clientEmail: clientInfo.email,
                clientPhone: clientInfo.phone,
                documents: docList,
              });

              setTimeout(() => {
                setSubmitting(false);
                themeAlert(
                  'KYC Submitted Successfully',
                  `Your KYC verification submission #${submission.id} has been registered.\n\nOur compliance officer will review your documents within 24-48 business hours.`,
                  [
                    {
                      text: 'View Submission',
                      onPress: () => {
                        if (onSubmitSuccess) onSubmitSuccess(submission);
                      },
                    },
                  ]
                );
              }, 1000);
            } catch {
              setSubmitting(false);
              themeAlert('Error', 'Unable to complete submission. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title & Guidance Banner */}
      <View
        style={[
          styles.guidanceCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View style={styles.guidanceHeader}>
          <ShieldIcon size={20} color={colors.brandGold} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.guidanceTitle, { color: colors.textPrimary }]}>
              KYC Document Upload
            </Text>
            <Text style={[styles.guidanceSubtitle, { color: colors.textSecondary }]}>
              Upload high-resolution scans or official digital PDFs (max 5 MB each).
            </Text>
          </View>
        </View>

        {/* Client Profile Pill Strip */}
        <View
          style={[
            styles.clientProfileStrip,
            {
              backgroundColor: isDark ? colors.cardSecondary : '#F8FAFC',
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View style={styles.clientCol}>
            <Text style={[styles.clientLabel, { color: colors.textSecondary }]}>Applicant</Text>
            <Text style={[styles.clientValue, { color: colors.textPrimary }]}>{clientInfo.name}</Text>
          </View>
          <View style={[styles.stripDivider, { backgroundColor: colors.cardBorder }]} />
          <View style={styles.clientCol}>
            <Text style={[styles.clientLabel, { color: colors.textSecondary }]}>Account ID</Text>
            <Text style={[styles.clientValue, { color: colors.brandGold }]}>{clientInfo.clientId}</Text>
          </View>
          <View style={[styles.stripDivider, { backgroundColor: colors.cardBorder }]} />
          <View style={styles.clientCol}>
            <Text style={[styles.clientLabel, { color: colors.textSecondary }]}>Mobile</Text>
            <Text style={[styles.clientValue, { color: colors.textPrimary }]}>{clientInfo.phone}</Text>
          </View>
        </View>
      </View>

      {/* Configurable Document Upload Cards */}
      <View style={styles.documentList}>
        {documentConfigs.map((config, index) => {
          const doc = uploadedDocs[config.id];
          const isUploaded = Boolean(doc);

          return (
            <View
              key={config.id}
              style={[
                styles.docCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isUploaded ? colors.brandGold : colors.cardBorder,
                },
              ]}
            >
              <View style={styles.docHeaderRow}>
                <View style={styles.docBadgeRow}>
                  <View
                    style={[
                      styles.docNumBadge,
                      {
                        backgroundColor: isUploaded ? colors.brandGold : colors.cardSecondary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.docNumText,
                        { color: isUploaded ? colors.topBarBlack : colors.textSecondary },
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.docTitleRow}>
                      <Text style={[styles.docName, { color: colors.textPrimary }]}>
                        {config.name}
                      </Text>
                      {config.required ? (
                        <View style={styles.mandatoryBadge}>
                          <Text style={styles.mandatoryText}>Required</Text>
                        </View>
                      ) : (
                        <View style={styles.optionalBadge}>
                          <Text style={styles.optionalText}>Optional</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.docDesc, { color: colors.textSecondary }]}>
                      {config.description}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Upload Status & File Information */}
              {isUploaded && doc ? (
                <View
                  style={[
                    styles.uploadedInfoBox,
                    {
                      backgroundColor: isDark ? colors.cardSecondary : '#F0FDF4',
                      borderColor: isDark ? '#065F46' : '#BBF7D0',
                    },
                  ]}
                >
                  <View style={styles.fileIconBadge}>
                    <CheckIcon size={14} color="#059669" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={[styles.fileNameText, { color: colors.textPrimary }]} numberOfLines={1}>
                      {doc.fileName}
                    </Text>
                    <Text style={[styles.fileSizeText, { color: colors.textSecondary }]}>
                      {doc.fileSize} • Uploaded {doc.uploadDate}
                    </Text>
                  </View>

                  {/* Actions: Preview & Replace/Remove */}
                  <View style={styles.fileActions}>
                    <TouchableOpacity
                      testID={`btn-preview-${config.id}`}
                      activeOpacity={0.7}
                      onPress={() => setPreviewDoc(doc)}
                      style={[styles.smallActionBtn, { borderColor: colors.cardBorder }]}
                      accessibilityLabel={`Preview ${config.name}`}
                    >
                      <Text style={[styles.smallActionText, { color: colors.brandGold }]}>Preview</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      testID={`btn-replace-${config.id}`}
                      activeOpacity={0.7}
                      onPress={() => handleOpenPicker(config)}
                      style={[styles.smallActionBtn, { borderColor: colors.cardBorder }]}
                      accessibilityLabel={`Replace ${config.name}`}
                    >
                      <Text style={[styles.smallActionText, { color: colors.textSecondary }]}>Replace</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      testID={`btn-remove-${config.id}`}
                      activeOpacity={0.7}
                      onPress={() => handleRemoveDocument(config.id, config.name)}
                      style={[styles.smallActionBtn, { borderColor: '#FECACA' }]}
                      accessibilityLabel={`Remove ${config.name}`}
                    >
                      <Text style={[styles.smallActionText, { color: '#DC2626' }]}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                /* Empty Upload Slot */
                <TouchableOpacity
                  testID={`btn-upload-${config.id}`}
                  activeOpacity={0.8}
                  onPress={() => handleOpenPicker(config)}
                  style={[
                    styles.uploadTriggerBox,
                    {
                      borderColor: colors.cardBorder,
                      backgroundColor: isDark ? colors.cardSecondary : '#F8FAFC',
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Upload ${config.name}`}
                >
                  <UploadCloudIcon size={20} color={colors.brandGold} />
                  <Text style={[styles.uploadTriggerTitle, { color: colors.textPrimary }]}>
                    Tap to upload or take photo
                  </Text>
                  <Text style={[styles.uploadTriggerSub, { color: colors.textSecondary }]}>
                    Supported formats: {config.allowedFormats.join(', ')} (Max {config.maxSizeMb} MB)
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      {/* Security Assurance Card */}
      <View
        style={[
          styles.securityNote,
          {
            backgroundColor: isDark ? colors.cardSecondary : '#FEF8E7',
            borderColor: colors.brandGold,
          },
        ]}
      >
        <LockIcon size={16} color={colors.brandGold} />
        <Text style={[styles.securityNoteText, { color: colors.textPrimary }]}>
          256-Bit Encrypted Transfer • All uploaded documents are stored in RBI-certified domestic facilities and strictly confidential.
        </Text>
      </View>

      {/* Bottom CTA Row */}
      <View style={styles.ctaRow}>
        <AnimatedButton
          testID="btn-submit-kyc"
          title={submitting ? 'Submitting Documents...' : 'Submit for Verification'}
          variant="black"
          showChevronTriple={!submitting}
          loading={submitting}
          disabled={submitting || !allRequiredUploaded}
          onPress={handleSubmitConfirmation}
          style={styles.submitBtn}
        />

        {onCancel && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onCancel}
            style={styles.cancelBtn}
            accessibilityRole="button"
          >
            <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ================= MODAL 1: DOCUMENT SOURCE PICKER ================= */}
      <Modal
        visible={isPickerModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPickerModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsPickerModalVisible(false)}
        >
          <View
            style={[
              styles.pickerSheet,
              {
                backgroundColor: colors.cardElevated,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View style={styles.sheetHandle} />

            <Text style={[styles.pickerTitle, { color: colors.textPrimary }]}>
              {selectedConfigForUpload ? `Attach ${selectedConfigForUpload.name}` : 'Attach Document'}
            </Text>
            <Text style={[styles.pickerSubtitle, { color: colors.textSecondary }]}>
              Choose a document source to upload your verification file
            </Text>

            <View style={styles.pickerOptionsList}>
              <TouchableOpacity
                testID="btn-picker-camera"
                activeOpacity={0.7}
                onPress={() => handleAttachDocument('camera')}
                style={[styles.pickerOptionRow, { borderColor: colors.cardBorder }]}
              >
                <View style={[styles.pickerIconCircle, { backgroundColor: '#EFF6FF' }]}>
                  <CameraIcon size={20} color="#2563EB" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.pickerOptionTitle, { color: colors.textPrimary }]}>
                    Take Photo with Camera
                  </Text>
                  <Text style={[styles.pickerOptionDesc, { color: colors.textSecondary }]}>
                    Capture document directly using camera
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                testID="btn-picker-gallery"
                activeOpacity={0.7}
                onPress={() => handleAttachDocument('gallery')}
                style={[styles.pickerOptionRow, { borderColor: colors.cardBorder }]}
              >
                <View style={[styles.pickerIconCircle, { backgroundColor: '#ECFDF5' }]}>
                  <UploadCloudIcon size={20} color="#059669" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.pickerOptionTitle, { color: colors.textPrimary }]}>
                    Select Image from Gallery
                  </Text>
                  <Text style={[styles.pickerOptionDesc, { color: colors.textSecondary }]}>
                    Upload JPG, JPEG or PNG image
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                testID="btn-picker-file"
                activeOpacity={0.7}
                onPress={() => handleAttachDocument('file')}
                style={[styles.pickerOptionRow, { borderColor: colors.cardBorder }]}
              >
                <View style={[styles.pickerIconCircle, { backgroundColor: '#FEF8E7' }]}>
                  <FileTextIcon size={20} color={colors.brandGold} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.pickerOptionTitle, { color: colors.textPrimary }]}>
                    Upload PDF Document
                  </Text>
                  <Text style={[styles.pickerOptionDesc, { color: colors.textSecondary }]}>
                    Select digital PDF statement or scan
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsPickerModalVisible(false)}
              style={[styles.pickerCancelBtn, { borderColor: colors.cardBorder }]}
            >
              <Text style={[styles.pickerCancelText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ================= MODAL 2: DOCUMENT PREVIEW MODAL ================= */}
      <Modal
        visible={Boolean(previewDoc)}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewDoc(null)}
      >
        <View style={styles.previewModalOverlay}>
          <View
            style={[
              styles.previewModalCard,
              {
                backgroundColor: colors.cardElevated,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.previewHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.previewModalTitle, { color: colors.textPrimary }]}>
                  {previewDoc?.name}
                </Text>
                <Text style={[styles.previewModalSub, { color: colors.textSecondary }]}>
                  {previewDoc?.fileName} • {previewDoc?.fileSize}
                </Text>
              </View>
              <TouchableOpacity
                testID="btn-close-preview"
                activeOpacity={0.7}
                onPress={() => setPreviewDoc(null)}
                style={styles.previewCloseBtn}
              >
                <CrossIcon size={16} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Document Canvas Illustration */}
            <View
              style={[
                styles.previewCanvas,
                {
                  backgroundColor: isDark ? colors.cardSecondary : '#F8FAFC',
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <View style={styles.certificateHeader}>
                <BuildingIcon size={24} color={colors.brandGold} />
                <Text style={[styles.certOrgText, { color: colors.textPrimary }]}>
                  RIDHI RATNAM ASSOCIATES
                </Text>
                <Text style={[styles.certSubText, { color: colors.textSecondary }]}>
                  CLIENT KYC COMPLIANCE DOSSIER
                </Text>
              </View>

              <View style={styles.certBody}>
                <View style={styles.certRow}>
                  <Text style={[styles.certLabel, { color: colors.textSecondary }]}>Document Type:</Text>
                  <Text style={[styles.certValue, { color: colors.textPrimary }]}>{previewDoc?.name}</Text>
                </View>
                <View style={styles.certRow}>
                  <Text style={[styles.certLabel, { color: colors.textSecondary }]}>Applicant Name:</Text>
                  <Text style={[styles.certValue, { color: colors.textPrimary }]}>{clientInfo.name}</Text>
                </View>
                <View style={styles.certRow}>
                  <Text style={[styles.certLabel, { color: colors.textSecondary }]}>Account ID:</Text>
                  <Text style={[styles.certValue, { color: colors.brandGold }]}>{clientInfo.clientId}</Text>
                </View>
                <View style={styles.certRow}>
                  <Text style={[styles.certLabel, { color: colors.textSecondary }]}>File Verification:</Text>
                  <Text style={[styles.certValue, { color: '#059669' }]}>SHA-256 Checksum Verified ✓</Text>
                </View>
              </View>

              <View style={[styles.certSeal, { borderColor: colors.brandGold }]}>
                <ShieldIcon size={20} color={colors.brandGold} />
                <Text style={[styles.certSealText, { color: colors.brandGold }]}>
                  DIGITALLY ENCRYPTED KYC RECORD
                </Text>
              </View>
            </View>

            {/* Close Button */}
            <AnimatedButton
              title="Close Preview"
              variant="black"
              onPress={() => setPreviewDoc(null)}
              style={{ marginTop: 14 }}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// Backwards-compatible export for existing imports
export const LoanApplicationForm: React.FC<{
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}> = ({ onSubmitSuccess, onCancel }) => {
  return (
    <KycDocumentUploadForm
      onSubmitSuccess={() => {
        if (onSubmitSuccess) onSubmitSuccess();
      }}
      onCancel={onCancel}
    />
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  guidanceCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  guidanceTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  guidanceSubtitle: {
    fontSize: 12.5,
    lineHeight: 17,
    marginTop: 2,
  },
  clientProfileStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  clientCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
    textAlign: 'center',
    includeFontPadding: false,
  },
  clientValue: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    includeFontPadding: false,
  },
  stripDivider: {
    width: 1,
    height: 22,
  },
  documentList: {
    gap: 14,
    marginBottom: 16,
  },
  docCard: {
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  docHeaderRow: {
    marginBottom: 10,
  },
  docBadgeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  docNumBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  docNumText: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  docTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  docName: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    flex: 1,
    marginRight: 8,
  },
  mandatoryBadge: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mandatoryText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  optionalBadge: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionalText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  docDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  uploadedInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  fileIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileNameText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  fileSizeText: {
    fontSize: 11,
    marginTop: 2,
  },
  fileActions: {
    flexDirection: 'row',
    gap: 6,
  },
  smallActionBtn: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallActionText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  uploadTriggerBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    gap: 4,
  },
  uploadTriggerTitle: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    includeFontPadding: false,
  },
  uploadTriggerSub: {
    fontSize: 11,
    textAlign: 'center',
    includeFontPadding: false,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
    gap: 10,
  },
  securityNoteText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
  },
  ctaRow: {
    gap: 10,
  },
  submitBtn: {
    width: '100%',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
  },

  // Picker Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    padding: 24,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  pickerSubtitle: {
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  pickerOptionsList: {
    gap: 10,
    marginBottom: 16,
  },
  pickerOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  pickerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerOptionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  pickerOptionDesc: {
    fontSize: 11.5,
    marginTop: 2,
  },
  pickerCancelBtn: {
    alignItems: 'center',
    paddingVertical: 13,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
  },
  pickerCancelText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Preview Modal
  previewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  previewModalCard: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  previewModalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  previewModalSub: {
    fontSize: 11.5,
    marginTop: 2,
  },
  previewCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCanvas: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
  },
  certificateHeader: {
    alignItems: 'center',
    marginBottom: 14,
  },
  certOrgText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 6,
    textAlign: 'center',
    includeFontPadding: false,
  },
  certSubText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 2,
    textAlign: 'center',
    includeFontPadding: false,
  },
  certBody: {
    width: '100%',
    gap: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom: 14,
  },
  certRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  certLabel: {
    fontSize: 12,
  },
  certValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  certSeal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    borderWidth: 1.5,
    gap: 6,
  },
  certSealText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});

