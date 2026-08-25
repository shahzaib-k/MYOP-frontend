import { memo, useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radii, shadows, spacing, typography } from "../../constants/theme";

const THUMB_INSET = 3;

/**
 * Segmented filter control with a sliding pill indicator, replacing the plain
 * ChipGroup on the orders screen. `options` is [{ label, value, count? }].
 */
const OrderFilterTabs = ({ options, selectedValue, onSelect }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === selectedValue),
    0
  );
  const segmentWidth = containerWidth / options.length;

  useEffect(() => {
    if (containerWidth === 0) {
      return;
    }

    Animated.spring(translateX, {
      toValue: selectedIndex * segmentWidth + THUMB_INSET,
      useNativeDriver: true,
      friction: 9,
      tension: 70,
    }).start();
  }, [selectedIndex, segmentWidth, containerWidth, translateX]);

  return (
    <View
      style={styles.container}
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
    >
      {containerWidth > 0 ? (
        <Animated.View
          style={[
            styles.thumb,
            {
              width: segmentWidth - THUMB_INSET * 2,
              transform: [{ translateX }],
            },
          ]}
        />
      ) : null}

      {options.map((option) => {
        const isSelected = option.value === selectedValue;

        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={styles.segment}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]} numberOfLines={1}>
              {option.label}
            </Text>
            {option.count !== undefined ? (
              <View style={[styles.countBadge, isSelected && styles.countBadgeSelected]}>
                <Text style={[styles.countText, isSelected && styles.countTextSelected]}>
                  {option.count}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surfaceSunken,
    borderRadius: radii.pill,
    padding: THUMB_INSET,
    position: "relative",
  },
  thumb: {
    position: "absolute",
    top: THUMB_INSET,
    bottom: THUMB_INSET,
    left: 0,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    ...shadows.soft,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  label: {
    ...typography.captionStrong,
    color: colors.textMuted,
  },
  labelSelected: {
    color: colors.text,
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceSunken,
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeSelected: {
    backgroundColor: colors.primarySoft,
  },
  countText: {
    ...typography.label,
    fontSize: 10,
    letterSpacing: 0,
    color: colors.textMuted,
  },
  countTextSelected: {
    color: colors.primaryDark,
  },
});

export default memo(OrderFilterTabs);
