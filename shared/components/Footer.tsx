import Link from "next/link";
import { useContactsViewModel } from "@/features/contacts/viewmodels/useContactsViewModel";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/competicoes", label: "Competições" },
  { href: "/contatos", label: "Contatos" },
  { href: "/admin", label: "Admin" },
];

export function Footer() {
  const contacts = useContactsViewModel();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-zinc-100">
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_0.9fr_0.9fr]">
        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/80">
              Associação
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Teresinense de Tênis de Mesa
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-zinc-300">
            Informações oficiais, suporte aos atletas, calendários de eventos e
            canais de contato reunidos em um único lugar.
          </p>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Contatos
          </h3>
          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            {contacts.items.map((item) => (
              <div key={item.label}>
                <p className="font-semibold text-white">{item.label}</p>
                <p>{item.value}</p>
                {item.description ? (
                  <p className="text-xs text-zinc-500">{item.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Atalhos
          </h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-300 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
            <p className="font-semibold text-white">Endereço</p>
            <p className="mt-1">{contacts.items.find((item) => item.label === "Endereco")?.value}</p>
          </div>
        </section>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Associação Teresinense de Tênis de Mesa.</p>
          <p>Portal institucional com competições, contatos e administração.</p>
        </div>
      </div>
    </footer>
  );
}