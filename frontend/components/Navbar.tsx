export default function Navbar() {
  return (
    <nav className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="h-10 w-10 rounded-full bg-blue-100">
            <img src ="./../public/doctor.jpg" alt="Logo" />
          </div>
        <a href="/" className="text-2xl font-bold text-emerald-800">
          Al-Fataawaa
        </a>

        <div className="hidden items-center gap-7 md:flex">
        
          <a href="/" className="font-medium text-emerald-800">
            Mana
          </a>

          <a href="#categories" className="hover:text-emerald-700">
            Ramaddii
          </a>

          <a href="#fatwas" className="hover:text-emerald-700">
            Fatwaalee
          </a>
          <a href="#fatwas" className="hover:text-emerald-700">
            You Tube
          </a>
<a href="#fatwas" className="hover:text-emerald-500">
            Seena Gabaaba
          </a>
          <a
            href="#ask"
            className="rounded-lg bg-emerald-800 px-5 py-3 text-white hover:bg-emerald-900"
          >
            Muftii gaafadhu
          </a>
        </div>
      </div>
    </nav>
  );
}
