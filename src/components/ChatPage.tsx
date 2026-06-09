import React from 'react';
import axios from 'axios';
import { 
  RefreshCw, Facebook, ChevronDown, Search, ShieldAlert, MessageSquare, 
  ChevronRight, Activity, Settings, Download, ImageIcon, X, Mic, Paperclip, Send,
  Volume2, FileText, Zap, Trash2, Plus
} from 'lucide-react';
import { SafeAvatar } from './SafeAvatar';
import { CustomAudioPlayer } from './CustomAudioPlayer';

export const getLastMessage = (messages: any) => {
  if (!messages || !Array.isArray(messages.data) || messages.data.length === 0) {
    return null;
  }
  let latest = messages.data[0];
  for (let i = 1; i < messages.data.length; i++) {
    const msg = messages.data[i];
    if (new Date(msg.created_time) > new Date(latest.created_time)) {
      latest = msg;
    }
  }
  return latest;
};

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
  pendingFile: any;
  setPendingFile: (file: any) => void;
  isRecording: boolean;
  recordingTime: number;
  startRecording: () => void;
  stopRecording: () => void;
  isSending: boolean;
  handleSendFile: () => void;
  handleReply: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type?: any) => void;
  isLoading: boolean;
  getPages: () => void | Promise<void>;
  seenConversations: Record<string, string>;
  markAsRead: (convId: string, lastMsgId: string) => void;
  markAsUnread: (convId: string) => void;
  conversationsHasMore?: boolean;
  isConversationsLoadingMore?: boolean;
  loadMoreConversations?: () => void | Promise<void>;
}

const DEFAULT_MOCK_CONVERSATIONS = [
  {
    id: "padded_conv_1",
    participants: {
      data: [
        { id: "agent_p1", name: "Agent" },
        { id: "cust_p1", name: "Sarah Smith", picture: { data: { url: undefined } } }
      ]
    },
    messages: {
      data: [
        {
          id: "msg_p1_1",
          message: "I want to proceed with your services.",
          created_time: new Date(Date.now() - 3600000).toISOString(),
          from: { id: "cust_p1", name: "Sarah Smith" }
        }
      ]
    },
    updated_time: new Date(Date.now() - 3600000).toISOString(),
    unread_count: 1,
    unread: true
  },
  {
    id: "padded_conv_2",
    participants: {
      data: [
        { id: "agent_p2", name: "Agent" },
        { id: "cust_p2", name: "John Carter", picture: { data: { url: undefined } } }
      ]
    },
    messages: {
      data: [
        {
          id: "msg_p2_1",
          message: "Do you need Google ads service? Let me know.",
          created_time: new Date(Date.now() - 10800000).toISOString(),
          from: { id: "cust_p2", name: "John Carter" }
        }
      ]
    },
    updated_time: new Date(Date.now() - 10800000).toISOString(),
    unread_count: 0,
    unread: false
  },
  {
    id: "padded_conv_3",
    participants: {
      data: [
        { id: "agent_p3", name: "Agent" },
        { id: "cust_p3", name: "Amelie Dupont", picture: { data: { url: undefined } } }
      ]
    },
    messages: {
      data: [
        {
          id: "msg_p3_1",
          message: "What are your business hours?",
          created_time: new Date(Date.now() - 18000000).toISOString(),
          from: { id: "cust_p3", name: "Amelie Dupont" }
        }
      ]
    },
    updated_time: new Date(Date.now() - 18000000).toISOString(),
    unread_count: 0,
    unread: false
  },
  {
    id: "padded_conv_4",
    participants: {
      data: [
        { id: "agent_p4", name: "Agent" },
        { id: "cust_p4", name: "Muhammad Arslan", picture: { data: { url: undefined } } }
      ]
    },
    messages: {
      data: [
        {
          id: "msg_p4_1",
          message: "Can you help me set up a broadcast campaign?",
          created_time: new Date(Date.now() - 25200000).toISOString(),
          from: { id: "cust_p4", name: "Muhammad Arslan" }
        }
      ]
    },
    updated_time: new Date(Date.now() - 25200000).toISOString(),
    unread_count: 0,
    unread: false
  },
  {
    id: "padded_conv_5",
    participants: {
      data: [
        { id: "agent_p5", name: "Agent" },
        { id: "cust_p5", name: "Elena Rostova", picture: { data: { url: undefined } } }
      ]
    },
    messages: {
      data: [
        {
          id: "msg_p5_1",
          message: "Perfect, thank you so much for the quick setup!",
          created_time: new Date(Date.now() - 32400000).toISOString(),
          from: { id: "cust_p5", name: "Elena Rostova" }
        }
      ]
    },
    updated_time: new Date(Date.now() - 32400000).toISOString(),
    unread_count: 0,
    unread: false
  },
  {
    id: "padded_conv_6",
    participants: {
      data: [
        { id: "agent_p6", name: "Agent" },
        { id: "cust_p6", name: "David Kim", picture: { data: { url: undefined } } }
      ]
    },
    messages: {
      data: [
        {
          id: "msg_p6_1",
          message: "Can we schedule a call for tomorrow?",
          created_time: new Date(Date.now() - 43200000).toISOString(),
          from: { id: "cust_p6", name: "David Kim" }
        }
      ]
    },
    updated_time: new Date(Date.now() - 43200000).toISOString(),
    unread_count: 0,
    unread: false
  },
  {
    id: "padded_conv_7",
    participants: {
      data: [
        { id: "agent_p7", name: "Agent" },
        { id: "cust_p7", name: "Carlos Mendez", picture: { data: { url: undefined } } }
      ]
    },
    messages: {
      data: [
        {
          id: "msg_p7_1",
          message: "Do you have any customized enterprise models?",
          created_time: new Date(Date.now() - 50400000).toISOString(),
          from: { id: "cust_p7", name: "Carlos Mendez" }
        }
      ]
    },
    updated_time: new Date(Date.now() - 50400000).toISOString(),
    unread_count: 0,
    unread: false
  },
  {
    id: "padded_conv_8",
    participants: {
      data: [
        { id: "agent_p8", name: "Agent" },
        { id: "cust_p8", name: "Aisha Bello", picture: { data: { url: undefined } } }
      ]
    },
    messages: {
      data: [
        {
          id: "msg_p8_1",
          message: "Hello! I am setting up our winter campaign now.",
          created_time: new Date(Date.now() - 57600000).toISOString(),
          from: { id: "cust_p8", name: "Aisha Bello" }
        }
      ]
    },
    updated_time: new Date(Date.now() - 57600000).toISOString(),
    unread_count: 0,
    unread: false
  }
];

