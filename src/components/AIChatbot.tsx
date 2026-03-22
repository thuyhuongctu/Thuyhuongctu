import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Loader2, 
  Search, 
  Brain, 
  Image as ImageIcon, 
  Upload,
  Sparkles,
  User,
  Bot,
  ChevronDown,
  Globe
} from 'lucide-react';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  content: string;
  type?: 'text' | 'thinking' | 'search';
  image?: string;
}

interface AIChatbotProps {
  lang: 'vi' | 'en';
}

const AIChatbot: React.FC<AIChatbotProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'standard' | 'thinking' | 'search'>('standard');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSend = async () => {
    if (!input.trim() && !imageFile) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input,
      image: selectedImage || undefined
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setImageFile(null);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let responseText = "";
      
      if (mode === 'search') {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: input,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });
        responseText = response.text || "";
      } else if (mode === 'thinking') {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: input,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
          }
        });
        responseText = response.text || "";
      } else {
        // Standard or Image Analysis
        const parts: any[] = [{ text: input }];
        
        if (imageFile) {
          const base64Data = await fileToBase64(imageFile);
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: imageFile.type
            }
          });
        }

        const response = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: { parts },
          config: {
            systemInstruction: lang === 'vi' 
              ? "Bạn là một trợ lý nghiên cứu học thuật chuyên về luận án về Quốc tế hóa và Hiệu quả kinh doanh tại Châu Á. Hãy trả lời một cách chuyên nghiệp, chính xác và có chiều sâu học thuật."
              : "You are an academic research assistant specializing in a dissertation on Internationalization and Business Performance in Asia. Respond professionally, accurately, and with academic depth."
          }
        });
        responseText = response.text || "";
      }

      const aiMessage: Message = { 
        role: 'model', 
        content: responseText,
        type: mode === 'thinking' ? 'thinking' : (mode === 'search' ? 'search' : 'text')
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: lang === 'vi' ? "Xin lỗi, đã có lỗi xảy ra khi kết nối với hệ thống." : "Sorry, an error occurred while connecting to the system." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center border border-white/20"
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 z-50 w-full max-w-[400px] h-[600px] flex flex-col academic-card overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-[#0F172A] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold italic tracking-tight">Evidence Explorer Assistant</h3>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Selector */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 p-2 gap-2 bg-slate-50/50 dark:bg-slate-900/50">
              <button 
                onClick={() => setMode('standard')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${mode === 'standard' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <MessageSquare className="w-3 h-3" />
                {lang === 'vi' ? 'Cơ bản' : 'Standard'}
              </button>
              <button 
                onClick={() => setMode('thinking')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${mode === 'thinking' ? 'bg-white dark:bg-slate-800 shadow-sm text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Brain className="w-3 h-3" />
                {lang === 'vi' ? 'Tư duy' : 'Thinking'}
              </button>
              <button 
                onClick={() => setMode('search')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${mode === 'search' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Globe className="w-3 h-3" />
                {lang === 'vi' ? 'Tìm kiếm' : 'Search'}
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white dark:bg-[#1A1A18]">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-indigo-500" />
                  </div>
                  <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-white mb-2 italic">
                    {lang === 'vi' ? 'Chào mừng bạn đến với Trợ lý Nghiên cứu' : 'Welcome to Research Assistant'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {lang === 'vi' 
                      ? 'Tôi có thể giúp bạn giải đáp các thắc mắc về nghiên cứu, phân tích dữ liệu hoặc tìm kiếm thông tin học thuật mới nhất.' 
                      : 'I can help you answer research queries, analyze data, or search for the latest academic information.'}
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={`msg-${i}-${msg.role}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-100 dark:bg-slate-800'}`}>
                      {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-500" />}
                    </div>
                    <div className="space-y-2">
                      {msg.image && (
                        <img src={msg.image} alt="Uploaded" className="max-w-full rounded-lg border border-slate-200 dark:border-slate-800" />
                      )}
                      <div className={`p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-slate-50 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-800 shadow-sm'
                      }`}>
                        {msg.type === 'thinking' && (
                          <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-amber-500/20 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                            <Brain className="w-3 h-3" />
                            Deep Thinking Mode
                          </div>
                        )}
                        {msg.type === 'search' && (
                          <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-blue-500/20 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                            <Globe className="w-3 h-3" />
                            Search Grounding Active
                          </div>
                        )}
                        <div className="markdown-body">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                      <span className="text-xs text-slate-500 italic">
                        {mode === 'thinking' ? 'Analyzing complex patterns...' : 'Processing...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800">
              {selectedImage && (
                <div className="mb-3 relative inline-block">
                  <img src={selectedImage} alt="Preview" className="w-20 h-20 object-cover rounded-lg border-2 border-indigo-500" />
                  <button 
                    onClick={() => { setSelectedImage(null); setImageFile(null); }}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-2 shadow-sm focus-within:border-indigo-500 transition-all">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={lang === 'vi' ? 'Hỏi trợ lý nghiên cứu...' : 'Ask research assistant...'}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm p-2 resize-none max-h-32 custom-scrollbar"
                    rows={1}
                  />
                  <div className="flex items-center justify-between px-2 pt-1">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
                        title="Upload Image"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                      {input.length} chars
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleSend}
                  disabled={isLoading || (!input.trim() && !imageFile)}
                  className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
