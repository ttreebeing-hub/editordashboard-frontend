import { ClipboardList } from 'lucide-react';

export function EvalPage() {
  return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-8 h-8 text-[#0ea5e9]" />
        </div>
        <h2 className="text-xl font-bold text-[#f4f4f5] mb-3">Đánh giá Quý</h2>
        <p className="text-[#a1a1aa] text-sm leading-relaxed">
          Tính năng đánh giá quý sẽ có sau khi team có đủ 3 tháng dữ liệu.
        </p>
        <div className="mt-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 text-left">
          <p className="text-xs text-[#a1a1aa] font-medium mb-2">Phase 3 — Sẽ bao gồm:</p>
          <ul className="space-y-1.5 text-xs text-[#a1a1aa]">
            <li>• Form 6 tiêu chí đánh giá (CTR, Retention, Checkpoint, Revision, Improvement, Peer)</li>
            <li>• Live total score với tier color</li>
            <li>• Lịch sử đánh giá theo quý</li>
            <li>• So sánh tự đánh giá vs leader đánh giá</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
