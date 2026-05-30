export type ContactItem = {
  label: string;
  value: string;
  description?: string;
};

export type ContactsViewModel = {
  title: string;
  description: string;
  items: ContactItem[];
};

export function useContactsViewModel(): ContactsViewModel {
  return {
    title: "Contato",
    description:
      "Canais oficiais para atendimento, comunicados e suporte aos atletas.",
    items: [
      {
        label: "WhatsApp",
        value: "+55 (86) 9 9999-0000",
        description: "Atendimento de segunda a sexta, 9h-17h",
      },
      {
        label: "Instagram",
        value: "@associacao.ttm",
        description: "Noticias e fotos das competicoes",
      },
      {
        label: "Email",
        value: "contato@ttm-teresina.org",
        description: "Resposta em ate 48h",
      },
      {
        label: "Endereco",
        value: "Av. Principal, 1200 - Teresina",
        description: "Sala 03, bloco esportivo",
      },
    ],
  };
}
