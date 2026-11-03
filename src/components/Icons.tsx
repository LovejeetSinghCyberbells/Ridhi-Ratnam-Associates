import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

/**
 * Clean, lightweight, dependency-free vector icons built with React Native primitives.
 * Replaces emojis across all auth and dashboard screens for a crisp, professional banking finish.
 */

export const EyeIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={[
          styles.eyeOutline,
          {
            width: size,
            height: Math.round(size * 0.65),
            borderRadius: Math.round(size * 0.35),
            borderColor: color,
          },
        ]}
      >
        <View
          style={[
            styles.eyePupil,
            {
              width: Math.round(size * 0.32),
              height: Math.round(size * 0.32),
              borderRadius: Math.round(size * 0.16),
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

export const EyeOffIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={[
          styles.eyeOutline,
          {
            width: size,
            height: Math.round(size * 0.65),
            borderRadius: Math.round(size * 0.35),
            borderColor: color,
          },
        ]}
      >
        <View
          style={[
            styles.eyePupil,
            {
              width: Math.round(size * 0.3),
              height: Math.round(size * 0.3),
              borderRadius: Math.round(size * 0.15),
              backgroundColor: color,
            },
          ]}
        />
      </View>
      {/* Diagonal slash */}
      <View
        style={[
          styles.diagonalSlash,
          {
            width: Math.round(size * 1.15),
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

export const UserIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  const headSize = Math.round(size * 0.42);
  const bodyWidth = Math.round(size * 0.85);
  const bodyHeight = Math.round(size * 0.45);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Head */}
      <View
        style={{
          width: headSize,
          height: headSize,
          borderRadius: headSize / 2,
          borderWidth: 1.6,
          borderColor: color,
          marginBottom: 1,
        }}
      />
      {/* Shoulders */}
      <View
        style={{
          width: bodyWidth,
          height: bodyHeight,
          borderTopLeftRadius: bodyWidth / 2,
          borderTopRightRadius: bodyWidth / 2,
          borderWidth: 1.6,
          borderBottomWidth: 0,
          borderColor: color,
        }}
      />
    </View>
  );
};

export const UserRoundIcon: React.FC<IconProps> = ({ size = 20, color = '#64748B', style }) => {
  const headSize = Math.round(size * 0.38);
  const bodyWidth = Math.round(size * 0.72);
  const bodyHeight = Math.round(size * 0.38);

  return (
    <View
      style={[
        styles.center,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.6,
          borderColor: color,
          overflow: 'hidden',
          paddingTop: 1,
        },
        style,
      ]}
    >
      <View
        style={{
          width: headSize,
          height: headSize,
          borderRadius: headSize / 2,
          borderWidth: 1.4,
          borderColor: color,
          marginBottom: 1,
        }}
      />
      <View
        style={{
          width: bodyWidth,
          height: bodyHeight,
          borderTopLeftRadius: bodyWidth / 2,
          borderTopRightRadius: bodyWidth / 2,
          borderWidth: 1.4,
          borderColor: color,
        }}
      />
    </View>
  );
};

export const BriefcaseIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  const width = Math.round(size * 0.9);
  const height = Math.round(size * 0.65);
  const handleWidth = Math.round(size * 0.4);
  const handleHeight = Math.round(size * 0.22);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Handle */}
      <View
        style={{
          width: handleWidth,
          height: handleHeight,
          borderTopLeftRadius: 2.5,
          borderTopRightRadius: 2.5,
          borderWidth: 1.5,
          borderBottomWidth: 0,
          borderColor: color,
          marginBottom: -1,
        }}
      />
      {/* Case body */}
      <View
        style={{
          width,
          height,
          borderRadius: 3,
          borderWidth: 1.6,
          borderColor: color,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: width - 4,
            height: 1,
            backgroundColor: color,
            opacity: 0.7,
          }}
        />
      </View>
    </View>
  );
};

export const MailIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  const width = Math.round(size * 0.92);
  const height = Math.round(size * 0.68);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width,
          height,
          borderRadius: 3,
          borderWidth: 1.6,
          borderColor: color,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: -height * 0.45,
            left: (width - height) / 2 - 1.6,
            width: height,
            height: height,
            borderBottomWidth: 1.5,
            borderRightWidth: 1.5,
            borderColor: color,
            transform: [{ rotate: '45deg' }],
          }}
        />
      </View>
    </View>
  );
};

