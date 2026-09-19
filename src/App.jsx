import React, { useState, useEffect } from "react";
import { INITIAL_MENUS, compressImage } from "./utils";
import MenuCard from "./MenuCard";

const STORAGE_KEY = "office_food_votes_v4";
const VOTE_LIMIT = 8; // กำหนดจำนวนคนโหวตสูงสุด

export default function App() {
  const [menuList, setMenuList] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // 1. โหลดข้อมูลจาก LocalStorage
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

  // คำนวณจำนวนคนโหวตทั้งหมด
  const totalVotes = menuList.reduce((sum, item) => sum + item.votes, 0);
  const isVoteClosed = totalVotes >= VOTE_LIMIT;

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

  // กดโหวต (พร้อมเช็คโควตา)
  const handleVote = (id) => {
    if (isVoteClosed) {
      alert("ปิดโหวตแล้ว เนื่องจากครบจำนวน 8 คนเรียบร้อยครับ!");
      return;
    }

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
    if (window.confirm("ต้องการล้างคะแนนโหวตทั้งหมดเพื่อเปิดรอบใหม่ใช่ไหม?")) {
      setMenuList(menuList.map((item) => ({ ...item, votes: 0 })));
    }
  };

  // คืนค่าเมนูเริ่มต้น
  const handleRestoreDefaults = () => {
    if (window.confirm("ต้องการโหลดรายการเมนูเริ่มต้นทั้งหมดกลับมาใช่ไหม?")) {
      setMenuList(INITIAL_MENUS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MENUS));
    }
  };

  // เรียงลำดับตามคะแนนโหวตจากมากไปน้อย
  const sortedMenuList = [...menuList].sort((a, b) => b.votes - a.votes);
  const winnerMenu = sortedMenuList[0];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
      padding: "32px 16px",
      fontFamily: "'Sukhumvit Set', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ maxWidth: "850px", margin: "0 auto" }}>
        
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "32px", color: "#9a3412", margin: "0 0 8px 0", fontWeight: "800" }}>
            🍱 เที่ยงนี้กินอะไรดี?
          </h1>
          <p style={{ color: "#c2410c", margin: 0, fontSize: "15px" }}>
            เปิดโหวตเมนูอาหารประจำออฟฟิศ (จำกัด {VOTE_LIMIT} สิทธิ์)
          </p>
        </header>

        {/* Vote Status Bar / Progress Bar */}
        <div style={{ backgroundColor: "#ffffff", padding: "16px 20px", borderRadius: "16px", marginBottom: "24px", border: "1px solid #fed7aa", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontWeight: "bold", color: "#9a3412", fontSize: "15px" }}>
              📊 สถานะการโหวต:
            </span>
            <span style={{ fontWeight: "bold", color: isVoteClosed ? "#dc2626" : "#ea580c", fontSize: "15px" }}>
              {isVoteClosed ? "🔒 ปิดโหวตแล้ว" : `โหวตแล้ว ${totalVotes} / ${VOTE_LIMIT} คน`}
            </span>
          </div>

          {/* Progress Bar Background */}
          <div style={{ width: "100%", height: "12px", backgroundColor: "#ffedd5", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${Math.min((totalVotes / VOTE_LIMIT) * 100, 100)}%`,
              backgroundColor: isVoteClosed ? "#dc2626" : "#f97316",
              transition: "width 0.3s ease"
            }} />
          </div>

          {/* Announcement Box เมื่อปิดโหวตแล้ว */}
          {isVoteClosed && winnerMenu && (
            <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", textAlign: "center", color: "#991b1b", fontWeight: "bold" }}>
              🎉 สรุปผลโหวต! เมนูที่ได้คะแนนสูงสุดคือ: <span style={{ color: "#dc2626", fontSize: "18px" }}>"{winnerMenu.title}"</span> ({winnerMenu.votes} คะแนน)
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{ backgroundColor: "#ea580c", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 2px 4px rgba(234,88,12,0.2)" }}
            >
              {showForm ? "✖️ ปิดฟอร์ม" : "➕ เพิ่มเมนูใหม่"}
            </button>
            <button
              onClick={handleRestoreDefaults}
              style={{ backgroundColor: "#ffffff", color: "#9a3412", border: "1px solid #ffedd5", padding: "10px 14px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
            >
              🔄 รีเซ็ตเมนูเริ่มต้น
            </button>
          </div>

          {menuList.length > 0 && (
            <button
              onClick={handleResetVotes}
              style={{ backgroundColor: "transparent", color: "#dc2626", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}
            >
              🧹 ล้างคะแนนเพื่อเปิดโหวตใหม่
            </button>
          )}
        </div>

        {/* Form Add Menu */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "16px", marginBottom: "24px", border: "1px solid #fed7aa", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "#9a3412" }}>➕ เพิ่มเมนูอาหารใหม่</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="text"
                placeholder="ชื่อเมนู *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #fdba74", outline: "none" }}
              />
              <input
                type="number"
                placeholder="ราคา (บาท) *"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #fdba74", outline: "none" }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                style={{ fontSize: "14px", color: "#c2410c" }}
              />
              <button
                type="submit"
                style={{ backgroundColor: "#ea580c", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "4px" }}
              >
                บันทึกเมนู
              </button>
            </div>
          </form>
        )}

        {/* Menu Cards (จัดเรียง 2 Columns) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
          {sortedMenuList.map((item, index) => (
            <MenuCard
              key={item.id}
              item={item}
              onVote={handleVote}
              onDelete={handleDelete}
              isTopRank={index === 0}
              isVoteClosed={isVoteClosed}
            />
          ))}
        </div>

      </div>
    </div>
  );
}