import { ScrollView, Text, View } from "react-native";
import Button from "../Button";
import { useState, useMemo } from "react";
import { cn } from "@/helper/helper";
import { MotiView } from "moti";

type TabsLineProps<T extends { name: string }> = {
  gap?: number;
  active: T;
  tabs: T[];
  onChange: (tab: T) => void;
};

const TabsLine = <T extends { name: string }>({
  gap = 10,
  active,
  tabs,
  onChange,
}: TabsLineProps<T>) => {
  const [widthTabs, setWidthTabs] = useState<Array<number>>([]);
  const [width, setWidth] = useState(0)

  // Tính vị trí underline chỉ khi có thay đổi
  const underlineLeft = useMemo(() => {
    const tabIndex = tabs.findIndex((tab) => tab === active);
    if (tabIndex === -1) return 0;
    return (
      widthTabs.slice(0, tabIndex).reduce((sum, width) => sum + width, 0) +
      gap * tabIndex
    );
  }, [widthTabs, tabs, active, gap]);

  return (
    <View
      className="bg-white-50 shadow-soft-xs flex-row border-b-1 border-white-100"
      onLayout={(event) => {
        const {width} = event.nativeEvent.layout
        setWidth(width)
      }}
      style={{ gap }}
    >
      {tabs.map((tab, index) => (
        <Button
          className="flex-1 py-4 items-center"
          key={tab.name}
          onPress={() => onChange(tab)}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setWidthTabs((prev) => {
              if (prev[index] === width) return prev;
              const newWidths = [...prev];
              newWidths[index] = width;
              return newWidths;
            });
          }}
        >
          <Text
            className={cn(
              "font-BeVietnamMedium",
              tab === active ? "text-mineShaft-950" : "text-white-500"
            )}
          >
            {tab.name}
          </Text>
        </Button>
      ))}

      {/* Animated underline */}
      <MotiView
        className="bg-lime-400 h-1 rounded-full w-9 absolute bottom-0"
        style={{
          width: width / (Math.max(tabs.length, 1))
        }}
        from={{ left: 0 }}
        animate={{ left: underlineLeft }}
        transition={{
          type: "spring",
          damping: 40,
          stiffness: 200,
        }}
      />
    </View>
  );
};

export default TabsLine;
