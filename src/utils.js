export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500";

// รายการเมนูเริ่มต้นในระบบ 
export const INITIAL_MENUS = [
  { id: "1", title: "สลัดผักรวม", price: 60, imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=500", votes: 0 },
  { id: "2", title: "ข้าวมันไก่ต้ม/ทอด", price: 55, imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=500", votes: 0 },
  { id: "3", title: "ข้าวหมูแดง หมูกรอบ", price: 60, imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=500", votes: 0 },
  { id: "4", title: "ก๋วยเตี๋ยวต้มยำตำลึง", price: 50, imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=500", votes: 0 },
  { id: "5", title: "ข้าวผัดต้มยำทะเล", price: 70, imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=500", votes: 0 },
  { id: "6", title: "ส้มตำไทย-ไข่เค็ม", price: 50, imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&q=80&w=500", votes: 0 },
  { id: "7", title: "ผัดไทยกุ้งสด", price: 65, imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&q=80&w=500", votes: 0 },
  { id: "8", title: "ข้าวหน้าเป็ดย่าง", price: 70, imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=500", votes: 0 },
  { id: "9", title: "ยำวุ้นเส้นหมูสับแน่นๆ", price: 60, imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=500", votes: 0 },
  { id: "10", title: "ชาไทยเย็น ชาตรามือ", price: 35, imageUrl: "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&q=80&w=500", votes: 0 },
  { id: "11", title: "อเมริกาโน่เย็น / ลาเต้", price: 45, imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=500", votes: 0 },
  { id: "12", title: "ชามะนาวเย็น ดับร้อน", price: 30, imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=500", votes: 0 }
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