import { getSettings } from "@/lib/admin-storage";
import SocialButtons from "./SocialButtons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SocialButtonsWrapper() {
  let settings;
  try {
    settings = await getSettings();
  } catch (error) {
    console.warn("Error al cargar settings en SocialButtonsWrapper:", error);
    settings = {
      whatsapp: "6142156600",
      social: {
        instagram: "https://www.instagram.com/domp.mx?igsh=b2xhM3JkdXg3N2p4",
        facebook: "https://www.facebook.com/share/16rTmPc5Zm/?mibextid=wwXIfr",
      },
      colors: {
        socialButtons: "#F18121",
        socialButtonsHover: "#e0771a",
        accent: "#F18121",
        accentHover: "#e0771a",
      },
    };
  }

  const whatsapp = settings.whatsapp || "";
  const instagram = settings.social?.instagram || "";
  const facebook = settings.social?.facebook || "";

  // Colores de los botones (usar colores del tema o valores por defecto)
  const buttonColor = settings.colors?.socialButtons || settings.colors?.accent || "#F18121";
  const buttonHoverColor = settings.colors?.socialButtonsHover || settings.colors?.accentHover || "#e0771a";

  return (
    <SocialButtons
      whatsapp={whatsapp}
      instagram={instagram}
      facebook={facebook}
      buttonColor={buttonColor}
      buttonHoverColor={buttonHoverColor}
    />
  );
}