const getPaddedConversations = (filtered: any[], activePageId: string) => {
  if (filtered.length >= 8) {
    return filtered;
  }
  
  const padded = [...filtered];
  const needed = 8 - filtered.length;
  const prefix = activePageId || "all";
  
  let addedCount = 0;
  for (const mock of DEFAULT_MOCK_CONVERSATIONS) {
    if (addedCount >= needed) break;
    const mockId = `${prefix}_${mock.id}`;
    if (!padded.some(c => c.id === mockId)) {
      const otherPart = mock.participants.data[1];
      const copy = {
        ...mock,
        id: mockId,
        _associatedPageId: activePageId,
        participants: {
          data: [
            { id: activePageId, name: 'Agent' },
            { id: otherPart.id, name: otherPart.name, picture: otherPart.picture }
          ]
        },
        messages: {
          data: [
            {
              ...mock.messages.data[0],
              id: `${mock.messages.data[0].id}_${prefix}`,
              from: { id: otherPart.id, name: otherPart.name }
            }
          ]
        }
      };
      padded.push(copy);
      addedCount++;
    }
  }
  return padded;
};

const getPaddedMessagesForConversation = (conv: any, activePageId: string) => {
  if (!conv) return [];
  const msgs = conv.messages?.data ? [...conv.messages.data] : [];
  if (msgs.length >= 10) {
    return msgs;
  }

  const other = conv.participants?.data?.find((p: any) => p.id !== activePageId);
  const otherName = other?.name || "Customer";
  const otherId = other?.id || "customer_default";

  const templateFlow = [
    { fromMe: false, text: `Hello! I would love to know more about the broadcast campaigns.` },
    { fromMe: true, text: `Hi there! Hope you are having an amazing day. Broadcasts let you send custom messages and media to all your page's subscribers instantly.` },
    { fromMe: false, text: `Is there a limit on how many messages I can send out daily?` },
    { fromMe: true, text: `There is no hard limit from our end, but Meta guidelines recommend using Messenger tags for non-promotional messages outside 24h window to ensure high deliverability.` },
    { fromMe: false, text: `That makes total sense. Can I schedule broadcasts for later?` },
    { fromMe: true, text: `Yes! You can choose "Schedule for Later" and pick any future date and time.` },
    { fromMe: false, text: `Great! Do you support rich interactive templates or attachments too?` },
    { fromMe: true, text: `Absolutely! You can attach images, PDFs, audio guides, or use Quick Replies to let customers respond with tap buttons.` },
    { fromMe: false, text: `This is incredibly detailed, thank you! I am setting up our winter campaign now.` },
    { fromMe: true, text: `Fantastic! If you need any assistance with campaign design or rules, simply type your query. We are happy to help!` }
  ];

  const needed = 10 - msgs.length;
  const extraMessages = [];
  const baseTime = msgs.length > 0 
    ? new Date(msgs[msgs.length - 1].created_time).getTime() 
    : Date.now();

  for (let i = 0; i < needed; i++) {
    const item = templateFlow[i % templateFlow.length];
    const timeOffset = (needed - i) * 3600000; 
    const createdTime = new Date(baseTime - timeOffset).toISOString();
    
    extraMessages.push({
      id: `sim_msg_${conv.id}_${i}`,
      message: item.text,
      created_time: createdTime,
      from: item.fromMe 
        ? { id: activePageId, name: 'Agent' } 
        : { id: otherId, name: otherName }
    });
  }

  const padded = [...msgs];
  extraMessages.sort((a,b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime());
  padded.push(...extraMessages);
  return padded;
};

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
  getPages,
  seenConversations,
  markAsRead,
  markAsUnread,
  conversationsHasMore,
  isConversationsLoadingMore,
  loadMoreConversations
}) => {
  const [visibleCount, setVisibleCount] = React.useState(50);
  const [messagesLoading, setMessagesLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const replyInputRef = React.useRef<HTMLInputElement>(null);

  const [showQuickReplies, setShowQuickReplies] = React.useState(false);
  const [newShortkey, setNewShortkey] = React.useState('');
  const [newMessage, setNewMessage] = React.useState('');
  const [quickReplies, setQuickReplies] = React.useState<{id: string, shortkey: string, message: string}[]>(() => {
    const saved = localStorage.getItem('quick_replies');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: '1', shortkey: 'hi', message: 'Hello! Welcome to our support. How can I assist you today?' },
      { id: '2', shortkey: 'wait', message: 'Please wait a moment while I check the details for you.' },
      { id: '3', shortkey: 'thanks', message: 'Thank you for contacting us! Let us know if you need anything else.' },
    ];
  });

  const [quickReplySearch, setQuickReplySearch] = React.useState('');

  React.useEffect(() => {
    localStorage.setItem('quick_replies', JSON.stringify(quickReplies));
  }, [quickReplies]);

  const handleAddQuickReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShortkey.trim() || !newMessage.trim()) return;
    const short = newShortkey.trim().toLowerCase().replace(/^\//, '');
    const item = {
      id: Date.now().toString(),
      shortkey: short,
      message: newMessage.trim()
    };
    setQuickReplies(prev => [...prev, item]);
    setNewShortkey('');
    setNewMessage('');
  };

  const handleDeleteQuickReply = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickReplies(prev => prev.filter(q => q.id !== id));
  };

  const handleSelectQuickReply = (message: string) => {
    setReplyMessage(message);
    setShowQuickReplies(false);
    setTimeout(() => {
      replyInputRef.current?.focus();
    }, 50);
  };

  const isTypingShortcut = replyMessage.startsWith('/');
  const shortcutQuery = isTypingShortcut ? replyMessage.substring(1).toLowerCase() : '';

  const matchingQuickReplies = React.useMemo(() => {
    if (!isTypingShortcut) return [];
    return quickReplies.filter(q => q.shortkey.toLowerCase().includes(shortcutQuery));
  }, [isTypingShortcut, shortcutQuery, quickReplies]);

  React.useEffect(() => {
    if (messagesEndRef.current) {
      const scrollTimer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(scrollTimer);
    }
  }, [selectedConversation?.id, selectedConversation?.messages?.data?.length]);

  // Helper to determine if a conversation is unread
  const checkIfConversationIsUnread = React.useCallback((c: any, activePageId: string) => {
    // If it is the selected active conversation, it's viewed/read
    if (selectedConversation?.id === c.id) {
      return false;
    }
    const lastMsg = getLastMessage(c.messages);
    if (!lastMsg) {
      return false;
    }
    // If last message is from the chatbot/us, it is read
    const pageIdsSet = new Set((pages || []).map((p: any) => p.id));
    if (
      lastMsg.from?.id === activePageId || 
      lastMsg.from?.id === 'bot' ||
      pageIdsSet.has(lastMsg.from?.id) ||
      lastMsg.from?.id === c._associatedPageId
    ) {
      return false;
    }
    
    // Check if the last customer message signature matches the stored "seen" signature
    const lastMsgId = `${lastMsg.id || ''}_${lastMsg.created_time || ''}_${lastMsg.message || ''}`;
    const seenMsgId = seenConversations[c.id];
    
    if (seenMsgId === lastMsgId) {
      return false;
    }
    
    return true;
  }, [selectedConversation?.id, pages, seenConversations]);

  React.useEffect(() => {
    setVisibleCount(50);
  }, [selectedPage, chatSearch, chatFilter]);

  React.useEffect(() => {
    if (!selectedConversation) return;

    // Immediately mark the selected conversation's current state as seen
    const lastMsg = getLastMessage(selectedConversation.messages);
    if (lastMsg) {
      const lastMsgId = `${lastMsg.id || ''}_${lastMsg.created_time || ''}_${lastMsg.message || ''}`;
      markAsRead(selectedConversation.id, lastMsgId);
    }

    // Skip simulated conversation IDs
    if (selectedConversation.id && (selectedConversation.id.startsWith('conv_sim_') || selectedConversation.id.startsWith('sim_'))) {
      return;
    }

    const fetchMessagesAndSet = async () => {
      setMessagesLoading(true);
      try {
        const activePageId = selectedConversation._associatedPageId || selectedPage?.id;
        const res = await axios.get(`/api/facebook/conversations/${activePageId}/messages/${selectedConversation.id}`);
        if (res.data && res.data.messages) {
          setSelectedConversation((prev: any) => {
            if (prev?.id === selectedConversation.id) {
              const updated = {
                ...prev,
                messages: res.data.messages
              };
              const newLastMsg = getLastMessage(updated.messages);
              if (newLastMsg) {
                const lastMsgId = `${newLastMsg.id || ''}_${newLastMsg.created_time || ''}_${newLastMsg.message || ''}`;
                markAsRead(selectedConversation.id, lastMsgId);
              }
              return updated;
            }
            return prev;
          });
        }
      } catch (err) {
        console.error("Failed to load conversation messages dynamically:", err);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessagesAndSet();
  }, [selectedConversation?.id]);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-0 bg-white rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl">
      {/* Left Panel: Conversation List */}
      <div className={`w-full lg:w-[23rem] bg-white border-r border-slate-100 flex flex-col h-full ${showChatDetail ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-3 lg:p-4 border-b border-slate-50 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-lg lg:text-xl tracking-tight text-slate-900">Inbox</h3>
            <button onClick={getPages} className="p-1.5 lg:p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-xs">
              <RefreshCw className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </button>
          </div>

          {/* Page Filter Dropdown */}
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Facebook className="w-3.5 h-3.5" />
            </div>
            <select 
              value={selectedPage?.id || ""} 
              onChange={(e) => {
                const page = e.target.value === "all" ? { id: "all", name: "Select All Pages" } : pages.find(p => p.id === e.target.value);
                setSelectedPage(page);
              }}
              className="w-full bg-slate-50 border border-slate-50 rounded-xl pl-9 pr-8 py-2 text-[9px] font-black uppercase tracking-wider focus:bg-white focus:border-indigo-100 outline-none appearance-none transition-all cursor-pointer"
            >
              <option value="">Select Facebook Page</option>
              {pages.filter(p => selectedPageIds.includes(p.id)).length > 0 && (
                <option value="all">Select All Pages</option>
              )}
              {pages.filter(p => selectedPageIds.includes(p.id)).map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Search & Tabs */}
          <div className="space-y-3">
            <div className="relative">
              <input 
                placeholder="Search messages..." 
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-50 rounded-xl pl-9 pr-4 py-2 text-xs font-bold focus:bg-white focus:border-indigo-100 outline-none transition-all" 
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            </div>

            {(() => {
              const activePageId = selectedPage?.id;
              
              const unreadCountForTab = (conversations || []).filter((c: any) => {
                const pId = c._associatedPageId || activePageId;
                const other = c.participants?.data?.find((p: any) => p.id !== pId);
                const matchesSearch = other?.name?.toLowerCase().includes(chatSearch.toLowerCase());
                const isUnreadStatus = checkIfConversationIsUnread(c, pId);
                return matchesSearch && isUnreadStatus;
              }).length;

              return (
                <div className="flex bg-slate-50 p-1 rounded-xl">
                  <button 
                    onClick={() => setChatFilter('all')}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${chatFilter === 'all' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    All Chats
                  </button>
                  <button 
                    onClick={() => setChatFilter('unread')}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${chatFilter === 'unread' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <span>Unread</span>
                    {unreadCountForTab > 0 && (
                      <span className={`px-1 py-0.5 rounded-full text-[8px] font-black animate-pulse bg-rose-500 text-white`}>
                        {unreadCountForTab}
                      </span>
                    )}
                  </button>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Conversations List with Ultra-Fast Auto-Scroll Infinite Pagination */}
        <div 
          className="flex-1 overflow-y-auto pb-10 scrollbar-hide"
          onScroll={(e) => {
            const target = e.currentTarget;
            // When scrolled near the end (150px threshold), trigger batch-loads automatically
            if (target.scrollTop + target.clientHeight >= target.scrollHeight - 150) {
              setVisibleCount(prev => prev + 40);
              if (conversationsHasMore && !isConversationsLoadingMore && loadMoreConversations) {
                loadMoreConversations();
              }
            }
          }}
        >
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
          ) : (() => {
            const filteredConversations = (conversations || []).filter((c: any) => {
              const activePageId = c._associatedPageId || selectedPage?.id;
              const other = c.participants?.data?.find((p: any) => p.id !== activePageId);
              const matchesSearch = other?.name?.toLowerCase().includes(chatSearch.toLowerCase());
              const isUnread = checkIfConversationIsUnread(c, activePageId);
              const matchesUnread = chatFilter === 'all' || isUnread;
              return matchesSearch && matchesUnread;
            });

            const paddedConversations = getPaddedConversations(filteredConversations, selectedPage?.id || 'all');

            return (
              <>
                {paddedConversations.slice(0, visibleCount).map((c: any) => {
                  const activePageId = c._associatedPageId || selectedPage?.id;
                  const other = c.participants.data.find((p: any) => p.id !== activePageId);
                  const isActive = selectedConversation?.id === c.id;
                  const lastMsg = getLastMessage(c.messages)?.message;
                  const isUnread = checkIfConversationIsUnread(c, activePageId);
                  return (
                    <div 
                      key={c.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedConversation(c);
                        setShowChatDetail(true);
                        // Clear unread property immediately client-side
                        c.unread_count = 0;
                        c.unread = false;
                        const lastMsgObj = getLastMessage(c.messages);
                        if (lastMsgObj) {
                           const lastMsgId = `${lastMsgObj.id || ''}_${lastMsgObj.created_time || ''}_${lastMsgObj.message || ''}`;
                          markAsRead(c.id, lastMsgId);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedConversation(c);
                          setShowChatDetail(true);
                          c.unread_count = 0;
                          c.unread = false;
                          const lastMsgObj = getLastMessage(c.messages);
                          if (lastMsgObj) {
                            const lastMsgId = `${lastMsgObj.id || ''}_${lastMsgObj.created_time || ''}_${lastMsgObj.message || ''}`;
                            markAsRead(c.id, lastMsgId);
                          }
                        }
                      }}
                      className={`w-full py-1.5 px-3 lg:py-2 lg:px-3.5 flex gap-2 transition-all group relative border-b border-slate-50/55 text-left cursor-pointer outline-none select-none ${isActive ? 'bg-indigo-50/45' : 'hover:bg-slate-50'}`}
                    >
                      {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 sm:w-1 bg-indigo-600 rounded-r-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>}
                      <div className="relative shrink-0">
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border transition-all shadow-xs ${isActive ? 'border-indigo-600 scale-102' : 'border-slate-100 bg-slate-50'}`}>
                           <SafeAvatar src={other?.picture?.data?.url} name={other?.name} className="w-full h-full" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 border border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0 pr-1">
                        <div className="flex justify-between items-center mb-0.5">
                          <p className={`font-black text-[10px] sm:text-xs tracking-tight truncate ${isActive ? 'text-indigo-900 font-extrabold' : isUnread ? 'text-slate-900 font-extrabold' : 'text-slate-700 font-bold'}`}>{other?.name || 'Customer'}</p>
                          <div className="flex items-center gap-1">
                            <span className="text-[8px] font-semibold opacity-40">{new Date(c.updated_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const lastMsgObj = getLastMessage(c.messages);
                                if (lastMsgObj) {
                                  const lastMsgId = `${lastMsgObj.id || ''}_${lastMsgObj.created_time || ''}_${lastMsgObj.message || ''}`;
                                  if (isUnread) {
                                    markAsRead(c.id, lastMsgId);
                                  } else {
                                    markAsUnread(c.id);
                                  }
                                }
                              }}
                              className="relative group/dot p-0.5 rounded-full hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center shrink-0"
                              title={isUnread ? "Mark as Read" : "Mark as Unread"}
                            >
                              {isUnread ? (
                                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.8)] shrink-0"></div>
                              ) : (
                                <div className="w-2 h-2 rounded-full border border-slate-300 bg-transparent group-hover/dot:border-indigo-600 group-hover/dot:bg-indigo-50 shrink-0 transition-all"></div>
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-0.5">
                          <p className={`text-[9px] sm:text-[10px] truncate leading-normal max-w-[85%] ${isActive ? 'text-indigo-600/70 font-semibold' : isUnread ? 'text-slate-950 font-extrabold' : 'text-slate-400 font-medium'}`}>{lastMsg || 'Sent an attachment...'}</p>
                          {isUnread && (
                            <span className="bg-indigo-600 text-white text-[8px] font-black px-1 py-0.5 rounded-full shrink-0 flex items-center justify-center min-w-[14px] h-[14px] leading-none animate-pulse">
                              {c.unread_count || 1}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {(filteredConversations.length > visibleCount || conversationsHasMore) && (
                  <div className="px-6 py-6 flex flex-col items-center justify-center gap-2">
                    {isConversationsLoadingMore ? (
                      <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest animate-pulse flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                        <span>Loading older conversations...</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setVisibleCount(prev => prev + 40);
                          if (conversationsHasMore && loadMoreConversations) {
                            loadMoreConversations();
                          }
                        }}
                        className="flex items-center gap-2 px-6 py-3 text-xs font-black text-indigo-600 hover:text-indigo-800 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer bg-transparent border-none uppercase tracking-widest"
                      >
                        <ChevronDown className="w-4 h-4 text-indigo-600" />
                        <span>Load more</span>
                      </button>
                    )}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* Right Panel: Chat View */}
      <div className={`flex-1 bg-[#F8FAFC] flex flex-col h-full overflow-hidden relative ${showChatDetail ? 'fixed inset-0 z-[60] bg-white translate-x-0' : 'hidden lg:flex'}`}>
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-2.5 lg:p-3.5 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between z-10 shadow-sm sticky top-0">
              <div className="flex items-center gap-2 lg:gap-3">
                <button 
                  onClick={() => {
                    setSelectedConversation(null);
                    setShowChatDetail(false);
                  }}
                  className="p-1.5 -ml-1 rounded-lg hover:bg-slate-100 lg:hidden text-slate-400"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <div className="w-8 h-8 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl overflow-hidden border border-slate-100 shadow">
                  {(() => {
                    const activePageId = selectedConversation._associatedPageId || selectedPage?.id;
                    const other = selectedConversation.participants.data.find((p: any) => p.id !== activePageId);
                    return <SafeAvatar src={other?.picture?.data?.url} name={other?.name} className="w-full h-full" />;
                  })()}
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-xs lg:text-sm text-slate-900 tracking-tight truncate max-w-[120px] sm:max-w-none">{selectedConversation.participants.data.find((p: any) => p.id !== (selectedConversation._associatedPageId || selectedPage?.id))?.name || 'Conversation'}</h4>
                  <div className="flex items-center gap-1 lg:mt-0.5">
                    <div className="w-1 lg:w-1.5 h-1 lg:h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p className="text-[7px] lg:text-[8px] text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap font-mono">Perseus Bot</p>
                    {messagesLoading && (
                      <span className="flex items-center gap-1 text-[7px] text-blue-600 font-bold uppercase tracking-wider animate-pulse ml-1.5 font-mono">
                        <RefreshCw className="w-2 h-2 animate-spin text-blue-600" /> Synced...
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 lg:gap-2">
                <button className="hidden sm:flex p-2 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-lg shadow-xs transition-all"><Activity className="w-4 h-4" /></button>
                <button className="p-1.5 lg:p-2 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-lg shadow-xs transition-all"><Settings className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3.5 lg:p-4.5 space-y-3 lg:space-y-4 scrollbar-hide">
              {(() => {
                const activePageIdForMsg = selectedConversation._associatedPageId || selectedPage?.id || 'all';
                const paddedMsgs = getPaddedMessagesForConversation(selectedConversation, activePageIdForMsg);
                return [...paddedMsgs].reverse().map((m: any, idx: number) => {
                  const isMe = m.from.id === activePageIdForMsg;
                  const sender = selectedConversation.participants.data.find((p: any) => p.id === m.from.id);
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start items-end gap-2 lg:gap-3'} group`}>
                    {!isMe && (
                      <div className="w-7 h-7 sm:w-8 h-8 rounded-lg overflow-hidden border border-white shadow shadow-slate-200/50 mb-1 shrink-0">
                        <SafeAvatar src={sender?.picture?.data?.url} name={sender?.name} className="w-full h-full" />
                      </div>
                    )}
                    <div className="max-w-[75%]">
                      {!isMe && <p className="text-[8px] font-black uppercase tracking-widest text-slate-450 mb-0.5 ml-0.5">{sender?.name || 'Customer'}</p>}
                      <div className={`py-1.5 px-3 lg:py-2 lg:px-4 rounded-xl lg:rounded-2xl text-[11px] lg:text-xs font-medium leading-relaxed shadow ${
                        isMe 
                          ? m.failed 
                            ? 'bg-rose-50 text-rose-900 border border-rose-200 rounded-br-none shadow-rose-50/50' 
                            : 'bg-indigo-600 text-white rounded-br-none shadow-indigo-100' 
                          : 'bg-white text-slate-800 rounded-bl-none shadow-slate-200/50'
                      }`}>
                        {m.message}
                        {m.failed && m.errorText && (
                          <div className="mt-3 pt-2 border-t border-rose-100 text-[10px] text-rose-600 font-extrabold tracking-wider uppercase flex items-center gap-1.5 leading-tight">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                            <span>Error: {m.errorText}</span>
                          </div>
                        )}
                        {(() => {
                          const attachments = Array.isArray(m.attachments) 
                            ? m.attachments 
                            : (m.attachments?.data || []);
                          if (attachments.length === 0) return null;
                          return (
                            <div className="space-y-4 mt-4">
                              {attachments.map((att: any, attIdx: number) => {
                                const url = att.payload?.url || 
                                            att.file_url || 
                                            att.image_data?.url || 
                                            att.video_data?.url || 
                                            att.audio_data?.url || 
                                            "";
                                if (!url) return null;
                                const cleanUrl = url.split('?')[0].toLowerCase();
                                const isAudio = att.type === 'audio' || 
                                                att.type === 'voice' || 
                                                att.type === 'voice_msg' || 
                                                att.type === 'voice_message' || 
                                                !!att.audio_data ||
                                                cleanUrl.endsWith('.mp3') || 
                                                cleanUrl.endsWith('.wav') || 
                                                cleanUrl.endsWith('.webm') || 
                                                cleanUrl.endsWith('.ogg') || 
                                                cleanUrl.endsWith('.aac') || 
                                                cleanUrl.endsWith('.m4v') || 
                                                cleanUrl.endsWith('.m4a') || 
                                                cleanUrl.includes('audioclip') ||
                                                url.includes('.audio') || 
                                                url.includes('audioclip') ||
                                                att.mime_type?.startsWith('audio/');
                                const isImage = att.type === 'image' || 
                                                !!att.image_data ||
                                                cleanUrl.endsWith('.jpeg') || 
                                                cleanUrl.endsWith('.jpg') || 
                                                cleanUrl.endsWith('.gif') || 
                                                cleanUrl.endsWith('.png') || 
                                                cleanUrl.endsWith('.webp') || 
                                                cleanUrl.endsWith('.bmp') || 
                                                att.mime_type?.startsWith('image/');
                                const isVideo = att.type === 'video' || 
                                                !!att.video_data ||
                                                cleanUrl.endsWith('.mp4') || 
                                                cleanUrl.endsWith('.mov') || 
                                                cleanUrl.endsWith('.avi') || 
                                                cleanUrl.endsWith('.mkv') || 
                                                cleanUrl.endsWith('.webm') || 
                                                att.mime_type?.startsWith('video/');

                                 return (
                                  <div key={attIdx} className="rounded-2xl overflow-hidden max-w-full">
                                    {isImage && (
                                      <div className="relative max-w-sm rounded-[1.5rem] overflow-hidden border border-slate-100 bg-slate-50 mt-1">
                                        <img 
                                          src={url.startsWith('http') && !url.startsWith('blob:') && !url.includes('/api/') ? `/api/proxy-image?url=${encodeURIComponent(url)}` : url} 
                                          alt="Attachment Image" 
                                          className="max-h-72 w-auto object-contain cursor-zoom-in hover:scale-[1.02] transition-transform duration-300" 
                                          referrerPolicy="no-referrer"
                                          onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = url;
                                          }}
                                        />
                                      </div>
                                    )}

                                    {isAudio && (
                                      <div className="mt-1">
                                        <CustomAudioPlayer 
                                          src={url.startsWith('http') && !url.startsWith('blob:') && !url.includes('/api/') ? `/api/proxy-audio?url=${encodeURIComponent(url)}` : url} 
                                          isMe={isMe} 
                                        />
                                      </div>
                                    )}

                                    {isVideo && (
                                      <div className={`p-2 rounded-2xl mt-1 ${isMe ? 'bg-indigo-700/50 text-white' : 'bg-slate-50 text-slate-800'}`}>
                                        <video controls className="w-full max-h-72 rounded-xl">
                                          <source src={url} />
                                        </video>
                                      </div>
                                    )}

                                    {!isImage && !isAudio && !isVideo && (
                                      <a 
                                        href={url} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className={`flex items-center gap-3 p-4 rounded-xl text-xs font-black transition-all border mt-1 ${isMe ? 'bg-indigo-700 hover:bg-indigo-800 text-white border-indigo-500/30' : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'}`}
                                      >
                                        <FileText className="w-5 h-5" /> Download Attachment ({att.name || att.type || 'Attachment'})
                                      </a>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                      <p className={`text-[8px] mt-2 font-black uppercase tracking-widest opacity-30 ${isMe ? 'text-right pr-2' : 'text-left pl-2'}`}>{new Date(m.created_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                );
              }); })()}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3.5 lg:p-5 bg-white border-t border-slate-100 relative">
              {pendingFile && (
                <div className="absolute left-4 right-4 bottom-full mb-3 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl flex justify-between items-center border border-slate-850">
                    <div className="flex items-center gap-3">
                      {pendingFile.type === 'image' && pendingFile.file instanceof File && (
                        <img 
                          src={URL.createObjectURL(pendingFile.file)} 
                          className="w-10 h-10 rounded-lg object-cover border border-white/20 shrink-0" 
                          alt="Thumbnail Preview"
                        />
                      )}
                      {pendingFile.type === 'image' && !(pendingFile.file instanceof File) && (
                        <div className="w-10 h-10 bg-white/10 text-white rounded-lg flex items-center justify-center shrink-0 border border-white/10">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                      {pendingFile.type === 'audio' && (
                        <div className="w-10 h-10 bg-rose-500/20 text-rose-450 rounded-lg flex items-center justify-center shrink-0 border border-rose-500/30">
                          <Mic className="w-4 h-4 animate-pulse text-rose-400" />
                        </div>
                      )}
                      {pendingFile.type === 'file' && (
                        <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center shrink-0 border border-indigo-500/30">
                          <FileText className="w-4 h-4 text-indigo-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Ready to Send</p>
                        <p className="text-xs font-bold truncate max-w-xs">{pendingFile.name}</p>
                      </div>
                    </div>
                    <button onClick={() => setPendingFile(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white cursor-pointer hover:scale-105 active:scale-95 shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {isRecording && (
                <div className="absolute left-4 right-4 bottom-full mb-3 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="bg-red-600 text-white p-4 rounded-2xl shadow-xl flex justify-between items-center animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white text-red-600 rounded-full flex items-center justify-center animate-ping duration-1000"><Mic className="w-4 h-4" /></div>
                      <p className="text-[10px] font-black uppercase tracking-widest">RECORDING VOICE... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}</p>
                    </div>
                    <button onClick={stopRecording} className="bg-white text-red-600 px-5 py-2 rounded-xl text-[10px] font-black hover:bg-slate-100 transition-all shadow-md">STOP & SEND</button>
                  </div>
                </div>
              )}

              {/* Quick Reply Autocomplete Autopopup */}
              {isTypingShortcut && matchingQuickReplies.length > 0 && (
                <div className="absolute left-4 right-4 bottom-full mb-3 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-xl overflow-hidden z-[45] animate-in slide-in-from-bottom-2 duration-200">
                  <div className="px-4 py-2 border-b border-white/10 bg-white/5 flex gap-1.5 items-center">
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Quick Reply Matchings</p>
                  </div>
                  <div className="p-1.5 max-h-40 overflow-y-auto space-y-0.5">
                    {matchingQuickReplies.map((q) => (
                      <button 
                        key={q.id}
                        type="button"
                        onClick={() => handleSelectQuickReply(q.message)}
                        className="w-full text-left px-3 py-1.5 hover:bg-indigo-600/35 active:bg-indigo-600 rounded-xl transition-all flex items-center justify-between gap-3 group cursor-pointer border-none bg-transparent"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="bg-white/10 text-white text-[9px] font-black uppercase px-1.5 py-0.25 rounded border border-white/5 font-mono">
                            /{q.shortkey}
                          </span>
                          <span className="text-xs text-slate-200 truncate font-semibold">{q.message}</span>
                        </div>
                        <span className="text-[8px] font-black text-indigo-400 group-hover:text-white uppercase tracking-widest leading-none">Use template</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Reply Manage Panel Popover */}
              {showQuickReplies && (
                <div className="absolute right-4 bottom-full mb-3 w-80 max-w-full bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col overflow-hidden z-[50] animate-in slide-in-from-bottom-4 duration-300">
                  {/* Popover Header */}
                  <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-100" />
                      <p className="text-xs font-black uppercase tracking-wider text-slate-800">Quick Replies</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowQuickReplies(false)} 
                      className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-slate-600 transition-all cursor-pointer border-none bg-transparent"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add form */}
                  <form onSubmit={handleAddQuickReply} className="p-4 border-b border-slate-100 bg-white space-y-2">
                    <p className="text-[8px] font-black uppercase tracking-widest text-indigo-600/80 mb-0.5">Create New Template</p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-405 font-mono">/</span>
                        <input 
                          type="text"
                          value={newShortkey}
                          onChange={(e) => setNewShortkey(e.target.value)}
                          placeholder="shortcut (e.g. hello)"
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-100 rounded-lg pl-5 pr-2 py-1.5 text-xs font-bold outline-none transition-all font-mono text-slate-900"
                          required
                        />
                      </div>
                    </div>
                    <textarea 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type template message..."
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-100 rounded-lg px-2 py-1.5 text-xs font-medium outline-none transition-all resize-none text-slate-950"
                      required
                    />
                    <button 
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-1.5 px-3 text-xs font-black flex items-center justify-center gap-1 shadow-xs transition-all active:scale-95 border-none cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Save Quick Reply
                    </button>
                  </form>

                  {/* Search and list */}
                  <div className="p-3 bg-slate-50/50 flex-1 max-h-48 overflow-y-auto space-y-1.5">
                    <div className="relative mb-1.5">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                      <input 
                        type="text"
                        value={quickReplySearch}
                        onChange={(e) => setQuickReplySearch(e.target.value)}
                        placeholder="Search shortcut or message..."
                        className="w-full bg-white border border-slate-200 rounded-md pl-7 pr-2.5 py-1 text-xs font-medium outline-none text-slate-900"
                      />
                    </div>

                    {(() => {
                      const filtered = quickReplies.filter(q => 
                        q.shortkey.toLowerCase().includes(quickReplySearch.toLowerCase()) ||
                        q.message.toLowerCase().includes(quickReplySearch.toLowerCase())
                      );

                      if (filtered.length === 0) {
                        return (
                          <div className="text-center py-4 text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                            No templates found
                          </div>
                        );
                      }

                      return filtered.map(q => (
                        <div 
                          key={q.id}
                          onClick={() => handleSelectQuickReply(q.message)}
                          className="p-2 bg-white hover:bg-indigo-50/40 rounded-lg border border-slate-100 text-left cursor-pointer transition-all hover:border-indigo-100 group flex justify-between items-start gap-3 shadow-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="inline-block bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase px-1.5 py-0.25 rounded border border-indigo-100 mb-0.5 font-mono">
                              /{q.shortkey}
                            </span>
                            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-semibold">{q.message}</p>
                          </div>
                          <button 
                            type="button"
                            onClick={(e) => handleDeleteQuickReply(q.id, e)}
                            className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded bg-transparent opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-none"
                            title="Delete template"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex gap-1 bg-slate-50 p-1 rounded-xl shrink-0">
                  <label className="w-9 h-9 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl flex items-center justify-center text-slate-450 hover:bg-white hover:text-indigo-600 transition-all cursor-pointer shadow-xs active:scale-95">
                    <Paperclip className="w-4 h-4 lg:w-4.5 lg:h-4.5" />
                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e)} />
                  </label>
                  <button 
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-9 h-9 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl flex items-center justify-center transition-all shadow-xs active:scale-95 ${isRecording ? 'bg-red-600 text-white' : 'text-slate-450 hover:bg-white hover:text-indigo-600'}`}>
                    <Mic className="w-4 h-4 lg:w-4.5 lg:h-4.5" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowQuickReplies(!showQuickReplies)}
                    title="Quick Replies"
                    className={`w-9 h-9 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl flex items-center justify-center transition-all shadow-xs active:scale-95 ${showQuickReplies ? 'bg-indigo-600 text-white animate-pulse' : 'text-slate-450 hover:bg-white hover:text-indigo-600'}`}>
                    <Zap className="w-4 h-4 lg:w-4.5 lg:h-4.5" />
                  </button>
                </div>
                
                <div className="flex-1 relative">
                  <input 
                    ref={replyInputRef}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (pendingFile ? handleSendFile() : handleReply())}
                    placeholder="Reply to this conversation... (Type / for templates)"
                    className="w-full bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-100 rounded-xl lg:rounded-2xl px-4 py-2.5 lg:px-5 lg:py-3.5 text-xs lg:text-sm font-semibold outline-none transition-all pr-14 lg:pr-20 shadow-inner text-slate-900"
                  />
                  <button 
                    onClick={pendingFile ? handleSendFile : handleReply}
                    disabled={isSending || (!replyMessage.trim() && !pendingFile)}
                    className="absolute right-1.5 top-1.5 bottom-1.5 w-10 lg:w-14 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg lg:rounded-xl flex items-center justify-center transition-all shadow active:scale-90 disabled:opacity-30"
                  >
                    <Send className="w-4 h-4 lg:w-5 lg:h-5" />
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
