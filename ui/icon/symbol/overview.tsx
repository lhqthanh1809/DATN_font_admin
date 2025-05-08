import { IIcon } from "@/ui/Icon";
import Svg, { Path } from "react-native-svg";

const Overview: React.FC<IIcon> = ({
  className,
  currentColor,
  strokeWidth = 1.5,
}) => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
    <Path
      d="M18.32 11.9999C20.92 11.9999 22 10.9999 21.04 7.71994C20.39 5.50994 18.49 3.60994 16.28 2.95994C13 1.99994 12 3.07994 12 5.67994V8.55994C12 10.9999 13 11.9999 15 11.9999H18.32Z"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20.0004 14.7C19.0704 19.33 14.6304 22.69 9.58042 21.87C5.79042 21.26 2.74042 18.21 2.12042 14.42C1.31042 9.39001 4.65042 4.95001 9.26042 4.01001"
      stroke={currentColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    </Svg>
  );
};

export { Overview };
