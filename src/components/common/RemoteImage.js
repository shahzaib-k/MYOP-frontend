import { memo, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/theme";

/**
 * Image with loading and failure states. Food and category images are
 * admin-entered URLs, so a missing or broken link is a normal case — it falls
 * back to a neutral icon tile rather than an empty box.
 */
const RemoteImage = ({
  uri,
  style,
  iconName = "fast-food-outline",
  iconSize = 26,
  resizeMode = "cover",
}) => {
  const [isLoading, setIsLoading] = useState(Boolean(uri));
  const [hasFailed, setHasFailed] = useState(false);

  const showPlaceholder = !uri || hasFailed;

  if (showPlaceholder) {
    return (
      <View style={[styles.placeholder, style]}>
        <Ionicons name={iconName} size={iconSize} color={colors.textMuted} />
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, style]}>
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode={resizeMode}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setHasFailed(true);
          setIsLoading(false);
        }}
      />

      {isLoading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={colors.textMuted} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.skeleton,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    backgroundColor: colors.surfaceSunken,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.skeleton,
  },
});

export default memo(RemoteImage);
