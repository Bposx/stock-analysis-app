import { useEffect, useState, FormEvent } from "react";
import { MessageSquare, ThumbsUp, Send, TrendingUp, TrendingDown, MessageCircle, User } from "lucide-react";
import { commentsApi, CommentItem } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";

interface Props {
  symbol: string;
  stockName?: string;
}

function timeAgo(dateString: string, lang: string): string {
  try {
    const now = new Date();
    const past = new Date(dateString.endsWith("Z") ? dateString : dateString + "Z");
    const diffSec = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffSec < 60) {
      if (lang === "lo") return "ຫາກໍ່ໂພສ";
      if (lang === "th") return "เมื่อสักครู่";
      if (lang === "zh") return "刚刚";
      return "just now";
    }
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
      if (lang === "lo") return `${diffMin} ນາທີກ່ອນ`;
      if (lang === "th") return `${diffMin} นาทีที่แล้ว`;
      if (lang === "zh") return `${diffMin}分钟前`;
      return `${diffMin}m ago`;
    }
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) {
      if (lang === "lo") return `${diffHours} ຊົ່ວໂມງກ່ອນ`;
      if (lang === "th") return `${diffHours} ชั่วโมงที่แล้ว`;
      if (lang === "zh") return `${diffHours}小时前`;
      return `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
      if (lang === "lo") return `${diffDays} ມື້ກ່ອນ`;
      if (lang === "th") return `${diffDays} วันที่แล้ว`;
      if (lang === "zh") return `${diffDays}天前`;
      return `${diffDays}d ago`;
    }
    return past.toLocaleDateString();
  } catch {
    return dateString.substring(0, 10);
  }
}

export default function CommentSection({ symbol, stockName }: Props) {
  const { language } = useLanguage();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [authorName, setAuthorName] = useState(() => localStorage.getItem("lao_comment_author") || "");
  const [content, setContent] = useState("");
  const [sentiment, setSentiment] = useState<"BULLISH" | "BEARISH" | "NEUTRAL">("NEUTRAL");
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});

  const cleanSym = symbol.replace("LSX:", "").toUpperCase();

  // Load comments
  const loadComments = async () => {
    try {
      const res = await commentsApi.getBySymbol(cleanSym);
      if (res.data.success) {
        setComments(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadComments();
  }, [cleanSym]);

  // Handle submit comment
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    const trimmedAuthor = authorName.trim() || "ນັກລົງທຶນ";
    localStorage.setItem("lao_comment_author", trimmedAuthor);

    setIsSubmitting(true);
    try {
      const res = await commentsApi.create(cleanSym, {
        author_name: trimmedAuthor,
        content: trimmedContent,
        sentiment,
      });

      if (res.data.success && res.data.data) {
        setComments((prev) => [res.data.data, ...prev]);
        setContent("");
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle like
  const handleLike = async (commentId: number) => {
    if (likedMap[commentId]) return;

    setLikedMap((prev) => ({ ...prev, [commentId]: true }));
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
    );

    try {
      await commentsApi.like(commentId);
    } catch (err) {
      // rollback if failed
      setLikedMap((prev) => ({ ...prev, [commentId]: false }));
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, likes: Math.max(0, c.likes - 1) } : c))
      );
    }
  };

  const uiText = {
    lo: {
      title: "ຄວາມຄິດເຫັນ & ມຸມມອງນັກລົງທຶນ",
      subtitle: `ແລກປ່ຽນທັດສະນະ ແລະ ວິເຄາະຫຸ້ນ ${stockName || cleanSym}`,
      namePlaceholder: "ຊື່ ຫຼື ນາມແຝງຂອງທ່ານ (ເຊັ່ນ: Somxai)",
      commentPlaceholder: "ແບ່ງປັນມຸມມອງ, ຂ່າວສານ ຫຼື ຄຳຖາມກ່ຽວກັບຫຸ້ນນີ້...",
      postBtn: "ສົ່ງຄວາມເຫັນ",
      posting: "ກຳລັງສົ່ງ...",
      bullish: "ຂາຂຶ້ນ (Bullish)",
      bearish: "ຂາລົງ (Bearish)",
      neutral: "ທົ່ວໄປ (Neutral)",
      emptyTitle: "ຍັງບໍ່ທັນມີຄຳຄິດເຫັນ",
      emptyDesc: "ເປັນຄົນທຳອິດທີ່ເລີ່ມຕົ້ນການສົນທະນາກ່ຽວກັບຫຸ້ນນີ້!",
      commentsCount: "ຄວາມຄິດເຫັນ",
    },
    th: {
      title: "ความคิดเห็น & มุมมองนักลงทุน",
      subtitle: `แลกเปลี่ยนทัศนะและวิเคราะห์หุ้น ${stockName || cleanSym}`,
      namePlaceholder: "ชื่อหรือนามแฝงของคุณ",
      commentPlaceholder: "แบ่งปันมุมมอง ข่าวสาร หรือคำถามเกี่ยวกับหุ้นนี้...",
      postBtn: "ส่งความคิดเห็น",
      posting: "กำลังส่ง...",
      bullish: "ขาขึ้น (Bullish)",
      bearish: "ขาลง (Bearish)",
      neutral: "ทั่วไป (Neutral)",
      emptyTitle: "ยังไม่มีความคิดเห็น",
      emptyDesc: "ร่วมเป็นคนแรกที่เปิดการสนทนาเกี่ยวกับหุ้นนี้!",
      commentsCount: "ความคิดเห็น",
    },
    en: {
      title: "Investor Opinions & Discussions",
      subtitle: `Share ideas and analysis for ${stockName || cleanSym}`,
      namePlaceholder: "Your name or alias",
      commentPlaceholder: "Share your perspective, news or questions about this stock...",
      postBtn: "Post Comment",
      posting: "Posting...",
      bullish: "Bullish",
      bearish: "Bearish",
      neutral: "Neutral",
      emptyTitle: "No comments yet",
      emptyDesc: "Be the first to share your thoughts on this stock!",
      commentsCount: "Comments",
    },
    zh: {
      title: "投资者讨论与观点",
      subtitle: `分享对 ${stockName || cleanSym} 的看法与分析`,
      namePlaceholder: "您的称呼或昵称",
      commentPlaceholder: "分享关于此股票的观点、消息或疑问...",
      postBtn: "发表评论",
      posting: "发表中...",
      bullish: "看涨 (Bullish)",
      bearish: "看跌 (Bearish)",
      neutral: "中性 (Neutral)",
      emptyTitle: "暂无评论",
      emptyDesc: "成为第一个对此股票发表观点的人！",
      commentsCount: "条评论",
    },
  }[language] || {
    title: "ຄວາມຄິດເຫັນ & ມຸມມອງນັກລົງທຶນ",
    subtitle: `ແລກປ່ຽນທັດສະນະ ແລະ ວິເຄາະຫຸ້ນ ${stockName || cleanSym}`,
    namePlaceholder: "ຊື່ ຫຼື ນາມແຝງຂອງທ່ານ",
    commentPlaceholder: "ແບ່ງປັນມຸມມອງ, ຂ່າວສານ ຫຼື ຄຳຖາມກ່ຽວກັບຫຸ້ນນີ້...",
    postBtn: "ສົ່ງຄວາມເຫັນ",
    posting: "ກຳລັງສົ່ງ...",
    bullish: "ຂາຂຶ້ນ (Bullish)",
    bearish: "ຂາລົງ (Bearish)",
    neutral: "ທົ່ວໄປ (Neutral)",
    emptyTitle: "ຍັງບໍ່ທັນມີຄຳຄິດເຫັນ",
    emptyDesc: "ເປັນຄົນທຳອິດທີ່ເລີ່ມຕົ້ນການສົນທະນາກ່ຽວກັບຫຸ້ນນີ້!",
    commentsCount: "ຄວາມຄິດເຫັນ",
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{uiText.title}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-blue-950/70 text-sky-700 dark:text-sky-400 font-mono font-medium">
                {comments.length} {uiText.commentsCount}
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">
              {uiText.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Author Name */}
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={uiText.namePlaceholder}
              maxLength={40}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
            />
          </div>

          {/* Sentiment Selection Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setSentiment("BULLISH")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                sentiment === "BULLISH"
                  ? "bg-emerald-500 text-white shadow-xs"
                  : "text-slate-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
              }`}
            >
              <TrendingUp size={14} />
              <span>{uiText.bullish}</span>
            </button>

            <button
              type="button"
              onClick={() => setSentiment("BEARISH")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                sentiment === "BEARISH"
                  ? "bg-rose-500 text-white shadow-xs"
                  : "text-slate-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400"
              }`}
            >
              <TrendingDown size={14} />
              <span>{uiText.bearish}</span>
            </button>

            <button
              type="button"
              onClick={() => setSentiment("NEUTRAL")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                sentiment === "NEUTRAL"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400"
              }`}
            >
              <MessageCircle size={14} />
              <span>{uiText.neutral}</span>
            </button>
          </div>
        </div>

        {/* Comment Textarea */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={uiText.commentPlaceholder}
            rows={3}
            required
            maxLength={1000}
            className="w-full p-3.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400">
            {content.length}/1000
          </span>
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <Send size={15} />
            <span>{isSubmitting ? uiText.posting : uiText.postBtn}</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-slate-400 animate-pulse">
            ກຳລັງໂຫຼດຄວາມຄິດເຫັນ...
          </div>
        ) : comments.length === 0 ? (
          <div className="py-12 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <MessageSquare size={22} />
            </div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-gray-300 mb-1">
              {uiText.emptyTitle}
            </h4>
            <p className="text-xs text-slate-500 dark:text-gray-500 max-w-sm mx-auto">
              {uiText.emptyDesc}
            </p>
          </div>
        ) : (
          comments.map((item) => {
            const isLiked = likedMap[item.id];
            const sentimentBadge =
              item.sentiment === "BULLISH" ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <TrendingUp size={12} />
                  <span>{uiText.bullish}</span>
                </span>
              ) : item.sentiment === "BEARISH" ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  <TrendingDown size={12} />
                  <span>{uiText.bearish}</span>
                </span>
              ) : null;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-150 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {item.author_name.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.author_name}
                        </span>
                        {sentimentBadge}
                      </div>
                      <span className="text-xs text-slate-400">
                        {timeAgo(item.created_at, language)}
                      </span>
                    </div>
                  </div>

                  {/* Like Button */}
                  <button
                    type="button"
                    onClick={() => handleLike(item.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isLiked
                        ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30"
                        : "text-slate-500 dark:text-gray-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/60"
                    }`}
                  >
                    <ThumbsUp size={13} className={isLiked ? "fill-sky-500" : ""} />
                    <span>{item.likes > 0 ? item.likes : ""}</span>
                  </button>
                </div>

                <p className="text-sm text-slate-700 dark:text-gray-200 leading-relaxed whitespace-pre-line pl-10.5">
                  {item.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
