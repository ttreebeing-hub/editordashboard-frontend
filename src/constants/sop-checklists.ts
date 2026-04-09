export const SOP_CHECKLISTS = {
  1: [
    { id: 'b1_1', label: 'Đã đọc brief và hiểu yêu cầu' },
    { id: 'b1_2', label: 'Đã nhận đủ raw footage' },
    { id: 'b1_3', label: 'Đã tải reference video về' },
  ],
  2: [
    { id: 'b2_1', label: 'Kiểm tra âm thanh background' },
    { id: 'b2_2', label: 'Loại bỏ tiếng ồn' },
    { id: 'b2_3', label: 'Sync âm thanh với hình' },
    { id: 'b2_4', label: 'Volume normalize' },
    { id: 'b2_5', label: 'Cấu trúc video đúng outline' },
  ],
  3: [
    { id: 'b3_1', label: 'Color grade hoàn thành' },
    { id: 'b3_2', label: 'Subtitle đúng font và timing' },
    { id: 'b3_3', label: 'Nhạc nền phù hợp, không lấn giọng' },
    { id: 'b3_4', label: 'Transition mượt giữa các cảnh' },
    { id: 'b3_5', label: 'Text/graphic overlay đúng vị trí' },
  ],
  4: [
    { id: 'b4_1', label: 'Spec xuất đúng (resolution, bitrate)' },
    { id: 'b4_2', label: 'Đã xem lại 100% video' },
    { id: 'b4_3', label: 'File đã được lưu vào đúng folder Drive' },
  ],
  5: [
    { id: 'b5_1', label: 'Hook 5 giây đầu ổn mạnh' },
    { id: 'b5_2', label: 'Không có lỗi kỹ thuật còn sót' },
    { id: 'b5_3', label: 'Đã điền dự đoán Retention và CTR' },
  ],
  6: [
    { id: 'b6_1', label: 'Đã upload lên YouTube' },
    { id: 'b6_2', label: 'Title và description đã điền' },
    { id: 'b6_3', label: 'Thumbnail đã set' },
    { id: 'b6_4', label: 'Đã điền Drive link vào hệ thống' },
  ],
} as const;

export const SOP_STEP_LABELS = {
  1: 'B1 — Tiếp nhận',
  2: 'B2 — Dựng thô',
  3: 'B3 — Hoàn thiện',
  4: 'B4 — Xuất file',
  5: 'B5 — Kiểm tra',
  6: 'B6 — Nộp bài',
} as const;

export const SOP_MINDSET_QUESTIONS: Record<number, string> = {
  1: 'Video này phục vụ cho mục tiêu gì của kênh? Khán giả sẽ cảm thấy thế nào khi xem xong?',
  2: 'Cấu trúc câu chuyện của video này là gì? Hook có đủ mạnh không?',
  3: 'Nếu bạn là khán giả mục tiêu, bạn có xem hết video này không? Tại sao?',
  4: 'Chất lượng xuất file có đảm bảo trải nghiệm xem tốt nhất chưa?',
  5: 'Bạn tự tin dự đoán Retention và CTR bao nhiêu? Căn cứ vào đâu?',
  6: 'Bạn học được điều gì từ video này? Lần sau sẽ làm gì khác hơn?',
};
