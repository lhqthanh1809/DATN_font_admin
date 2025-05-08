import { IIcon } from "@/ui/Icon";
import Svg, { Path } from "react-native-svg";

export const RotateLeft: React.FC<IIcon> = ({ className, currentColor, strokeWidth = 1.5 }) => {
    return (
      <Svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={className}
      >
        <Path d="M9.11008 5.08C9.98008 4.82 10.9401 4.65 12.0001 4.65C16.7901 4.65 20.6701 8.53 20.6701 13.32C20.6701 18.11 16.7901 21.99 12.0001 21.99C7.21008 21.99 3.33008 18.11 3.33008 13.32C3.33008 11.54 3.87008 9.88 4.79008 8.5" stroke={currentColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M7.87012 5.32L10.7601 2" stroke={currentColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <Path d="M7.87012 5.32L11.2401 7.78" stroke={currentColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      </Svg>
    );
};

