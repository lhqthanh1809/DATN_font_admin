import { MotiView } from "moti";
import React, { memo } from "react";
import Button from "./Button";

const Switch: React.FC<{
  value: boolean;
  toggle: (value: boolean) => void;
}> = memo(({ value, toggle }) => {
  return (
    <Button className="w-fit p-1 bg-transparent" onPress={() => toggle(!value)}>
      <MotiView
        animate={{ backgroundColor: value ? "#a3e635" : "#0D0F10" }}
        transition={{ type: "spring" }}
        className="h-6 w-11 rounded-full flex items-center relative"
      >
        <MotiView
          animate={{ translateX: value ? 8 : -8, translateY: 1.5 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="h-5 w-5 bg-white-50 rounded-full"
        />
      </MotiView>
    </Button>
  );
});

export default Switch;