export const PhoneIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  const width = Math.round(size * 0.65);
  const height = Math.round(size * 0.95);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width,
          height,
          borderRadius: 3.5,
          borderWidth: 1.6,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 2,
        }}
      >
        <View
          style={{
            width: Math.round(width * 0.4),
            height: 1,
            backgroundColor: color,
            borderRadius: 0.5,
          }}
        />
        <View
          style={{
            width: Math.round(width * 0.3),
            height: 1,
            backgroundColor: color,
            borderRadius: 0.5,
          }}
        />
      </View>
    </View>
  );
};

export const LockIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  const shackleWidth = Math.round(size * 0.5);
  const shackleHeight = Math.round(size * 0.42);
  const bodyWidth = Math.round(size * 0.82);
  const bodyHeight = Math.round(size * 0.55);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: shackleWidth,
          height: shackleHeight,
          borderTopLeftRadius: shackleWidth / 2,
          borderTopRightRadius: shackleWidth / 2,
          borderWidth: 1.6,
          borderBottomWidth: 0,
          borderColor: color,
          marginBottom: -1,
        }}
      />
      <View
        style={{
          width: bodyWidth,
          height: bodyHeight,
          borderRadius: 2.5,
          borderWidth: 1.6,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 2.5,
            height: 2.5,
            borderRadius: 1.25,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const IdBadgeIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  const width = Math.round(size * 0.75);
  const height = Math.round(size * 0.95);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width,
          height,
          borderRadius: 3,
          borderWidth: 1.6,
          borderColor: color,
          alignItems: 'center',
          paddingTop: 2,
          paddingHorizontal: 2,
        }}
      >
        <View
          style={{
            width: Math.round(width * 0.4),
            height: 1.5,
            borderRadius: 1,
            backgroundColor: color,
            marginBottom: 2,
          }}
        />
        <View
          style={{
            width: Math.round(width * 0.45),
            height: Math.round(width * 0.45),
            borderRadius: 1.5,
            borderWidth: 1,
            borderColor: color,
            marginBottom: 2,
          }}
        />
        <View
          style={{
            width: '80%',
            height: 1,
            backgroundColor: color,
            marginBottom: 1.5,
          }}
        />
        <View
          style={{
            width: '60%',
            height: 1,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const BuildingIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  const width = Math.round(size * 0.85);
  const height = Math.round(size * 0.95);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width,
          height,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          borderWidth: 1.6,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'space-evenly',
          paddingVertical: 2,
        }}
      >
        <View style={{ flexDirection: 'row', gap: 2 }}>
          <View style={{ width: 2, height: 2, backgroundColor: color }} />
          <View style={{ width: 2, height: 2, backgroundColor: color }} />
        </View>
        <View style={{ flexDirection: 'row', gap: 2 }}>
          <View style={{ width: 2, height: 2, backgroundColor: color }} />
          <View style={{ width: 2, height: 2, backgroundColor: color }} />
        </View>
        <View style={{ width: 3, height: 3, backgroundColor: color }} />
      </View>
    </View>
  );
};

export const CheckIcon: React.FC<IconProps> = ({ size = 16, color = '#10B981', style }) => {
  const width = Math.round(size * 0.7);
  const height = Math.round(size * 0.4);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width,
          height,
          borderLeftWidth: 2.2,
          borderBottomWidth: 2.2,
          borderColor: color,
          transform: [{ rotate: '-45deg' }, { translateY: -1 }],
        }}
      />
    </View>
  );
};

export const AlertCircleIcon: React.FC<IconProps> = ({ size = 16, color = '#DC2626', style }) => {
  return (
    <View
      style={[
        styles.center,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.6,
          borderColor: color,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 1.8,
          height: Math.round(size * 0.35),
          backgroundColor: color,
          borderRadius: 1,
          marginBottom: 1.5,
        }}
      />
      <View
        style={{
          width: 1.8,
          height: 1.8,
          borderRadius: 0.9,
          backgroundColor: color,
        }}
      />
    </View>
  );
};

