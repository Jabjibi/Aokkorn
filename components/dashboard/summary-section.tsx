export function SummarySection() {
  return (
    <section
      id="summary"
      className="mt-10 scroll-mt-28 border-t border-black/10 pt-7"
      aria-labelledby="summary-title"
    >
      <p className="text-[0.7rem] font-bold tracking-[0.14em] text-black/40 uppercase lg:text-xs">
        Quick summary
      </p>
      <h2 id="summary-title" className="mt-1 text-base font-black tracking-[-0.03em] lg:text-xl">
        ทุกยอดยังอยู่ครบในแต่ละทริป
      </h2>
      <p className="mt-2 max-w-xl text-xs leading-5 text-black/48 lg:text-sm lg:leading-6">
        เมื่อเพิ่มค่าใช้จ่ายแล้ว คุณจะดูยอดที่ต้องหารและสถานะการจ่ายได้จากทริปนั้น
      </p>
    </section>
  );
}
