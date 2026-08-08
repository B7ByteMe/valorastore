import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserAccount, ForumMessage } from '../types';
import { Send, Copy, MessageSquare, ShieldCheck, CheckCheck, AlertCircle } from 'lucide-react';

interface ForumPageProps {
  currentUser: UserAccount | null;
  onOpenAuthModal: () => void;
}

const FORUM_LIMITS = {
  text: { max: 500 }
};

const BANNED_WORDS = ['kasino', 'judi', 'slot', 'gacor', 'bodoh', 'anjing', 'babi', 'bangsat', 'kontol', 'memek', 'ngentot', 'porn', 'bokep'];

const containsBannedWords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return BANNED_WORDS.some(word => lowerText.includes(word));
};

const hasRepetitivePattern = (text: string): boolean => {
  // Cegah pengulangan karakter yang sama terus menerus (lebih dari 7x)
  if (/(.)\1{7,}/.test(text)) return true;
  
  // Cegah pengulangan pola kata/frasa berlebihan (misal: "123123123123")
  if (/^(.+?)\1{4,}$/.test(text)) return true;

  // Cegah terlalu banyak baris baru (lebih dari 5 baris beruntun)
  if (/\n{4,}/.test(text)) return true;
  
  return false;
};

// Rate limiting state using localStorage for forum
const checkForumRateLimit = (): { allowed: boolean; remainingSec: number } => {
  const lastSubmitStr = localStorage.getItem('lastForumSubmitTime');
  if (!lastSubmitStr) return { allowed: true, remainingSec: 0 };
  
  const lastSubmit = parseInt(lastSubmitStr, 10);
  const now = Date.now();
  const diffSec = Math.floor((now - lastSubmit) / 1000);
  // Rate limit 10 seconds for forum
  const limitSec = 10;
  
  if (diffSec < limitSec) {
    return { allowed: false, remainingSec: limitSec - diffSec };
  }
  return { allowed: true, remainingSec: 0 };
};

const markForumSubmitTime = () => {
  localStorage.setItem('lastForumSubmitTime', Date.now().toString());
};