export const CrossIcon: React.FC<IconProps> = ({ size = 16, color = '#EF4444', style }) => {
  const barLength = Math.round(size * 0.75);
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          position: 'absolute',
          width: barLength,
          height: 1.8,
          backgroundColor: color,
          borderRadius: 1,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: barLength,
          height: 1.8,
          backgroundColor: color,
          borderRadius: 1,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
};

export const ClockIcon: React.FC<IconProps> = ({ size = 16, color = '#F59E0B', style }) => {
  return (
    <View
      style={[
        styles.center,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.6,
          borderColor: color,
        },
        style,
      ]}
    >
      {/* Hour hand */}
      <View
        style={{
          position: 'absolute',
          top: Math.round(size * 0.22),
          width: 1.6,
          height: Math.round(size * 0.3),
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      {/* Minute hand */}
      <View
        style={{
          position: 'absolute',
          left: Math.round(size * 0.48),
          top: Math.round(size * 0.44),
          width: Math.round(size * 0.26),
          height: 1.6,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  );
};

export const BellIcon: React.FC<
  IconProps & { hasNotification?: boolean; badgeCount?: number }
> = ({ size = 20, color = '#0D0E12', hasNotification = false, style }) => {
  const bellWidth = Math.round(size * 0.72);
  const bellHeight = Math.round(size * 0.65);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Bell body */}
      <View
        style={{
          width: bellWidth,
          height: bellHeight,
          borderTopLeftRadius: bellWidth / 2,
          borderTopRightRadius: bellWidth / 2,
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          borderWidth: 1.7,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {/* Tiny top loop */}
        <View
          style={{
            position: 'absolute',
            top: -3,
            width: 4,
            height: 3,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            borderWidth: 1.2,
            borderBottomWidth: 0,
            borderColor: color,
          }}
        />
      </View>
      {/* Rim / base line */}
      <View
        style={{
          width: bellWidth + 4,
          height: 1.6,
          backgroundColor: color,
          borderRadius: 1,
          marginTop: -1,
        }}
      />
      {/* Clapper */}
      <View
        style={{
          width: 3.5,
          height: 2.5,
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          backgroundColor: color,
          marginTop: 0.5,
        }}
      />

      {/* Notification Dot */}
      {hasNotification && (
        <View
          style={{
            position: 'absolute',
            top: 1,
            right: 1,
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: '#DC2626',
            borderWidth: 1.2,
            borderColor: '#FFFFFF',
          }}
        />
      )}
    </View>
  );
};

export const LayoutDashboardIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#64748B',
  style,
}) => {
  const quadSize = Math.round((size - 4) / 2);
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          justifyContent: 'space-between',
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View
          style={{
            width: quadSize,
            height: quadSize,
            borderRadius: 2.5,
            borderWidth: 1.6,
            borderColor: color,
          }}
        />
        <View
          style={{
            width: quadSize,
            height: quadSize,
            borderRadius: 2.5,
            borderWidth: 1.6,
            borderColor: color,
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View
          style={{
            width: quadSize,
            height: quadSize,
            borderRadius: 2.5,
            borderWidth: 1.6,
            borderColor: color,
          }}
        />
        <View
          style={{
            width: quadSize,
            height: quadSize,
            borderRadius: 2.5,
            borderWidth: 1.6,
            borderColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const FilesIcon: React.FC<IconProps> = ({ size = 20, color = '#64748B', style }) => {
  const width = Math.round(size * 0.7);
  const height = Math.round(size * 0.82);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Background layer */}
      <View
        style={{
          position: 'absolute',
          top: 1,
          right: 2,
          width: width,
          height: height,
          borderRadius: 2.5,
          borderWidth: 1.4,
          borderColor: color,
          opacity: 0.5,
        }}
      />
      {/* Front layer */}
      <View
        style={{
          position: 'absolute',
          bottom: 1,
          left: 2,
          width: width,
          height: height,
          borderRadius: 2.5,
          borderWidth: 1.6,
          borderColor: color,
          backgroundColor: '#FFFFFF',
          padding: 2,
          justifyContent: 'space-evenly',
        }}
      >
        <View style={{ width: '60%', height: 1.2, backgroundColor: color }} />
        <View style={{ width: '80%', height: 1.2, backgroundColor: color }} />
        <View style={{ width: '50%', height: 1.2, backgroundColor: color }} />
      </View>
    </View>
  );
};

export const HistoryIcon: React.FC<IconProps> = ({ size = 20, color = '#64748B', style }) => {
  return (
    <View
      style={[
        styles.center,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.6,
          borderColor: color,
        },
        style,
      ]}
    >
      {/* Clock hands */}
      <View
        style={{
          position: 'absolute',
          top: Math.round(size * 0.22),
          width: 1.6,
          height: Math.round(size * 0.3),
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: Math.round(size * 0.48),
          top: Math.round(size * 0.44),
          width: Math.round(size * 0.24),
          height: 1.6,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  );
};

export const ChevronRightIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#94A3B8',
  style,
}) => {
  const armSize = Math.round(size * 0.38);
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: armSize,
          height: armSize,
          borderTopWidth: 2,
          borderRightWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }, { translateX: -1 }],
        }}
      />
    </View>
  );
};

