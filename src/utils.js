// รูปสำรองกรณีไม่มีรูปภาพ
export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500";

// รายการเมนูเริ่มต้นที่มีในระบบ
export const INITIAL_MENUS = [
  { id: "1", title: "กะเพราหมูกรอบ ไข่ดาว", price: 65, imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=500", votes: 0 },
  { id: "2", title: "ข้าวมันไก่ต้ม/ทอด", price: 55, imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=500", votes: 0 },
  { id: "3", title: "ข้าวหมูแดง หมูกรอบ", price: 60, imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500", votes: 0 },
  { id: "4", title: "ก๋วยเตี๋ยวต้มยำ", price: 50, imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=500", votes: 0 },
  { id: "5", title: "ชาไทยเย็น", price: 35, imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=500", votes: 0 }
];

// ย่อรูปภาพก่อนบันทึกลง LocalStorage
export const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = 400 / img.width;
        canvas.width = scale < 1 ? 400 : img.width;
        canvas.height = scale < 1 ? img.height * scale : img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
    };
  });
};