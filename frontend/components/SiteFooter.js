import Link from "next/link";
import { SITE_NAME, LINKS } from "@/lib/site";
import { FaFacebook, FaTelegram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-black text-sm text-white">
      <div className="mx-auto grid max-w-3xl gap-6 p-6 sm:grid-cols-2">
        <div>
          <p className="mt-1 font-semibold text-sm text-white">
            Social Medias:
          </p>
        </div>
        <div className="flex flex-col gap-2 ">
          <ul className="flex flex-wrap gap-10  font-bold text-md text-white ">
            <div className="hover:text-blue-500 rounded-full bg-gray-200 p-1 transition-transform hover:scale-110">
              <a
                href="https://web.facebook.com/profile.php?id=100084981543645"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#1877F2] transition-transform hover:scale-110"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
            </div>
            <div className="bg-gray-200 hover:text-blue-500 rounded-full p-1 transition-transform hover:scale-110">
              <a
                href="https://t.me/drjibrilkemerofficial"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="text-[#229ED9] transition-transform hover:scale-110"
              >
                <FaTelegram className="h-6 w-6" />
              </a>
            </div>
            <div className="hover:text-blue-500 rounded-full bg-gray-200 p-1 transition-transform hover:scale-110">
              <a
                href="https://www.tiktok.com/@drjibrilqamar12"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex items-center text-black transition-transform hover:scale-110"
              >
                <FaTiktok size={26} />
              </a>
            </div>
          </ul>
        </div>
      </div>
    </footer>
  );
}