export const ChevronDownIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#94A3B8',
  style,
}) => {
  const armSize = Math.round(size * 0.38);
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: armSize,
          height: armSize,
          borderTopWidth: 2,
          borderRightWidth: 2,
          borderColor: color,
          transform: [{ rotate: '135deg' }, { translateY: -1 }],
        }}
      />
    </View>
  );
};

export const ChevronUpIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#94A3B8',
  style,
}) => {
  const armSize = Math.round(size * 0.38);
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: armSize,
          height: armSize,
          borderTopWidth: 2,
          borderRightWidth: 2,
          borderColor: color,
          transform: [{ rotate: '-45deg' }, { translateY: 1 }],
        }}
      />
    </View>
  );
};

export const TrendingUpIcon: React.FC<IconProps> = ({ size = 16, color = '#10B981', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Slanted Arrow Stem */}
      <View
        style={{
          width: Math.round(size * 0.75),
          height: 1.8,
          backgroundColor: color,
          borderRadius: 1,
          transform: [{ rotate: '-35deg' }],
        }}
      />
      {/* Arrow Tip */}
      <View
        style={{
          position: 'absolute',
          top: 2,
          right: 2,
          width: 5,
          height: 5,
          borderTopWidth: 2,
          borderRightWidth: 2,
          borderColor: color,
        }}
      />
    </View>
  );
};

export const FilterIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: Math.round(size * 0.8),
          height: 1.6,
          backgroundColor: color,
          borderRadius: 1,
          marginBottom: 3,
        }}
      />
      <View
        style={{
          width: Math.round(size * 0.55),
          height: 1.6,
          backgroundColor: color,
          borderRadius: 1,
          marginBottom: 3,
        }}
      />
      <View
        style={{
          width: Math.round(size * 0.3),
          height: 1.6,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  );
};

export const SearchIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  const glassSize = Math.round(size * 0.58);
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: glassSize,
          height: glassSize,
          borderRadius: glassSize / 2,
          borderWidth: 1.6,
          borderColor: color,
          marginBottom: -1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 2,
          right: 3,
          width: Math.round(size * 0.35),
          height: 1.6,
          backgroundColor: color,
          borderRadius: 1,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
};

