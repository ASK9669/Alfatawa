import Link from 'next/link';
import { SITE_NAME, LINKS } from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-black text-sm text-white">
      <div className="mx-auto grid max-w-3xl gap-6 p-6 sm:grid-cols-2">
        <div>
          <p className="mt-1 font-semibold text-sm text-white">
           Odeeffannoo Dabalataaf:
          </p>
        </div>
       <div className="flex flex-col gap-2 ">
          <ul className="flex flex-wrap gap-2 ">
              <div className='hover:text-blue-500'><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                Facebook
              </a></div>
            <div className='hover:text-blue-500'><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                Facebook
              </a></div>
            <div className='hover:text-blue-500'><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                Facebook
              </a></div>
              <div className='hover:text-blue-500'><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                Facebook 
              </a></div>
          </ul>
        </div>
      </div>
    </footer>
  );
}