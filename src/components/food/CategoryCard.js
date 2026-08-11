import { memo, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../common/Card";
import RemoteImage from "../common/RemoteImage";
import { colors, radii, spacing, typography } from "../../constants/theme";

/**
 * Grid tile for a food category. Sized by the parent through `style` so the
 * Categories screen can pick its own column count responsively.
 */
const CategoryCard = ({ category, onPress, style }) => {
  const handlePress = useCallback(() => onPress(category), [onPress, category]);

  return (
    <Card
      onPress={handlePress}
      padded={false}
      style={[styles.card, style]}
      accessibilityLabel={`${category.name} category`}
    >
      <RemoteImage
        uri={category.image}
        style={styles.image}
        iconName="restaurant-outline"
        iconSize={30}
      />

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {category.name}
        </Text>

        {category.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {category.description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.action}>Browse</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.primary} />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
  },
  image: {
    width: "100%",
    height: 104,
  },
  body: {
    padding: spacing.md,
    gap: spacing.xxs,
  },
  name: {
    ...typography.subheading,
    color: colors.text,
  },
  description: {
    ...typography.caption,
    color: colors.textMuted,
    minHeight: 36,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  action: {
    ...typography.captionStrong,
    color: colors.primary,
  },
});

export default memo(CategoryCard);