export const HouseIcon: React.FC<IconProps> = ({ size = 20, color = '#64748B', style }) => {
  const width = Math.round(size * 0.85);
  const height = Math.round(size * 0.85);
  const roofHeight = Math.round(height * 0.45);
  const baseWidth = Math.round(width * 0.75);
  const baseHeight = height - roofHeight + 1;

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Roof peak */}
      <View
        style={{
          width: Math.round(width * 0.65),
          height: Math.round(width * 0.65),
          borderTopWidth: 1.8,
          borderLeftWidth: 1.8,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          position: 'absolute',
          top: 2,
        }}
      />
      {/* Base walls */}
      <View
        style={{
          position: 'absolute',
          bottom: 2,
          width: baseWidth,
          height: baseHeight,
          borderWidth: 1.7,
          borderTopWidth: 0,
          borderColor: color,
          borderBottomLeftRadius: 2.5,
          borderBottomRightRadius: 2.5,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        {/* Door */}
        <View
          style={{
            width: Math.round(baseWidth * 0.35),
            height: Math.round(baseHeight * 0.55),
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            borderWidth: 1.5,
            borderBottomWidth: 0,
            borderColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const FilePlusIcon: React.FC<IconProps> = ({ size = 20, color = '#64748B', style }) => {
  const width = Math.round(size * 0.75);
  const height = Math.round(size * 0.9);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width,
          height,
          borderRadius: 3,
          borderWidth: 1.7,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Plus sign horizontal */}
        <View
          style={{
            width: Math.round(width * 0.45),
            height: 1.8,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
        {/* Plus sign vertical */}
        <View
          style={{
            position: 'absolute',
            width: 1.8,
            height: Math.round(width * 0.45),
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
      </View>
    </View>
  );
};

export const MessageSquareIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  const width = Math.round(size * 0.85);
  const height = Math.round(size * 0.7);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width,
          height,
          borderRadius: 3.5,
          borderWidth: 1.6,
          borderColor: color,
          position: 'relative',
        }}
      >
        {/* Speech tail */}
        <View
          style={{
            position: 'absolute',
            bottom: -3.5,
            left: 3,
            width: 4,
            height: 4,
            borderLeftWidth: 1.6,
            borderBottomWidth: 1.6,
            borderColor: color,
            backgroundColor: '#FFFFFF',
            transform: [{ rotate: '45deg' }],
          }}
        />
      </View>
    </View>
  );
};

export const ShieldIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  const width = Math.round(size * 0.8);
  const height = Math.round(size * 0.95);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width,
          height,
          borderTopLeftRadius: width / 2,
          borderTopRightRadius: width / 2,
          borderBottomLeftRadius: width * 0.6,
          borderBottomRightRadius: width * 0.6,
          borderWidth: 1.6,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ width: 1.5, height: height * 0.5, backgroundColor: color }} />
      </View>
    </View>
  );
};

export const HeadphonesIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  const width = Math.round(size * 0.85);
  const height = Math.round(size * 0.85);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Headband */}
      <View
        style={{
          position: 'absolute',
          top: 1,
          width,
          height: Math.round(height * 0.65),
          borderTopLeftRadius: width / 2,
          borderTopRightRadius: width / 2,
          borderWidth: 1.6,
          borderBottomWidth: 0,
          borderColor: color,
        }}
      />
      {/* Left earpad */}
      <View
        style={{
          position: 'absolute',
          bottom: 2,
          left: (size - width) / 2 - 1,
          width: 3.5,
          height: 6,
          borderRadius: 2,
          backgroundColor: color,
        }}
      />
      {/* Right earpad */}
      <View
        style={{
          position: 'absolute',
          bottom: 2,
          right: (size - width) / 2 - 1,
          width: 3.5,
          height: 6,
          borderRadius: 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
};

export const ChevronLeftIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#0D0E12',
  style,
}) => {
  const armSize = Math.round(size * 0.4);
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: armSize,
          height: armSize,
          borderBottomWidth: 2,
          borderLeftWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }, { translateX: 1 }],
        }}
      />
    </View>
  );
};

export const DownloadIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  const width = Math.round(size * 0.8);
  const height = Math.round(size * 0.85);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Down arrow stem */}
      <View
        style={{
          position: 'absolute',
          top: 2,
          width: 1.8,
          height: Math.round(height * 0.6),
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      {/* Down arrow tip */}
      <View
        style={{
          position: 'absolute',
          top: Math.round(height * 0.35),
          width: 6,
          height: 6,
          borderBottomWidth: 2,
          borderRightWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
      {/* Tray */}
      <View
        style={{
          position: 'absolute',
          bottom: 2,
          width,
          height: 4,
          borderBottomWidth: 1.8,
          borderLeftWidth: 1.8,
          borderRightWidth: 1.8,
          borderColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  );
};

export const FileTextIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  const width = Math.round(size * 0.75);
  const height = Math.round(size * 0.9);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width,
          height,
          borderRadius: 2.5,
          borderWidth: 1.6,
          borderColor: color,
          padding: 2.5,
          justifyContent: 'space-evenly',
        }}
      >
        <View style={{ width: '50%', height: 1.2, backgroundColor: color }} />
        <View style={{ width: '80%', height: 1.2, backgroundColor: color }} />
        <View style={{ width: '65%', height: 1.2, backgroundColor: color }} />
      </View>
    </View>
  );
};

