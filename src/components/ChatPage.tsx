import React from 'react';
import { 
  RefreshCw, Facebook, ChevronDown, Search, ShieldAlert, MessageSquare, 
  ChevronRight, Activity, Settings, Download, ImageIcon, X, Mic, Paperclip, Send 
} from 'lucide-react';
import { SafeAvatar } from './SafeAvatar';

interface ChatPageProps {
  pages: any[];
  conversations: any[];
  selectedPage: any;
  setSelectedPage: (page: any) => void;
  selectedPageIds: string[];
  chatSearch: string;
  setChatSearch: (search: string) => void;
  chatFilter: 'all' | 'unread';
  setChatFilter: (filter: 'all' | 'unread') => void;
  showChatDetail: boolean;
  setShowChatDetail: (show: boolean) => void;
  selectedConversation: any;
  setSelectedConversation: (conv: any) => void;
  replyMessage: string;
  setReplyMessage: (msg: string) => void;
  pendingFile: File | null;
  setPendingFile: (file: File | null) => void;
  isRecording: boolean;
  recordingTime: number;
  startRecording: () => void;
  stopRecording: () => void;
  isSending: boolean;
  handleSendFile: () => void;
  handleReply: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  isLoading: boolean;
  getPages: () => void | Promise<void>;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  pages,
  conversations,
  selectedPage,
  setSelectedPage,
  selectedPageIds,
  chatSearch,
  setChatSearch,
  chatFilter,
  setChatFilter,
  showChatDetail,
  setShowChatDetail,
  selectedConversation,
  setSelectedConversation,
  replyMessage,
  setReplyMessage,
  pendingFile,
  setPendingFile,
  isRecording,
  recordingTime,
  startRecording,
  stopRecording,
  isSending,
  handleSendFile,
  handleReply,
  handleFileChange,
  isLoading,
  getPages
}) => {
  return (
    <div className="h-full flex flex-col lg:flex-row gap-0 bg-white rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl">
      {/* Left Panel: Conversation List */}
      <div className={`w-full lg:w-[26rem] bg-white border-r border-slate-100 flex flex-col h-full ${showChatDetail ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 lg:p-8 border-b border-slate-50 space-y-4 lg:space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-xl lg:text-2xl tracking-tight text-slate-900">Inbox</h3>
            <button onClick={getPages} className="p-2.5 lg:p-3 bg-indigo-50 text-indigo-600 rounded-xl lg:rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
              <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>

          {/* Page Filter Dropdown */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Facebook className="w-4 h-4" />
            </div>
            <select 
              value={selectedPage?.id || ""} 
              onChange={(e) => {
                const page = e.target.value === "all" ? { id: "all", name: "Select All Pages" } : pages.find(p => p.id === e.target.value);
                setSelectedPage(page);
              }}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-10 py-4 text-[10px] font-black uppercase tracking-widest focus:bg-white focus:border-indigo-100 outline-none appearance-none transition-all cursor-pointer"
            >
              <option value="">Select Facebook Page</option>
              {pages.filter(p => selectedPageIds.includes(p.id)).length > 0 && (
                <option value="all">Select All Pages</option>
              )}
              {pages.filter(p => selectedPageIds.includes(p.id)).map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Search & Tabs */}
          <div className="space-y-4">
            <div className="relative">
              <input 
                placeholder="Search messages..." 
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-5 py-4 text-xs font-black focus:bg-white focus:border-indigo-100 outline-none transition-all" 
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            <div className="flex bg-slate-50 p-1.5 rounded-2xl">
              <button 
                onClick={() => setChatFilter('all')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${chatFilter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                All Chats
              </button>
              <button 
                onClick={() => setChatFilter('unread')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${chatFilter === 'unread' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Unread
              </button>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto pb-10 scrollbar-hide">
          {!selectedPage ? (
            <div className="p-20 text-center flex flex-col items-center gap-4 opacity-30">
              <ShieldAlert className="w-12 h-12" />
              <p className="text-[10px] font-black uppercase tracking-widest">Select a page to view chats</p>
            </div>
          ) : isLoading ? (
            <div className="p-20 text-center animate-pulse">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl mx-auto mb-4"></div>
              <div className="h-2 w-24 bg-slate-100 mx-auto rounded-full"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-20 text-center opacity-30 flex flex-col items-center gap-4">
              <MessageSquare className="w-12 h-12" />
              <p className="text-[10px] font-black uppercase tracking-widest">No conversations found</p>
            </div>
          ) : (
            (conversations || []).filter((c: any) => {
              const activePageId = c._associatedPageId || selectedPage?.id;
              const other = c.participants?.data?.find((p: any) => p.id !== activePageId);
              const matchesSearch = other?.name?.toLowerCase().includes(chatSearch.toLowerCase());
              const isUnread = c.unread_count > 0 || c.unread === true || (c.messages?.data?.[0]?.from?.id !== (c._associatedPageId || selectedPage?.id) && selectedConversation?.id !== c.id);
              const matchesUnread = chatFilter === 'all' || isUnread;
              return matchesSearch && matchesUnread;
            }).map((c: any) => {
              const activePageId = c._associatedPageId || selectedPage?.id;
              const other = c.participants.data.find((p: any) => p.id !== activePageId);
              const isActive = selectedConversation?.id === c.id;
              const lastMsg = c.messages?.data?.[0]?.message;
              const isUnread = c.unread_count > 0 || c.unread === true || (c.messages?.data?.[0]?.from?.id !== activePageId && !isActive);
              return (
                <button 
                  key={c.id}
                  onClick={() => {
                    setSelectedConversation(c);
                    setShowChatDetail(true);
                    // Clear unread property immediately client-side
                    c.unread_count = 0;
                    c.unread = false;
                  }}
                  className={`w-full p-4 sm:p-5 lg:p-6 flex gap-3 sm:gap-4 transition-all group relative border-b border-slate-50/55 ${isActive ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                >
                  {isActive && <div className="absolute left-0 top-4 bottom-4 w-0.5 sm:w-1 bg-indigo-600 rounded-r-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>}
                  <div className="relative shrink-0">
                    <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all shadow-sm ${isActive ? 'border-indigo-600 scale-105 shadow-xl' : 'border-white bg-slate-100'}`}>
                      <SafeAvatar src={other?.picture?.data?.url} name={other?.name} className="w-full h-full" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0 pr-1 sm:pr-4">
                    <div className="flex justify-between items-center mb-1">
                      <p className={`font-black text-[10px] sm:text-xs uppercase tracking-tight truncate ${isActive ? 'text-indigo-900' : isUnread ? 'text-slate-900' : 'text-slate-700'}`}>{other?.name || 'Customer'}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-black opacity-30 uppercase">{new Date(c.updated_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isUnread && (
                          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.8)] shrink-0"></div>
                        )}
                      </div>
                    </div>
                    <p className={`text-[10px] sm:text-[11px] truncate leading-relaxed ${isActive ? 'text-indigo-600/70 font-semibold' : isUnread ? 'text-slate-900 font-extrabold' : 'text-slate-400 font-medium'}`}>{lastMsg || 'Sent an attachment...'}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Panel: Chat View */}
      <div className={`flex-1 bg-[#F8FAFC] flex flex-col h-full overflow-hidden relative ${showChatDetail ? 'fixed inset-0 z-[60] bg-white translate-x-0' : 'hidden lg:flex'}`}>
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-3 lg:p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between z-10 shadow-sm sticky top-0">
              <div className="flex items-center gap-3 lg:gap-5">
                <button 
                  onClick={() => {
                    setSelectedConversation(null);
                    setShowChatDetail(false);
                  }}
                  className="p-2 -ml-1 rounded-xl hover:bg-slate-100 lg:hidden text-slate-400"
                >
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
                <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-xl lg:rounded-[1.5rem] overflow-hidden border-2 lg:border-4 border-slate-100 shadow-lg lg:shadow-xl">
                  {(() => {
                    const activePageId = selectedConversation._associatedPageId || selectedPage?.id;
                    const other = selectedConversation.participants.data.find((p: any) => p.id !== activePageId);
                    return <SafeAvatar src={other?.picture?.data?.url} name={other?.name} className="w-full h-full" />;
                  })()}
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-sm lg:text-xl text-slate-900 tracking-tight truncate max-w-[120px] sm:max-w-none">{selectedConversation.participants.data.find((p: any) => p.id !== (selectedConversation._associatedPageId || selectedPage?.id))?.name || 'Conversation'}</h4>
                  <div className="flex items-center gap-1.5 lg:mt-1">
                    <div className="w-1.5 lg:w-2 h-1.5 lg:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p className="text-[8px] lg:text-[10px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap font-mono tracking-wider">Perseus Bot</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                <button className="hidden sm:flex p-4 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-2xl shadow-sm transition-all"><Activity className="w-5 h-5" /></button>
                <button className="p-2.5 lg:p-4 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-xl lg:rounded-2xl shadow-sm transition-all"><Settings className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-12 space-y-10 scrollbar-hide">
              {[...(selectedConversation.messages?.data || [])].reverse().map((m: any, idx: number) => {
                const isMe = m.from.id === (selectedConversation._associatedPageId || selectedPage?.id);
                const sender = selectedConversation.participants.data.find((p: any) => p.id === m.from.id);
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start items-end gap-5'} group`}>
                    {!isMe && (
                      <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-xl shadow-slate-200/50 mb-1 shrink-0">
                        <SafeAvatar src={sender?.picture?.data?.url} name={sender?.name} className="w-full h-full" />
                      </div>
                    )}
                    <div className="max-w-[70%]">
                      {!isMe && <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{sender?.name || 'Customer'}</p>}
                      <div className={`p-6 rounded-[2.25rem] text-sm font-semibold leading-relaxed shadow-xl ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-100' 
                          : 'bg-white text-slate-800 rounded-bl-none shadow-slate-200/50'
                      }`}>
                        {m.message}
                        {m.attachments?.data?.map((att: any, attIdx: number) => (
                          <div key={attIdx} className="mt-5 rounded-2xl overflow-hidden shadow-2xl">
                            {att.type === 'image' && <img src={att.payload?.url?.startsWith('http') ? `/api/proxy-image?url=${encodeURIComponent(att.payload.url)}` : (att.payload?.url || '')} alt="Attachment" className="max-w-full hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />}
                            {att.type === 'audio' && <div className="bg-black/5 p-4"><audio controls className="w-full h-8 opacity-80"><source src={att.payload?.url} /></audio></div>}
                            {att.type === 'file' && (
                              <a href={att.payload?.url} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-4 rounded-xl text-xs font-black transition-all ${isMe ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-slate-50 hover:bg-slate-100'}`}>
                                <Download className="w-5 h-5" /> Download Attachment
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className={`text-[8px] mt-2 font-black uppercase tracking-widest opacity-30 ${isMe ? 'text-right pr-2' : 'text-left pl-2'}`}>{new Date(m.created_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-10 bg-white border-t border-slate-100 relative">
              {pendingFile && (
                <div className="absolute left-10 right-10 bottom-full mb-6 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-2xl flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Upload Queue</p>
                        <p className="text-xs font-black truncate max-w-xs">{pendingFile.name}</p>
                      </div>
                    </div>
                    <button onClick={() => setPendingFile(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {isRecording && (
                <div className="absolute left-10 right-10 bottom-full mb-6 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="bg-red-600 text-white p-6 rounded-[2.5rem] shadow-2xl flex justify-between items-center animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white text-red-600 rounded-full flex items-center justify-center animate-ping duration-1000"><Mic className="w-5 h-5" /></div>
                      <p className="text-xs font-black uppercase tracking-widest">RECORDING VOICE... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</p>
                    </div>
                    <button onClick={stopRecording} className="bg-white text-red-600 px-8 py-3 rounded-2xl text-xs font-black hover:bg-slate-100 transition-all shadow-xl">STOP & SEND</button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-5">
                <div className="flex gap-2 bg-slate-50 p-2 rounded-[2rem]">
                  <label className="w-14 h-14 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95">
                    <Paperclip className="w-5 h-5" />
                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'file')} />
                  </label>
                  <button 
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm hover:shadow-md active:scale-95 ${isRecording ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-white hover:text-indigo-600'}`}>
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 relative">
                  <input 
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (pendingFile ? handleSendFile() : handleReply())}
                    placeholder="Reply to this conversation..."
                    className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-100 rounded-[2rem] px-8 py-5 text-sm font-bold outline-none transition-all pr-24 shadow-inner"
                  />
                  <button 
                    onClick={pendingFile ? handleSendFile : handleReply}
                    disabled={isSending || (!replyMessage.trim() && !pendingFile)}
                    className="absolute right-3 top-3 bottom-3 w-16 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-90 disabled:opacity-30"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center bg-[#F8FAFC]">
            <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center mb-10 rotate-6 hover:rotate-0 transition-transform duration-700 border border-slate-50">
              <MessageSquare className="w-16 h-16 text-indigo-50" />
            </div>
            <h4 className="text-3xl font-black text-slate-900 tracking-tight mb-4">No Conversation Selected</h4>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.25em] max-w-[15rem] leading-loose">Choose a profile from your list to initiate command control.</p>
          </div>
        )}
      </div>
    </div>
  );
};
