export type HomeViewModel = {
  title: string;
  subtitle: string;
  description: string;
  highlights: Array<{
    title: string;
    description: string;
    href: string;
  }>;
};

export function useHomeViewModel(): HomeViewModel {
  return {
    title: "Associacao Teresinense de Tenis de Mesa",
    subtitle: "Portal oficial da associacao",
    description:
      "Template inicial para comunicar competicoes, atletas e contato da entidade.",
    highlights: [
      {
        title: "Competicoes",
        description:
          "Acompanhe eventos, categorias e modalidades com detalhes das partidas.",
        href: "/competicoes",
      },
      {
        title: "Contato",
        description: "Fale com a associacao por canais oficiais e redes sociais.",
        href: "/contatos",
      },
      {
        title: "Painel Administrativo",
        description: "Area reservada para gestao interna e publicacoes.",
        href: "/admin",
      },
    ],
  };
}