export const UploadCloudIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  const width = Math.round(size * 0.8);
  const height = Math.round(size * 0.85);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Up arrow stem */}
      <View
        style={{
          position: 'absolute',
          top: 3,
          width: 1.8,
          height: Math.round(height * 0.55),
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      {/* Up arrow tip */}
      <View
        style={{
          position: 'absolute',
          top: 3,
          width: 6,
          height: 6,
          borderTopWidth: 2,
          borderLeftWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
      {/* Base tray */}
      <View
        style={{
          position: 'absolute',
          bottom: 2,
          width,
          height: 4,
          borderBottomWidth: 1.8,
          borderLeftWidth: 1.8,
          borderRightWidth: 1.8,
          borderColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  );
};

export const LogOutIcon: React.FC<IconProps> = ({ size = 18, color = '#DC2626', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Door frame */}
      <View
        style={{
          position: 'absolute',
          left: 1,
          width: Math.round(size * 0.55),
          height: Math.round(size * 0.8),
          borderTopWidth: 1.8,
          borderBottomWidth: 1.8,
          borderLeftWidth: 1.8,
          borderColor: color,
          borderRadius: 2,
        }}
      />
      {/* Arrow stem going right */}
      <View
        style={{
          position: 'absolute',
          right: 2,
          width: Math.round(size * 0.5),
          height: 1.8,
          backgroundColor: color,
        }}
      />
      {/* Arrow point */}
      <View
        style={{
          position: 'absolute',
          right: 2,
          width: 5,
          height: 5,
          borderTopWidth: 1.8,
          borderRightWidth: 1.8,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
};

export const SettingsIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: Math.round(size * 0.72),
          height: Math.round(size * 0.72),
          borderRadius: Math.round(size * 0.36),
          borderWidth: 2,
          borderColor: color,
          borderStyle: 'dashed',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: Math.round(size * 0.28),
            height: Math.round(size * 0.28),
            borderRadius: Math.round(size * 0.14),
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const EditIcon: React.FC<IconProps> = ({ size = 16, color = '#64748B', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Pencil shaft */}
      <View
        style={{
          width: Math.round(size * 0.7),
          height: 2.6,
          backgroundColor: color,
          borderRadius: 1,
          transform: [{ rotate: '-45deg' }],
        }}
      />
      {/* Pencil tip point */}
      <View
        style={{
          position: 'absolute',
          bottom: 2,
          left: 2,
          width: 3.5,
          height: 3.5,
          borderBottomWidth: 1.8,
          borderLeftWidth: 1.8,
          borderColor: color,
        }}
      />
    </View>
  );
};

export const HelpCircleIcon: React.FC<IconProps> = ({ size = 18, color = '#64748B', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.6,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: Math.round(size * 0.35),
            height: Math.round(size * 0.3),
            borderTopWidth: 1.6,
            borderRightWidth: 1.6,
            borderLeftWidth: 1.6,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            borderColor: color,
            marginTop: 1,
          }}
        />
        <View
          style={{
            width: 2,
            height: 2,
            borderRadius: 1,
            backgroundColor: color,
            marginTop: 1.5,
          }}
        />
      </View>
    </View>
  );
};

export const SendIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: Math.round(size * 0.65),
          height: Math.round(size * 0.65),
          borderTopWidth: 2,
          borderRightWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }, { translateY: 1 }, { translateX: -1 }],
        }}
      />
    </View>
  );
};

