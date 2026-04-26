import { listConnections } from "../../../../lib/provider-connections/store.server";

function getConnectionMap(connections: Awaited<ReturnType<typeof listConnections>>) {
  return {
    stripe: connections.find((c) => c.provider === "stripe"),
    square: connections.find((c) => c.provider === "square"),
    adyen: connections.find((c) => c.provider === "adyen"),
  };
}

export default async function PaymentConnectionsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearch = searchParams ? await searchParams : {};
  const provider = typeof resolvedSearch.provider === "string" ? resolvedSearch.provider : "";
  const error = typeof resolvedSearch.error === "string" ? resolvedSearch.error : "";
  const success = typeof resolvedSearch.success === "string" ? resolvedSearch.success : "";

  const connections = await listConnections();
  const map = getConnectionMap(connections);

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950">
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Ops · Hidden route
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Payment Provider Connections
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600">
            Ruta interna para conectar proveedores de cobro sin pedirle al cliente API keys desde el inicio.
          </p>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {provider ? `${provider}: ` : ""}{error}
            </div>
          ) : null}

          {success ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {provider ? `${provider}: ` : ""}{success}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-10">
        <article className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Stripe</p>
              <h2 className="mt-2 text-2xl font-black">Connect Stripe</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                Botón UX-first para conectar una cuenta Stripe del restaurante.
              </p>
            </div>

            <div className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold">
              {map.stripe?.connected ? "Conectado" : "No conectado"}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/api/provider-connections/stripe/start"
              className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Conectar Stripe
            </a>

            {map.stripe?.connected ? (
              <form action="/api/provider-connections/disconnect" method="post">
                <input type="hidden" name="provider" value="stripe" />
                <button
                  type="submit"
                  className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                >
                  Desconectar
                </button>
              </form>
            ) : null}
          </div>

          {map.stripe?.accountId ? (
            <p className="mt-4 text-sm text-neutral-600">
              Account: {map.stripe.accountId} · Env: {map.stripe.environment}
            </p>
          ) : null}
        </article>

        <article className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Square</p>
              <h2 className="mt-2 text-2xl font-black">Conectar Square</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                Flujo OAuth para vendedores Square.
              </p>
            </div>

            <div className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold">
              {map.square?.connected ? "Conectado" : "No conectado"}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/api/provider-connections/square/start"
              className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Conectar Square
            </a>

            {map.square?.connected ? (
              <form action="/api/provider-connections/disconnect" method="post">
                <input type="hidden" name="provider" value="square" />
                <button
                  type="submit"
                  className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                >
                  Desconectar
                </button>
              </form>
            ) : null}
          </div>

          {map.square?.merchantId ? (
            <p className="mt-4 text-sm text-neutral-600">
              Merchant: {map.square.merchantId} · Env: {map.square.environment}
            </p>
          ) : null}
        </article>

        <article className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Adyen</p>
              <h2 className="mt-2 text-2xl font-black">Advanced hidden config</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
                Mantén esto oculto para clientes simples. Úsalo solo para cuentas avanzadas o internas.
              </p>
            </div>

            <div className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold">
              {map.adyen?.connected ? "Configurado" : "No configurado"}
            </div>
          </div>

          <details className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-neutral-900">
              Abrir config avanzada Adyen
            </summary>

            <form action="/api/provider-connections/adyen/save" method="post" className="mt-4 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium">Merchant account</span>
                <input name="merchantAccount" className="rounded-xl border border-neutral-300 px-4 py-3 text-sm" />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium">API key</span>
                <input name="apiKey" className="rounded-xl border border-neutral-300 px-4 py-3 text-sm" />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium">Client key</span>
                <input name="clientKey" className="rounded-xl border border-neutral-300 px-4 py-3 text-sm" />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium">Environment</span>
                <select name="environment" className="rounded-xl border border-neutral-300 px-4 py-3 text-sm">
                  <option value="test">test</option>
                  <option value="live">live</option>
                </select>
              </label>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
                >
                  Guardar Adyen
                </button>

                {map.adyen?.connected ? (
                  <form action="/api/provider-connections/disconnect" method="post">
                    <input type="hidden" name="provider" value="adyen" />
                    <button
                      type="submit"
                      className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
                    >
                      Desconectar
                    </button>
                  </form>
                ) : null}
              </div>
            </form>
          </details>
        </article>
      </section>
    </main>
  );
}
