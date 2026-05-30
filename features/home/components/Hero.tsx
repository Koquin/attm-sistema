type HeroProps = {
  title: string;
  subtitle: string;
  description: string;
};

export function Hero({ title, subtitle, description }: HeroProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {subtitle}
      </p>
      <h1 className="text-3xl font-semibold leading-10 tracking-tight text-zinc-900 sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-zinc-600">{description}</p>
    </div>
  );
}