export const SlidersIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Track 1 */}
      <View style={{ width: Math.round(size * 0.85), height: 1.6, backgroundColor: color, marginBottom: 4, position: 'relative' }}>
        <View style={{ position: 'absolute', left: 2, top: -2.7, width: 7, height: 7, borderRadius: 3.5, backgroundColor: color }} />
      </View>
      {/* Track 2 */}
      <View style={{ width: Math.round(size * 0.85), height: 1.6, backgroundColor: color, position: 'relative' }}>
        <View style={{ position: 'absolute', right: 2, top: -2.7, width: 7, height: 7, borderRadius: 3.5, backgroundColor: color }} />
      </View>
    </View>
  );
};

export const PaletteIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: Math.round(size * 0.85),
          height: Math.round(size * 0.85),
          borderRadius: Math.round(size * 0.42),
          borderWidth: 1.6,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', gap: 2, marginBottom: 2 }}>
          <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
          <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
        </View>
        <View style={{ width: 4, height: 4, borderRadius: 2, borderWidth: 1, borderColor: color }} />
      </View>
    </View>
  );
};

export const BookmarkIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: Math.round(size * 0.65),
          height: Math.round(size * 0.85),
          borderWidth: 1.6,
          borderColor: color,
          borderBottomWidth: 0,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          position: 'relative',
        }}
      >
        <View
          style={{
            position: 'absolute',
            bottom: -5,
            left: -1.6,
            right: -1.6,
            height: 6,
            borderLeftWidth: 1.6,
            borderRightWidth: 1.6,
            borderColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const BrainIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: Math.round(size * 0.85),
          height: Math.round(size * 0.75),
          borderRadius: Math.round(size * 0.35),
          borderWidth: 1.6,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ width: 1.6, height: Math.round(size * 0.65), backgroundColor: color }} />
      </View>
    </View>
  );
};

