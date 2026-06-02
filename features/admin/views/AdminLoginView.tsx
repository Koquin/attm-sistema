"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginView() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, senha }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Falha ao autenticar.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Nao foi possivel conectar ao servidor.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-zinc-950 px-6 py-12 text-zinc-100">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/70 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-200/80">
          Acesso restrito
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Login administrativo</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Entre com seu login e senha para acessar o painel administrativo.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200" htmlFor="login">
              Login
            </label>
            <input
              id="login"
              name="login"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-amber-300/60"
              placeholder="Digite seu login"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-200" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              name="senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-amber-300/60"
              placeholder="Digite sua senha"
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <p className="rounded-xl border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}