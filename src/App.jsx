import React, { useState, useEffect } from "react";
import { INITIAL_MENUS, compressImage } from "./utils";
import MenuCard from "./MenuCard";

const STORAGE_KEY = "office_food_votes_v2";

export default function App() {
  const [menuList, setMenuList] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // 1. โหลดข้อมูลจาก LocalStorage หรือใช้ค่าเริ่มต้น
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMenuList(parsed.length > 0 ? parsed : INITIAL_MENUS);
      } catch (e) {
        setMenuList(INITIAL_MENUS);
      }
    } else {
      setMenuList(INITIAL_MENUS);
    }
  }, []);

  // 2. บันทึกข้อมูลลง LocalStorage
  useEffect(() => {
    if (menuList.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(menuList));
    }
  }, [menuList]);

  // เพิ่มเมนูใหม่
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !price) return alert("กรุณากรอกชื่อเมนูและราคา");

    let imageUrl = "";
    if (imageFile) {
      imageUrl = await compressImage(imageFile);
    }

    const newMenu = {
      id: Date.now().toString(),
      title: title.trim(),
      price: Number(price),
      imageUrl,
      votes: 0
    };

    setMenuList([newMenu, ...menuList]);
    setTitle("");
    setPrice("");
    setImageFile(null);
    setShowForm(false);
  };

  // กดโหวต
  const handleVote = (id) => {
    setMenuList(
      menuList.map((item) =>
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      )
    );
  };

  // ลบเมนู
  const handleDelete = (id) => {
    if (window.confirm("ยืนยันการลบเมนูนี้นะครับ?")) {
      const updated = menuList.filter((item) => item.id !== id);
      setMenuList(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // รีเซ็ตผลโหวตทั้งหมด
  const handleResetVotes = () => {
    if (window.confirm("ต้องการล้างคะแนนโหวตทั้งหมดเพื่อเริ่มรอบใหม่ใช่ไหม?")) {
      setMenuList(menuList.map((item) => ({ ...item, votes: 0 })));
    }
  };

  // คืนค่าเมนูเริ่มต้น 12 เมนู
  const handleRestoreDefaults = () => {
    if (window.confirm("ต้องการโหลดรายการเมนูเริ่มต้นทั้งหมด (12 เมนู) กลับมาใช่ไหม?")) {
      setMenuList(INITIAL_MENUS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MENUS));
    }
  };

  // เรียงลำดับตามคะแนนโหวตจากมากไปน้อย
  const sortedMenuList = [...menuList].sort((a, b) => b.votes - a.votes);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px", fontFamily: "sans-serif" }}>
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", color: "#111827", margin: "0 0 8px 0" }}>🍱 เที่ยงนี้กินอะไรดี?</h1>
        <p style={{ color: "#4b5563", margin: 0, fontSize: "14px" }}>เปิดโหวตเมนูอาหารประจำออฟฟิศ</p>
      </header>

      {/* Control Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ backgroundColor: "#111827", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}
          >
            {showForm ? "✖️ ปิดฟอร์ม" : "➕ เพิ่มเมนูใหม่"}
          </button>
          <button
            onClick={handleRestoreDefaults}
            style={{ backgroundColor: "#e5e7eb", color: "#374151", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}
          >
            🔄 รีเซ็ตเมนูเริ่มต้น (12 เมนู)
          </button>
        </div>

        {menuList.length > 0 && (
          <button
            onClick={handleResetVotes}
            style={{ backgroundColor: "transparent", color: "#ef4444", border: "none", cursor: "pointer", fontSize: "14px" }}
          >
            🧹 ล้างคะแนนโหวต
          </button>
        )}
      </div>

      {/* Form Add Menu */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: "#f9fafb", padding: "16px", borderRadius: "12px", marginBottom: "20px", border: "1px solid #e5e7eb" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "16px" }}>เพิ่มเมนูอาหาร</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              placeholder="ชื่อเมนู *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <input
              type="number"
              placeholder="ราคา (บาท) *"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              style={{ fontSize: "14px" }}
            />
            <button
              type="submit"
              style={{ backgroundColor: "#f97316", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginTop: "4px" }}
            >
              บันทึกเมนู
            </button>
          </div>
        </form>
      )}

      {/* Menu Cards (ล็อกเป็น 2 Columns ชัดเจน) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        {sortedMenuList.map((item, index) => (
          <MenuCard
            key={item.id}
            item={item}
            onVote={handleVote}
            onDelete={handleDelete}
            isTopRank={index === 0}
          />
        ))}
      </div>
    </div>
  );
}