export const CameraIcon: React.FC<IconProps> = ({ size = 16, color = '#0284C7', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: Math.round(size * 0.88),
          height: Math.round(size * 0.68),
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: 3,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: -3,
            left: 2,
            width: 4,
            height: 2,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
        <View
          style={{
            width: Math.round(size * 0.35),
            height: Math.round(size * 0.35),
            borderRadius: Math.round(size * 0.18),
            borderWidth: 1.4,
            borderColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const PlusIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF', style }) => {
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View style={{ position: 'absolute', width: size * 0.75, height: 2, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ position: 'absolute', width: 2, height: size * 0.75, backgroundColor: color, borderRadius: 1 }} />
    </View>
  );
};

export const SolidHomeIcon: React.FC<IconProps> = ({ size = 22, color = '#0D0E12', style }) => {
  const w = size;
  const h = size;
  return (
    <View style={[styles.center, { width: w, height: h }, style]}>
      {/* Roof peak */}
      <View
        style={{
          width: Math.round(w * 0.68),
          height: Math.round(w * 0.68),
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
          borderRadius: 3.5,
          position: 'absolute',
          top: 1,
        }}
      />
      {/* Base block */}
      <View
        style={{
          width: Math.round(w * 0.78),
          height: Math.round(h * 0.52),
          backgroundColor: color,
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
          borderTopLeftRadius: 1,
          borderTopRightRadius: 1,
          position: 'absolute',
          bottom: 1.5,
        }}
      />
    </View>
  );
};

export const ChatDotsIcon: React.FC<IconProps> = ({ size = 22, color = '#FFFFFF', style }) => {
  const w = Math.round(size * 1.05);
  const h = Math.round(size * 0.85);
  return (
    <View style={[styles.center, { width: size + 2, height: size }, style]}>
      {/* Bubble */}
      <View
        style={{
          width: w,
          height: h,
          borderRadius: Math.round(h / 2),
          borderWidth: 1.8,
          borderColor: color,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2.5,
          backgroundColor: 'transparent',
        }}
      >
        <View style={{ width: 2.8, height: 2.8, borderRadius: 1.4, backgroundColor: color }} />
        <View style={{ width: 2.8, height: 2.8, borderRadius: 1.4, backgroundColor: color }} />
        <View style={{ width: 2.8, height: 2.8, borderRadius: 1.4, backgroundColor: color }} />
      </View>
      {/* Bubble tail on bottom left */}
      <View
        style={{
          position: 'absolute',
          bottom: 1,
          left: 3,
          width: 5,
          height: 5,
          borderLeftWidth: 1.8,
          borderBottomWidth: 1.8,
          borderColor: color,
          transform: [{ rotate: '25deg' }],
        }}
      />
    </View>
  );
};

export const SquarePlusIcon: React.FC<IconProps> = ({ size = 22, color = '#FFFFFF', style }) => {
  return (
    <View
      style={[
        styles.center,
        {
          width: size,
          height: size,
          borderRadius: 6.5,
          borderWidth: 1.8,
          borderColor: color,
        },
        style,
      ]}
    >
      {/* Horizontal bar */}
      <View
        style={{
          width: 10,
          height: 1.8,
          backgroundColor: color,
          borderRadius: 1,
          position: 'absolute',
        }}
      />
      {/* Vertical bar */}
      <View
        style={{
          width: 1.8,
          height: 10,
          backgroundColor: color,
          borderRadius: 1,
          position: 'absolute',
        }}
      />
    </View>
  );
};

export const OutlineGearIcon: React.FC<IconProps> = ({ size = 22, color = '#0D0E12', style }) => {
  const toothAngles = [0, 45, 90, 135];
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Gear teeth crosses */}
      {toothAngles.map((angle) => (
        <View
          key={angle}
          style={{
            position: 'absolute',
            width: size * 0.95,
            height: 4.2,
            backgroundColor: color,
            borderRadius: 1.5,
            transform: [{ rotate: `${angle}deg` }],
          }}
        />
      ))}
      {/* Inner body ring */}
      <View
        style={{
          width: size * 0.76,
          height: size * 0.76,
          borderRadius: (size * 0.76) / 2,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1.8,
          borderColor: color,
        }}
      >
        {/* Center hole */}
        <View
          style={{
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: (size * 0.28) / 2,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const LoanDossierIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF', style }) => {
  const width = Math.round(size * 0.78);
  const height = Math.round(size * 0.92);

  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Back page offset */}
      <View
        style={{
          position: 'absolute',
          top: 1,
          right: 1.5,
          width: width - 2,
          height: height - 2,
          borderRadius: 3,
          borderWidth: 1.2,
          borderColor: color,
          opacity: 0.5,
        }}
      />
      {/* Main document page */}
      <View
        style={{
          position: 'absolute',
          bottom: 1,
          left: 1.5,
          width: width - 1,
          height: height - 1,
          borderRadius: 3.5,
          borderWidth: 1.5,
          borderColor: color,
          paddingHorizontal: 2.5,
          paddingVertical: 3,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ width: '45%', height: 1.5, backgroundColor: color, borderRadius: 1 }} />
        <View style={{ width: '85%', height: 1.5, backgroundColor: color, borderRadius: 1 }} />
        <View style={{ width: '65%', height: 1.5, backgroundColor: color, borderRadius: 1 }} />
      </View>
    </View>
  );
};

export const SunIcon: React.FC<IconProps> = ({ size = 18, color = '#F59E0B', style }) => {
  const centerSize = Math.round(size * 0.44);
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      {/* Sun center */}
      <View
        style={{
          width: centerSize,
          height: centerSize,
          borderRadius: centerSize / 2,
          backgroundColor: color,
        }}
      />
      {/* Sun cross rays */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: 1.5,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          height: size,
          width: 1.5,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      {/* Diagonal rays */}
      <View
        style={{
          position: 'absolute',
          width: Math.round(size * 0.8),
          height: 1.4,
          backgroundColor: color,
          borderRadius: 1,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: Math.round(size * 0.8),
          height: 1.4,
          backgroundColor: color,
          borderRadius: 1,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
};

export const MoonIcon: React.FC<IconProps> = ({ size = 18, color = '#CDA148', style }) => {
  const outerSize = Math.round(size * 0.82);
  return (
    <View style={[styles.center, { width: size, height: size }, style]}>
      <View
        style={{
          width: outerSize,
          height: outerSize,
          borderRadius: outerSize / 2,
          backgroundColor: color,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: Math.round(size * 0.65),
            height: Math.round(size * 0.65),
            borderRadius: Math.round(size * 0.32),
            backgroundColor: '#012655',
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeOutline: {
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyePupil: {},
  diagonalSlash: {
    position: 'absolute',
    height: 1.8,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
});
