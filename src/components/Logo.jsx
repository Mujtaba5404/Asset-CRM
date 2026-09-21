import { Image, useMantineColorScheme } from "@mantine/core";
import assetlogo from "../assets/assetlogo.png";

const Logo = (props) => {
  const { colorScheme } = useMantineColorScheme();

  return <Image src={assetlogo} styles={{ root: { filter: colorScheme === "dark" ? "grayscale() invert()" : null } }} {...props} />;
};

export default Logo;
