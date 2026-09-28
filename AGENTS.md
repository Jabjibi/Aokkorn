<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## การแยก Logic และ UI

- ห้ามเขียน business logic, state management, การตรวจสอบข้อมูล หรือ event-handling logic ปนใน JSX ของ UI ให้แยกไปไว้ใน `lib/hooks/` โดยจัดเป็นโฟลเดอร์ตาม feature เช่น `lib/hooks/dashboard/`
- Component ใน `components/<feature>/` มีหน้าที่ประกอบหน้าจอ รับข้อมูลและ callback จาก hook ผ่าน props และแสดงผลเท่านั้น
- ก่อนสร้าง UI component ใหม่ ให้ตรวจสอบ `components/ui/` (shadcn/ui) ว่ามี component ที่ใช้ได้หรือไม่ ถ้ามีให้ใช้ของกลางก่อน
- ถ้า shadcn/ui ไม่มี UI element ที่ต้องการ ให้สร้าง custom UI component ใน `components/shared/` แล้วนำไปประกอบใช้ใน feature component อย่าใส่ custom UI element ใหม่ปนในไฟล์ logic
- UI ที่เฉพาะเจาะจงกับหน้า เช่น section หรือการจัดวางหลาย component สามารถอยู่ใน `components/<feature>/` ได้ แต่ต้องไม่เก็บ logic ไว้ในไฟล์นั้น
