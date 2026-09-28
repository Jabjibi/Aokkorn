import { ChartNoAxesCombined, ReceiptText, UsersRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { featureItems } from "@/lib/landing-content";

const icons = {
  receipt: ReceiptText,
  users: UsersRound,
  chart: ChartNoAxesCombined,
};

const tones = {
  lime: "border-[#cfff47] bg-[#cfff47] text-black",
  dark: "border-black bg-black text-white",
  light: "border-black/10 bg-white text-black",
};

export function Features() {
  return (
    <section id="features" className="bg-white px-5 py-24 sm:px-8 lg:px-12 lg:py-32" data-features>
      <div className="mx-auto max-w-7xl">
        <div
          className="grid gap-8 border-b border-black/10 pb-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
          data-feature-heading
        >
          <p className="text-xs font-bold tracking-[0.2em] text-black/45 uppercase">
            Less calculating · More traveling
          </p>
          <h2 className="text-4xl leading-tight font-black tracking-[-0.045em] text-black sm:text-5xl">
            เรื่องเที่ยวให้คุณจัดเต็ม
            <br />
            เรื่องตัวเลขให้เราจัดการ
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featureItems.map((feature) => {
            const Icon = icons[feature.icon];

            return (
              <Card
                className={`min-h-80 justify-between rounded-3xl p-0 shadow-none ${tones[feature.tone]}`}
                key={feature.number}
                data-feature-card
              >
                <CardContent className="flex h-full flex-col p-7 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl border border-current/15 bg-current/8">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-mono text-xs opacity-50">/{feature.number}</span>
                  </div>
                  <div className="mt-auto pt-16">
                    <h3 className="text-2xl font-black tracking-[-0.035em]">{feature.title}</h3>
                    <p className="mt-4 max-w-sm text-sm leading-7 opacity-65">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
