import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Send, Paperclip, Minimize2, Maximize2, X } from "lucide-react";
import { Rnd } from "react-rnd";
import { useDispatch } from "react-redux";
import { senteMail } from "../../redux/slices/mailSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation } from "react-router-dom";

const SentEmailForm = ({
  onClose,
  userEmail,
  initialData = {},
  mode = "new",
}) => {
  const [formData, setFormData] = useState({
    from: userEmail || "you@example.com",
    to: "",
    subject: "",
    body: "",
  });
  const [attachments, setAttachments] = useState([]);
  const [isMinimized, setIsMinimized] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const loadBody = async () => {
      let bodyContent = "";

      if (initialData.id) {
        try {
          // Step 1: get signed URL from backend
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/mail/body/${
              initialData.isSent ? "SENT" : "RECEIVED"
            }/${initialData.id}`
          );

          if (res.data?.data?.bodyUrl) {
            const htmlRes = await fetch(res.data.data.bodyUrl);
            bodyContent = await htmlRes.text();
          }
        } catch (err) {
          console.error("Error fetching email body:", err);
          bodyContent = "";
        }
      }

      // reply / forward formatting
      if (mode === "reply") {
        bodyContent = `<br/><br/>On ${initialData.receivedAt || ""}, ${
          initialData.fromEmail || ""
        } wrote:<br/>${bodyContent}`;
      } else if (mode === "forward") {
        bodyContent = `<br/><br/>---------- Forwarded message ----------<br/>
                   From: ${initialData.fromEmail || ""}<br/>
                   Date: ${initialData.receivedAt || ""}<br/>
                   Subject: ${initialData.subject || ""}<br/><br/>
                   ${bodyContent}`;
      }

      setFormData({
        from: userEmail || "you@example.com",
        to: mode === "reply" ? initialData.fromEmail || "" : "",
        subject:
          mode === "forward"
            ? `Fwd: ${initialData.subject || ""}`
            : mode === "reply"
            ? `Re: ${initialData.subject || ""}`
            : initialData.subject || "",
        body: bodyContent,
      });
    };

    loadBody();
  }, [initialData, userEmail, mode]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileAttachment = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  };

  const currentPath = useLocation().pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    formPayload.append("from", formData.from);
    formPayload.append("to", formData.to);
    formPayload.append("subject", formData.subject);
    formPayload.append("body", formData.body);
    attachments.forEach((att) => formPayload.append("attachments", att.file));

    const data = await dispatch(senteMail(formPayload, currentPath));
    if (data.success) {
      setIsMinimized(true);
    } else {
      toast.error("Failed to send email.");
    }

    setFormData({
      from: userEmail || "you@example.com",
      to: "",
      subject: "",
      body: "",
    });
    setAttachments([]);
  };

  if (isMinimized) {
    return (
      <div
        className="
          fixed 
          sm:right-4 right-3 sm:bottom-4 sm:w-82 h-fit sm:top-auto w-fit 
          bg-white border border-gray-300 rounded-lg shadow-lg p-3
          bottom-2
        "
        onClick={() => setIsMinimized(false)}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium truncate">
            {formData.subject || "New Message"}
          </span>
          <div className="flex gap-2">
            {/* Maximize button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              className="text-gray-500 hover:text-gray-700 sm:block hidden"
            >
              <Maximize2 size={16} />
            </button>

            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
                onClose();
              }}
              className="text-gray-500 hover:text-gray-700 hover:bg-red-100 sm:block hidden p-1 rounded"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: full screen */}
      <div className="fixed inset-0 flex sm:hidden z-50">
        <div className="bg-white border border-gray-300 rounded-none shadow-2xl flex flex-col w-full h-full">
          <Header
            mode={mode}
            onClose={onClose}
            setIsMinimized={setIsMinimized}
          />

          <EmailForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleFileAttachment={handleFileAttachment}
            removeAttachment={removeAttachment}
            formatFileSize={formatFileSize}
            attachments={attachments}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Desktop: draggable window */}
      <div className="hidden sm:block bg-red-900 absolute">
        <Rnd
          default={{
            x: window.innerWidth / 2 - 300,
            y: window.innerHeight / 2 - 225,
            width: 600,
            height: 450,
          }}
          minWidth={400}
          minHeight={300}
          bounds="window"
          dragHandleClassName="drag-handle"
        >
          <div className="bg-white border border-gray-300 rounded-lg shadow-2xl flex flex-col h-full">
            <Header
              mode={mode}
              onClose={onClose}
              setIsMinimized={setIsMinimized}
            />

            <EmailForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleFileAttachment={handleFileAttachment}
              removeAttachment={removeAttachment}
              formatFileSize={formatFileSize}
              attachments={attachments}
              handleSubmit={handleSubmit}
            />
          </div>
        </Rnd>
      </div>
    </>
  );
};

/** ---------------- Header Component ---------------- */
const Header = ({ mode, onClose, setIsMinimized }) => (
  <div className="drag-handle flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg cursor-move">
    <h3 className="text-lg font-semibold text-gray-800">
      {mode === "reply"
        ? "Reply"
        : mode === "forward"
        ? "Forward"
        : "New Message"}
    </h3>
    <div className="flex gap-2">
      <button
        onClick={() => setIsMinimized(true)}
        className="text-gray-500 hover:text-gray-700"
      >
        <Minimize2 size={18} />
      </button>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 hover:bg-red-100 p-1 rounded hidden sm:block"
      >
        <X size={18} />
      </button>
    </div>
  </div>
);

/** ---------------- Email Form Component ---------------- */
const EmailForm = ({
  formData,
  handleInputChange,
  handleFileAttachment,
  removeAttachment,
  formatFileSize,
  attachments,
  handleSubmit,
}) => (
  <form
    onSubmit={handleSubmit}
    className="p-4 flex-1 flex flex-col overflow-hidden"
  >
    {/* From */}
    <div className="mb-3 flex items-center">
      <label className="text-sm font-medium text-gray-700 w-12">From</label>
      <input
        type="email"
        value={formData.from}
        readOnly
        className="flex-1 px-3 py-2 border-0 border-b border-gray-300 focus:outline-none text-sm bg-gray-100"
      />
    </div>

    {/* To */}
    <div className="mb-3 flex items-center">
      <label className="text-sm font-medium text-gray-700 w-12">To</label>
      <input
        type="email"
        value={formData.to}
        onChange={(e) => handleInputChange("to", e.target.value)}
        placeholder="recipient@example.com"
        required
        className="flex-1 px-3 py-2 border-0 border-b border-gray-300 focus:outline-none text-sm"
      />
    </div>

    {/* Subject */}
    <div className="mb-3 flex items-center">
      <label className="text-sm font-medium text-gray-700 w-12">Subject</label>
      <input
        type="text"
        value={formData.subject}
        onChange={(e) => handleInputChange("subject", e.target.value)}
        placeholder="Email subject"
        required
        className="flex-1 px-3 py-2 border-0 border-b border-gray-300 focus:outline-none text-sm"
      />
    </div>

    {/* Body */}
    <div className="mb-4 flex-1 overflow-auto">
      <ReactQuill
        theme="snow"
        value={formData.body}
        onChange={(value) => handleInputChange("body", value)}
        placeholder="Compose your email..."
        className="h-full"
      />
    </div>

    {/* Attachments */}
    {attachments.length > 0 && (
      <div className="mb-4 overflow-auto">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Attachments ({attachments.length})
        </h4>
        <div className="space-y-2 max-h-28 overflow-auto">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
            >
              <div className="flex items-center">
                <Paperclip size={16} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-700">{att.name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({formatFileSize(att.size)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Footer */}
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          <Send size={16} className="mr-2" /> Send
        </button>

        <label className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
          <Paperclip size={16} className="mr-2" /> Attach
          <input
            type="file"
            multiple
            onChange={handleFileAttachment}
            className="hidden"
          />
        </label>
      </div>
    </div>
  </form>
);

export default SentEmailForm;
