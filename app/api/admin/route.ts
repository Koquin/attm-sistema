import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import {
  createAdminRecord,
  deleteAdminRecord,
  deleteRegistrationById,
  updateAdminRecord,
  upsertRegistration,
  type AdminResource,
} from "@/lib/db/admin";

const validResources: AdminResource[] = [
  "club",
  "athlete",
  "referee",
  "category",
  "modality",
  "competition",
  "group",
  "match",
  "matchAthlete",
  "result",
  "registration",
];

function isAdminResource(value: unknown): value is AdminResource {
  return typeof value === "string" && validResources.includes(value as AdminResource);
}

function formatError(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "message" in error) {
    const typedError = error as {
      message?: unknown;
      code?: unknown;
      details?: unknown;
      hint?: unknown;
    };

    return {
      error: typeof typedError.message === "string" ? typedError.message : fallback,
      code: typeof typedError.code === "string" ? typedError.code : undefined,
      details: typeof typedError.details === "string" ? typedError.details : undefined,
      hint: typeof typedError.hint === "string" ? typedError.hint : undefined,
    };
  }

  return { error: fallback };
}

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      resource?: unknown;
      payload?: Record<string, unknown>;
    };

    if (!isAdminResource(body.resource) || !body.payload) {
      return NextResponse.json({ error: "Requisicao invalida." }, { status: 400 });
    }

    if (body.resource === "registration") {
      const payload = body.payload as {
        id_atleta?: unknown;
        id_competicao?: unknown;
        id_grupo?: unknown;
        inscricao_confirmada?: unknown;
      };

      if (typeof payload.id_atleta !== "number" || typeof payload.id_competicao !== "number") {
        return NextResponse.json({ error: "Requisicao invalida." }, { status: 400 });
      }

      const data = await upsertRegistration({
        id_atleta: payload.id_atleta,
        id_competicao: payload.id_competicao,
        id_grupo: typeof payload.id_grupo === "number" ? payload.id_grupo : null,
        inscricao_confirmada: typeof payload.inscricao_confirmada === "boolean" ? payload.inscricao_confirmada : false,
      });

      return NextResponse.json({ ok: true, data });
    }

    const payload =
      body.resource === "competition"
        ? { ...body.payload, id_usuario: session.uid }
        : body.payload;

    const data = await createAdminRecord(body.resource, payload);

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(formatError(error, "Erro ao salvar registro."), { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      resource?: unknown;
      id?: unknown;
      payload?: Record<string, unknown>;
    };

    if (!isAdminResource(body.resource) || typeof body.id !== "number" || !body.payload) {
      return NextResponse.json({ error: "Requisicao invalida." }, { status: 400 });
    }

    const data = await updateAdminRecord(body.resource, body.id, body.payload);

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json(formatError(error, "Erro ao atualizar registro."), { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      resource?: unknown;
      id?: unknown;
    };

    if (!isAdminResource(body.resource) || typeof body.id !== "number") {
      return NextResponse.json({ error: "Requisicao invalida." }, { status: 400 });
    }

    if (body.resource === "registration") {
      await deleteRegistrationById(body.id);
      return NextResponse.json({ ok: true });
    }

    await deleteAdminRecord(body.resource, body.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(formatError(error, "Erro ao remover registro."), { status: 500 });
  }
}