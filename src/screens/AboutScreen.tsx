import React, {useCallback, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {ArrowLeft, Copy, Home, Share2} from 'lucide-react-native';
import {assets} from '../assets';
import AppShell from '../components/AppShell';
import ContentSheet from '../components/ContentSheet';
import IconButton from '../components/IconButton';
import InlineNotice from '../components/InlineNotice';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import SettingsRow from '../components/SettingsRow';
import {APP_PACKAGE, APP_VERSION, PRIVACY_VERSION} from '../constants/config';
import {MODULE_W, theme} from '../constants/theme';
import {copyFeedback, shareFeedback} from '../services/UserShare';

export type AboutScreenProps = {
  reducedMotion: boolean;
  onBack: () => void;
  onHome: () => void;
};

type SheetId = 'assumptions' | 'privacy' | 'contact' | null;

const ASSUMPTIONS_TEXT =
  'Scope: general-purpose HSS twist drills.\n\n' +
  'Material cutting-speed bands (surface feet per minute):\n' +
  'Mild steel, 0.2-0.3% carbon: 80-110\n' +
  'Stainless steel, general reference: 30-50\n' +
  'Aluminum, common alloys: 200-300\n' +
  'Brass / bronze, ordinary grades: 150-300\n' +
  'Soft cast iron, not chilled iron: 75-125\n\n' +
  'Spindle speed n = 1000 x Vc / (pi x D), with Vc in m/min and D in mm.\n\n' +
  'Tap drill sizes are for cutting taps. Forming taps need their own data and ' +
  'are not covered.\n\n' +
  'Sources: Norseman drill feeds and speeds reference; Sandvik Coromant ' +
  'drilling formulas; Guhring tap drill and decimal reference.';

const PRIVACY_TEXT =
  'Drill Bit Chart stores your favorites, unit preferences and last calculator ' +
  'inputs on your device. The app does not collect or transmit personal ' +
  'information and includes no account, advertising, analytics or tracking ' +
  'service. Reference tables are bundled with the app. You can remove favorites ' +
  'in Settings. Android app storage controls or uninstalling the app remove all ' +
  'stored app data. App-managed cloud backup and device transfer are disabled. ' +
  'Feedback leaves the app only when you choose to share it through another ' +
  'app; that app handles the shared text under its own policy.';

const MAX_FEEDBACK = 2000;

export default function AboutScreen({reducedMotion, onBack, onHome}: AboutScreenProps) {
  const [sheet, setSheet] = useState<SheetId>(null);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const openAssumptions = useCallback(() => setSheet('assumptions'), []);
  const openPrivacy = useCallback(() => setSheet('privacy'), []);
  const openContact = useCallback(() => {
    setStatus(null);
    setSheet('contact');
  }, []);
  const closeSheet = useCallback(() => setSheet(null), []);

  const handleDraft = useCallback((text: string) => {
    setDraft(text.slice(0, MAX_FEEDBACK));
    setStatus(null);
  }, []);

  const body =
    draft.trim() +
    '\n\n---\nDrill Bit Chart ' +
    APP_VERSION +
    '\n' +
    APP_PACKAGE;

  const handleCopy = useCallback(() => {
    const ok = copyFeedback(body);
    setStatus(ok ? 'Feedback copied.' : 'Copy is unavailable on this device.');
  }, [body]);

  const handleShare = useCallback(() => {
    shareFeedback(body).then(ok => {
      if (!ok) {
        setStatus('Sharing is unavailable. You can still copy the feedback.');
      }
    });
  }, [body]);

  const canSend = draft.trim().length > 0;

  return (
    <AppShell
      variant="about"
      title="About"
      reducedMotion={reducedMotion}
      leftSlot={<IconButton Icon={ArrowLeft} label="Back" onPress={onBack} />}
      rightSlot={<IconButton Icon={Home} label="Home" onPress={onHome} />}>
      <ScrollView
        style={styles.region}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.module}>
          <View style={styles.brandCard}>
            <Image
              source={assets.logo}
              style={styles.logo}
              resizeMode="contain"
              accessible={false}
            />
            <View style={styles.brandText}>
              <Text style={styles.brandTitle} numberOfLines={2}>
                Drill Bit Chart
              </Text>
              <Text style={styles.brandMeta} numberOfLines={1}>
                Version {APP_VERSION}
              </Text>
              <Text style={styles.brandMeta} numberOfLines={1}>
                {APP_PACKAGE}
              </Text>
            </View>
          </View>

          <Text style={styles.purpose}>
            A drill speed and size reference for quick workshop lookups.
          </Text>

          <View style={styles.card}>
            <SettingsRow
              title="Reference assumptions"
              detail="Cutting speeds, formula and scope"
              control="action"
              onChange={openAssumptions}
            />
            <View style={styles.divider} />
            <SettingsRow
              title="Privacy policy"
              detail={PRIVACY_VERSION}
              control="action"
              onChange={openPrivacy}
            />
            <View style={styles.divider} />
            <SettingsRow
              title="Contact & feedback"
              detail="Choose your contact app and recipient"
              control="action"
              onChange={openContact}
            />
          </View>
        </View>
      </ScrollView>

      <ContentSheet
        title="Reference assumptions"
        open={sheet === 'assumptions'}
        onClose={closeSheet}
        footer={<SecondaryButton label="CLOSE" onPress={closeSheet} />}>
        <ScrollView style={styles.sheetScroll}>
          <Text style={styles.sheetBody}>{ASSUMPTIONS_TEXT}</Text>
        </ScrollView>
      </ContentSheet>

      <ContentSheet
        title="Privacy policy"
        open={sheet === 'privacy'}
        onClose={closeSheet}
        footer={<SecondaryButton label="CLOSE" onPress={closeSheet} />}>
        <ScrollView style={styles.sheetScroll}>
          <Text style={styles.sheetMeta}>{PRIVACY_VERSION}</Text>
          <Text style={styles.sheetBody}>{PRIVACY_TEXT}</Text>
        </ScrollView>
      </ContentSheet>

      <ContentSheet
        title="Contact & feedback"
        open={sheet === 'contact'}
        onClose={closeSheet}
        footer={
          <View style={styles.sheetActions}>
            <SecondaryButton
              label="COPY FEEDBACK"
              Icon={Copy}
              onPress={handleCopy}
              disabled={!canSend}
            />
            <PrimaryButton
              label="SHARE FEEDBACK"
              Icon={Share2}
              onPress={handleShare}
              disabled={!canSend}
            />
          </View>
        }>
        <Text style={styles.sheetMeta}>
          Choose your contact app and recipient. Nothing is sent automatically.
        </Text>
        <TextInput
          value={draft}
          onChangeText={handleDraft}
          multiline
          textAlignVertical="top"
          placeholder="What would you change?"
          placeholderTextColor={theme.colors.text.tertiary}
          accessibilityLabel="Feedback"
          style={styles.composer}
          maxLength={MAX_FEEDBACK}
        />
        <Text style={styles.counter}>
          {draft.length} / {MAX_FEEDBACK}
        </Text>
        {status ? <InlineNotice text={status} tone="information" compact /> : null}
      </ContentSheet>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  region: {flex: 1},
  content: {alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16},
  module: {width: MODULE_W, gap: 12},
  brandCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: theme.radius.feature,
    padding: 16,
    backgroundColor: '#FFFFFFD9',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    shadowColor: theme.shadows.card.shadowColor,
    shadowOffset: theme.shadows.card.shadowOffset,
    shadowOpacity: theme.shadows.card.shadowOpacity,
    shadowRadius: theme.shadows.card.shadowRadius,
    elevation: theme.shadows.card.elevation,
  },
  logo: {width: 64, height: 64},
  brandText: {flex: 1, gap: 2},
  brandTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  brandMeta: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.tertiary,
  },
  purpose: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  card: {
    width: '100%',
    borderRadius: theme.radius.card,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: '#FFFFFFD9',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    shadowColor: theme.shadows.card.shadowColor,
    shadowOffset: theme.shadows.card.shadowOffset,
    shadowOpacity: theme.shadows.card.shadowOpacity,
    shadowRadius: theme.shadows.card.shadowRadius,
    elevation: theme.shadows.card.elevation,
  },
  divider: {height: 1, backgroundColor: theme.colors.ui.hairline},
  sheetScroll: {maxHeight: 420},
  sheetBody: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: theme.colors.text.secondary,
  },
  sheetMeta: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text.tertiary,
    marginBottom: 8,
  },
  composer: {
    minHeight: 160,
    borderRadius: theme.radius.well,
    padding: 14,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.primary,
    backgroundColor: '#FFFFFFCC',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  counter: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.tertiary,
    textAlign: 'right',
    marginTop: 6,
    marginBottom: 8,
  },
  sheetActions: {gap: 12},
});
