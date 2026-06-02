import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/competicoes", label: "Competicoes" },
  { href: "/contatos", label: "Contatos" },
  { href: "/admin", label: "Painel Administrativo" },
];

export function Navbar() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Associacao
          </span>
          <span className="text-lg font-semibold text-zinc-900">
            Teresinense de Tenis de Mesa
          </span>
        </div>
        <div className="hidden items-center gap-6 text-sm font-medium text-zinc-700 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-zinc-900"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="md:hidden">
          <span className="text-xs font-medium text-zinc-500">Menu</span>
        </div>
      </nav>
    </header>
  );
}
