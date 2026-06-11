import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

const COMMENTS_PER_PAGE = 50;

export default function Dashboard() {
  const [pageId, setPageId] = useState("");
  const [videos, setVideos] = useState([]);
  const [videoComments, setVideoComments] = useState({});
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);
  const commentContainerRef = useRef(null);

  const loadVideos = async () => {
    if (!pageId.trim()) return;
    setLoading(true);
    const res = await axios.get(
      `http://localhost:5000/api/facebook/videos/${pageId}`
    );
    setVideos(res.data.data || []);
    setSelectedVideo(null);
    setLoading(false);
  };

  const loadComments = async (videoId) => {
    setSelectedVideo(videoId);
    setVisibleCount(COMMENTS_PER_PAGE);
    setLoadingComments(true);

    if (!videoComments[videoId]) {
      const res = await axios.get(
        `http://localhost:5000/api/facebook/comments/${videoId}`
      );
      setVideoComments((prev) => ({
        ...prev,
        [videoId]: res.data.data || [],
      }));
    }
    setLoadingComments(false);
  };

  const exportComments = () => {
    if (!selectedVideo || !videoComments[selectedVideo]) return;
    const comments = videoComments[selectedVideo];
    const csvHeader = "Comment ID,User ID,User Name,Message,Created Time\n";
    const csvRows = comments.map((c) => {
      const message = (c.message || "").replace(/"/g, '""');
      const userId = c.from?.id || "";
      const userName = c.from?.name || "Unknown";
      return `"${c.id}","${userId}","${userName}","${message}","${c.created_time}"`;
    });
    const csvContent = csvHeader + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `comments_${selectedVideo}.csv`);
  };

  const handleScroll = useCallback(() => {
    const container = commentContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      setVisibleCount((prev) => prev + COMMENTS_PER_PAGE);
    }
  }, []);

  const currentComments = videoComments[selectedVideo] || [];
  const visibleComments = currentComments.slice(0, visibleCount);
  const selectedVideoData = videos.find((v) => v.id === selectedVideo);
  const hasMore = visibleCount < currentComments.length;

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "var(--color-bg-main)" }}>

      {/* TOP BAR */}
      <div className="flex items-end gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
            Page ID
          </label>
          <input
            className="w-full p-3 rounded text-sm"
            style={{
              backgroundColor: "var(--color-bg-input)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
            }}
            placeholder="Enter Facebook Page ID"
            value={pageId}
            onChange={(e) => setPageId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadVideos()}
          />
        </div>
        <button
          onClick={loadVideos}
          disabled={loading}
          className="px-6 py-3 rounded text-sm font-medium"
          style={{
            backgroundColor: "var(--color-btn-primary)",
            color: "#FFFFFF",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Loading..." : "Load Videos"}
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Videos", value: videos.length },
          { label: "Selected Video", value: selectedVideoData?.description?.slice(0, 40) || "None" },
          { label: "Comments Loaded", value: currentComments.length.toLocaleString() },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded"
            style={{
              backgroundColor: "var(--color-stat-bg)",
              border: "1px solid var(--color-border-light)",
            }}
          >
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--color-text-muted)" }}>
              {stat.label}
            </p>
            <p
              className="text-2xl font-semibold truncate"
              style={{ color: i === 0 || i === 2 ? "var(--color-stat-value)" : "var(--color-text-primary)" }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="grid grid-cols-2 gap-6" style={{ minHeight: "60vh" }}>

        {/* VIDEOS PANEL */}
        <div
          className="p-5 rounded flex flex-col"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: "var(--color-text-secondary)" }}>
            Videos ({videos.length})
          </h3>

          <div className="flex-1 overflow-y-auto space-y-2">
            {videos.length === 0 && (
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                No videos loaded yet
              </p>
            )}
            {videos.map((v) => (
              <div
                key={v.id}
                onClick={() => loadComments(v.id)}
                className="p-3 rounded cursor-pointer flex items-center justify-between"
                style={{
                  backgroundColor: selectedVideo === v.id ? "var(--color-bg-hover)" : "var(--color-bg-input)",
                  border: "1px solid",
                  borderColor: selectedVideo === v.id ? "var(--color-primary)" : "var(--color-border-light)",
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "var(--color-text-primary)" }}>
                    {v.description?.slice(0, 80) || "Untitled Video"}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                    ID: {v.id}
                  </p>
                </div>
                <span className="text-xs ml-3 flex-shrink-0" style={{ color: "var(--color-primary-light)" }}>
                  View →
                </span>
              </div>
            ))}
          </div>
        </div>

           {/* COMMENTS PANEL */}
        <div
          className="p-5 rounded flex flex-col"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
              Comments ({currentComments.length.toLocaleString()})
            </h3>
            {currentComments.length > 0 && (
              <button
                onClick={exportComments}
                className="px-4 py-1.5 rounded text-xs font-medium"
                style={{
                  backgroundColor: "var(--color-btn-export)",
                  color: "var(--color-text-primary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                Export CSV
              </button>
            )}
          </div>

          <div
            ref={commentContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto"
            style={{ maxHeight: "60vh" }}
          >
            {loadingComments && (
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Loading comments...
              </p>
            )}

            {!loadingComments && !selectedVideo && (
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                ← Select a video to view comments
              </p>
            )}

            {!loadingComments && selectedVideo && currentComments.length === 0 && (
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                No comments on this video
              </p>
            )}

            {visibleComments.map((c) => (
              <div
                key={c.id}
                className="p-3"
                style={{
                  borderBottom: "1px solid var(--color-border-light)",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: "var(--color-primary-light)" }}>
                    {c.from?.name || "Unknown"}
                  </span>
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {new Date(c.created_time).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
                  {c.message || "(no text)"}
                </p>
              </div>
            ))}

            {hasMore && (
              <div className="p-4 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + COMMENTS_PER_PAGE)}
                  className="text-xs font-medium"
                  style={{ color: "var(--color-primary-light)" }}
                >
                  Showing {visibleCount.toLocaleString()} of {currentComments.length.toLocaleString()} — Load more
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}