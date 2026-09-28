import Image from "next/image";

type WelcomeCardProps = {
  totalLabel: string;
};

export function WelcomeCard({ totalLabel }: WelcomeCardProps) {
  return (
    <section
      className="w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-black text-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
      aria-labelledby="welcome-title"
    >
      <div className="relative flex min-h-[136px] flex-col justify-center overflow-hidden bg-[radial-gradient(circle_at_82%_45%,rgba(207,255,71,0.13),transparent_32%)] px-6 py-4 sm:min-h-[148px] sm:px-7 lg:min-h-[164px]">
        <Image
          src="/trip1.png"
          alt="นักเดินทางถือกระเป๋าเดินทางและชูตั๋วเครื่องบิน"
          width={1672}
          height={941}
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 288px, 224px"
          loading="eager"
          className="pointer-events-none absolute right-[-1rem] bottom-0 h-auto w-56 sm:right-4 sm:w-72 lg:right-12 lg:w-80"
        />
        <h1
          id="welcome-title"
          className="relative text-[12px] leading-tight font-black tracking-[-0.035em] whitespace-nowrap sm:text-[clamp(1.25rem,4vw,1.75rem)]"
        >
          สวัสดี, Pahiso!
        </h1>
        <p className="relative mt-3 max-w-[65%] text-[12px] leading-4 text-white/65 sm:max-w-[55%] sm:text-sm sm:leading-5">
          จดรายจ่าย แล้วรู้ว่าใครต้องคืนใคร
        </p>
      </div>

      <div className="px-6 pb-4 sm:px-7 sm:pb-5">
        <div className="border-t border-[#a3a3a3] pt-3">
          <p className="text-[12px] font-semibold text-white/50 sm:text-xs">
            ยอดค่าใช้จ่ายรวม (THB)
          </p>
          <strong className="mt-1 block text-4xl font-black tracking-[-0.045em] whitespace-nowrap">
            {totalLabel}
          </strong>
        </div>
      </div>
    </section>
  );
}
