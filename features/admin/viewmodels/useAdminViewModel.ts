export type AdminViewModel = {
  title: string;
  description: string;
  notes: string[];
};

export function useAdminViewModel(): AdminViewModel {
  return {
    title: "Painel Administrativo",
    description:
      "Area reservada para cadastro de competicoes, atletas e publicacoes.",
    notes: [
      "Gestao de competicoes e categorias",
      "Cadastro de atletas e clubes",
      "Publicacao de noticias e comunicados",
    ],
  };
}
