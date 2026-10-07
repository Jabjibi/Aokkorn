export const navigationItems = [
  { label: "จุดเด่น", href: "#features" },
  { label: "ทดลองใช้", href: "#demo" },
  { label: "วิธีทำงาน", href: "#how-it-works" },
] as const;

export const heroTrustPoints = [
  "เพื่อนไม่ต้องสมัคร",
  "รองรับหลายสกุลเงิน",
  "เห็นยอดชัดทุกคน",
] as const;

export const heroTripCards = [
  {
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80",
    imageAlt: "ชายหาดและทะเลสำหรับทริปกับเพื่อน",
    title: "หนีไปทะเลกัน",
    subtitle: "คุณ มายด์ และพีท · 3 คน",
    amount: "฿1,650.00",
    amountLabel: "ยอดรวมทริป",
  },
  {
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
    imageAlt: "ทะเลสาบล้อมรอบด้วยภูเขาสำหรับวันพักผ่อน",
    title: "หารแล้ว พร้อมเที่ยว!",
    subtitle: "ทริปหนีไปทะเลกัน · 3 คน",
    amount: "฿550.00",
    amountLabel: "ส่วนแบ่งต่อคน",
  },
] as const;

export const featureItems = [
  {
    number: "01",
    title: "พิมพ์เหมือนจดโน้ต",
    description: "พิมพ์ “กะเพรา 300” แล้ว Aokkorn จะแยกชื่อรายการและจำนวนเงินให้ทันที",
    icon: "receipt",
    tone: "lime",
  },
  {
    number: "02",
    title: "เลือกคนหารได้ตรงรายการ",
    description: "กำหนดผู้จ่ายและเลือกเฉพาะเพื่อนที่ร่วมใช้ ระบบคำนวณยอดต่อคนให้ทันที",
    icon: "users",
    tone: "dark",
  },
  {
    number: "03",
    title: "จบด้วยยอดที่เข้าใจตรงกัน",
    description: "ดูว่าใครต้องคืนใครเท่าไหร่ พร้อมเทียบยอดต่างสกุลเงินก่อนจ่ายจริง",
    icon: "chart",
    tone: "light",
  },
] as const;

export const howItWorksItems = [
  { number: "1", title: "สร้างทริป", description: "ตั้งชื่อและเพิ่มเพื่อนด้วยชื่อเล่น" },
  { number: "2", title: "จดรายจ่าย", description: "พิมพ์รายการ เลือกผู้จ่ายและคนหาร" },
  { number: "3", title: "เช็กยอด", description: "ดูสรุปว่าใครต้องจ่ายให้ใคร" },
] as const;
