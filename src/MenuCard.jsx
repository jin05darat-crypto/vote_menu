import React, { useState } from "react";
import { DEFAULT_IMAGE } from "./utils";

export default function MenuCard({ item, onVote, onDelete, isTopRank }) {
  const [imgSrc, setImgSrc] = useState(item.imageUrl || DEFAULT_IMAGE);

  // หากรูปโหลดไม่ขึ้น ให้สลับไปใช้รูปสำรองอัตโนมัติ
  const handleError = () => {
    setImgSrc(DEFAULT_IMAGE);
  };

  return (
    <div
      style={{
        border: isTopRank ? "2px solid #f59e0b" : "1px solid #e5e7eb",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        position: "relative"
      }}
    >
      {/* Badge แสดงอันดับ 1 */}
      {isTopRank && item.votes > 0 && (
        <span
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            backgroundColor: "#f59e0b",
            color: "#ffffff",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 1
          }}
        >
          👑 ยอดฮิต
        </span>
      )}

      {/* รูปภาพเมนู */}
      <div style={{ height: "160px", backgroundColor: "#f3f4f6" }}>
        <img
          src={imgSrc}
          alt={item.title}
          onError={handleError}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* รายละเอียดข้อมูล */}
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "18px", color: "#1f2937" }}>{item.title}</h3>
          <span style={{ color: "#ea580c", fontWeight: "bold", fontSize: "16px" }}>
            ฿{item.price}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justify: "space-between",
            alignItems: "center",
            marginTop: "16px"
          }}
        >
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            คะแนนโหวต: <strong style={{ color: "#111827", fontSize: "18px" }}>{item.votes}</strong>
          </span>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => onDelete(item.id)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: "4px"
              }}
              title="ลบเมนู"
            >
              🗑️
            </button>
            <button
              onClick={() => onVote(item.id)}
              style={{
                backgroundColor: "#f97316",
                color: "#ffffff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              🗳️ โหวต
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}