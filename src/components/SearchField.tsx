import React from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {Search, X} from 'lucide-react-native';
import {theme} from '../constants/theme';

export type SearchFieldProps = {
  value: string;
  placeholder: string;
  onChange: (text: string) => void;
  onClear: () => void;
  accessibilityLabel: string;
};

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

/** 56dp search well. Filtering itself is debounced by the owning screen. */
function SearchFieldBase({
  value,
  placeholder,
  onChange,
  onClear,
  accessibilityLabel,
}: SearchFieldProps) {
  return (
    <View style={styles.field}>
      <Search size={24} color={theme.colors.text.tertiary} strokeWidth={1.8} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="characters"
        accessibilityLabel={accessibilityLabel}
        returnKeyType="search"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={onClear}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          style={styles.clear}>
          <X size={24} color={theme.colors.text.primary} strokeWidth={2} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radius.well,
    backgroundColor: '#FFFFFFCC',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: theme.colors.text.primary,
    padding: 0,
  },
  clear: {width: 40, height: 40, alignItems: 'center', justifyContent: 'center'},
});

export const SearchField = React.memo(SearchFieldBase);
export default SearchField;
