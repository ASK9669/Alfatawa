import Link from "next/link";
import { SITE_NAME, LINKS } from "@/lib/site";
import { FaFacebook, FaTelegram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
export default function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-line bg-green-900 text-white">
      <div className="mx-auto max-w-6xl px-6 py-1">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {/* Website information */}

          <div className="mt-3 flex items-center gap-8">
            <h5 className="text-lg font-bold text-white">
              Social Media
            </h5>

            
              <a
                href="https://web.facebook.com/profile.php?id=100084981543645"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="rounded-full bg-white/10 p-3 text-white transition-all hover:-translate-y-1 hover:bg-[#1877F2]"
              >
                <FaFacebook size={22} />
              </a>

              <a
                href="https://t.me/drjibrilkemerofficial"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="rounded-full bg-white/10 p-3 text-white transition-all hover:-translate-y-1 hover:bg-[#229ED9]"
              >
                <FaTelegram size={22} />
              </a>

              <a
                href="https://www.tiktok.com/@drjibrilqamar12"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="rounded-full bg-white/10 p-3 text-white transition-all hover:-translate-y-1 hover:bg-white hover:text-black"
              >
                <FaTiktok size={22} />
              </a>
            </div>
          
        </div>
        <div className="border-t border-white/20 pt-5 text-center">
          <p className="text-sm text-green-100">
            © 2026 Al-Fataawaa Afaan Oromoo. Mirgi hundi
            seeraan eegamaadha.
          </p>
        </div>
      </div>
    </footer>
  );
}