export const ForumPage: React.FC<ForumPageProps> = ({ currentUser, onOpenAuthModal }) => {
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Fetch messages real-time
  useEffect(() => {
    const q = query(collection(db, 'forum_messages'), orderBy('createdAt', 'asc'), limit(150));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as ForumMessage[];
      
      setMessages(data);
      
      // Auto scroll down if user is near bottom
      if (autoScroll && messagesEndRef.current) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });
    
    return () => unsub();
  }, [autoScroll]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setAutoScroll(isNearBottom);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendError(null);
    if (!currentUser) {
      onOpenAuthModal();
      return;
    }
    
    if (!newMessage.trim()) return;
    const text = newMessage.trim();

    // =====================================
    // VALIDASI KONTEN (ANTI-SPAM)
    // =====================================
    if (text.length > FORUM_LIMITS.text.max) {
      setSendError(`Pesan terlalu panjang (maksimal ${FORUM_LIMITS.text.max} karakter).`);
      return;
    }

    if (containsBannedWords(text)) {
      setSendError('Pesan mengandung kata-kata yang tidak pantas atau dilarang.');
      return;
    }

    if (hasRepetitivePattern(text)) {
      setSendError('Pesan mengandung pola berulang yang terindikasi sebagai spam.');
      return;
    }

    const rateLimit = checkForumRateLimit();
    if (!rateLimit.allowed) {
      setSendError(`Tunggu ${rateLimit.remainingSec} detik lagi sebelum mengirim pesan baru.`);
      return;
    }

    setNewMessage(''); // optimistic clear
    setAutoScroll(true); // force scroll to bottom on send

    try {
      await addDoc(collection(db, 'forum_messages'), {
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatarUrl || null,
        userRole: currentUser.role,
        text,
        createdAt: Date.now()
      });
      markForumSubmitTime();
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
      setSendError('Gagal mengirim pesan ke server.');
      setNewMessage(text); // restore text if failed
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (ts: number) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-64px)] max-w-4xl mx-auto w-full bg-gray-50 border-x border-gray-200 shadow-sm relative">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">Global Forum Chat</h2>
            <p className="text-xs text-gray-500 font-medium">Diskusi publik sesama User & Developer Valora Store</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
            <MessageSquare className="w-12 h-12 text-gray-300" />
            <p className="text-sm font-medium">Belum ada obrolan. Jadilah yang pertama menyapa!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = currentUser?.id === msg.userId;
            const showAvatar = !isMe && (i === 0 || messages[i - 1].userId !== msg.userId);
            const showName = !isMe && (i === 0 || messages[i - 1].userId !== msg.userId);

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}>
                <div className={`flex max-w-[85%] sm:max-w-[75%] gap-2 sm:gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar (Only for others) */}
                  {!isMe && (
                    <div className="w-8 h-8 shrink-0 mt-1">
                      {showAvatar ? (
                        <img 
                          src={msg.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                          alt={msg.userName}
                          className="w-full h-full rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-8 h-8" /> /* placeholder for alignment */
                      )}
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    
                    {/* Name & Role (Only for others) */}
                    {showName && (
                      <div className="flex items-center gap-1.5 mb-1 ml-1">
                        <span className="text-xs font-bold text-gray-700">{msg.userName}</span>
                        {(msg.userRole === 'admin' || msg.userRole === 'developer') && (
                          <span className="flex items-center gap-0.5 text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" />
                            {msg.userRole}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Bubble */}
                    <div className="group relative flex items-start gap-2">
                      {/* Copy Button (Left if me, Right if other) */}
                      {isMe && (
                        <button 
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                          title="Salin Pesan"
                        >
                          {copiedId === msg.id ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}

                      <div className={`px-4 py-2.5 rounded-2xl text-[13px] sm:text-sm leading-relaxed shadow-xs relative ${
                        isMe 
                          ? 'bg-emerald-600 text-white rounded-tr-sm' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                      }`}>
                        {msg.text.split('\n').map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            {idx < msg.text.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                        
                        <div className={`text-[9px] sm:text-[10px] mt-1.5 font-medium flex items-center justify-end gap-1 ${isMe ? 'text-emerald-200' : 'text-gray-400'}`}>
                          {formatTime(msg.createdAt)}
                          {isMe && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>

                      {/* Copy Button (Right if other) */}
                      {!isMe && (
                        <button 
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                          title="Salin Pesan"
                        >
                          {copiedId === msg.id ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
        {sendError && (
          <div className="mb-3 p-2 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{sendError}</span>
          </div>
        )}
        {currentUser ? (
          <form onSubmit={handleSendMessage} className={`flex items-end gap-2 sm:gap-3 bg-gray-50 border rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-400 transition-all ${newMessage.length > FORUM_LIMITS.text.max ? 'border-rose-400 bg-rose-50' : 'border-gray-200'}`}>
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  setSendError(null);
                }}
                maxLength={FORUM_LIMITS.text.max + 50}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Ketik pesan..."
                className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 px-3 sm:px-4 text-sm text-gray-800 placeholder-gray-400"
                rows={1}
              />
              <span className={`absolute right-2 bottom-2 text-[10px] font-medium ${newMessage.length > FORUM_LIMITS.text.max ? 'text-rose-500' : 'text-gray-400'}`}>
                {newMessage.length}/{FORUM_LIMITS.text.max}
              </span>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || newMessage.length > FORUM_LIMITS.text.max}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl transition-colors shrink-0 m-0.5"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center space-y-3">
            <p className="text-sm font-semibold text-gray-600">Anda harus masuk untuk ikut mengobrol.</p>
            <button 
              onClick={onOpenAuthModal}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs"
            >
              Masuk Sekarang
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
