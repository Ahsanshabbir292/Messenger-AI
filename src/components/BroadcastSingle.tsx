import React, { useState } from 'react';
import { ArrowLeft, User, Image as ImageIcon, Sparkles, Paperclip, Clock, Calendar, AlertTriangle, ChevronDown } from 'lucide-react';

interface MemberPage {
  id: string;
  name: string;
  subscriberCount?: number;
  picture?: {
    data?: {
      url?: string;
    };
  };
}

interface BroadcastSingleProps {
  pages: MemberPage[];
  creditBalance: number;
  onCancel: () => void;
  onSubmit: (data: {
    pageId: string;
    message: string;
    file: File | null;
    attachmentType: string;
    sendTo: 'all' | 'group';
    groupId: string;
    messageTag: string;
    scheduleDate: string;
    scheduleTime: string;
  }) => void;
  isSubmitting: boolean;
}

export const BroadcastSingle: React.FC<BroadcastSingleProps> = ({
  pages,
  creditBalance,
  onCancel,
  onSubmit,
  isSubmitting
}) => {
  const [pageId, setPageId] = useState<string>('');
  const [sendTo, setSendTo] = useState<'all' | 'group'>('all');
  const [groupId, setGroupId] = useState<string>('g1');
  const [msgType, setMsgType] = useState<'text' | 'image' | 'both'>('text');
  const [message, setMessage] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [attachmentType, setAttachmentType] = useState<string>('image');
  const [isSlugDropdownOpen, setIsSlugDropdownOpen] = useState(false);
  const [messageTag, setMessageTag] = useState<string>('UTILITY');
  
  // Scheduling states
  const [isScheduleChecked, setIsScheduleChecked] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string>('');

  // Drag and drop / file input
  const [dragActive, setDragActive] = useState(false);

  // Recipient subscriber size mapping for pages derived from actual data
  const getPageSubscriberCount = (id: string) => {
    const page = pages.find(p => p.id === id);
    return page?.subscriberCount || 0;
  };

  // Compute recipients based on pageId
  const getRecipientsCalculated = () => {
    if (!pageId) return 0;
    return getPageSubscriberCount(pageId);
  };

  const recipientCount = getRecipientsCalculated();
  const estimatedCost = recipientCount * 1; // 1 credit per recipient

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      if (droppedFile.type.startsWith('video/')) {
        setAttachmentType('video');
      } else {
        setAttachmentType('image');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (selectedFile.type.startsWith('video/')) {
        setAttachmentType('video');
      } else {
        setAttachmentType('image');
      }
    }
  };

  const insertSlug = (slug: string) => {
    setMessage(prev => prev + ` {{${slug}}}`);
    setIsSlugDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageId) {
      alert('Please select a Facebook Page to broadcast from.');
      return;
    }
    if (msgType === 'text' && !message.trim()) {
      alert('Please fill in some message body text.');
      return;
    }
    if (msgType === 'image' && !file) {
      alert('Please attach a media asset file.');
      return;
    }
    if (msgType === 'both' && (!message.trim() || !file)) {
      alert('Please provide both message text and a media attached file.');
      return;
    }

    onSubmit({
      pageId,
      message,
      file,
      attachmentType,
      sendTo,
      groupId,
      messageTag,
      scheduleDate: isScheduleChecked ? scheduleDate : '',
      scheduleTime: isScheduleChecked ? scheduleTime : ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-300 font-sans">
      
      {/* Header element */}
      <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6 text-left">
        <button
          onClick={onCancel}
          className="p-3 border border-slate-100 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-[1.25rem] transition-all cursor-pointer bg-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-950 tracking-tight">Single Page Broadcast</h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-wider">
            Send a message to one page's subscribers
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-left">
        
        {/* Step 1: Select Connected Page */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-sm space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
            Select Connected Page
          </label>
          {pages.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50">
              <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">No active Facebook pages linked to this workspace yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pages.map((p) => {
                const isSelected = p.id === pageId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setPageId(p.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/10' 
                        : 'border-slate-100 hover:border-slate-150 bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 border shrink-0 flex items-center justify-center font-bold text-slate-500 uppercase">
                      {p.picture?.data?.url ? (
                        <img src={p.picture.data.url} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        p.name.substring(0, 2)
                      )}
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-black text-slate-800 truncate leading-tight">{p.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                        {getPageSubscriberCount(p.id).toLocaleString()} Contacts
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 3: Message Type Selector */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-sm space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
            Message Type
          </label>
          <div className="flex gap-4">
            {['text', 'image', 'both'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMsgType(type as any)}
                className={`flex-1 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all cursor-pointer ${
                  msgType === type
                    ? 'border-indigo-600 bg-indigo-50/10 text-indigo-700'
                    : 'border-slate-100 hover:border-slate-150 bg-slate-50 text-slate-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Message Content Form */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
              Message Content
            </label>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              {message.length} characters
            </span>
          </div>

          {/* Media attachment block if single image or both */}
          {(msgType === 'image' || msgType === 'both') && (
            <div className="space-y-4">
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                Media Asset Attachment File
              </label>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-[1.5rem] p-8 text-center transition-all relative ${
                  dragActive ? "border-indigo-600 bg-indigo-50/5" : "border-slate-200 hover:border-slate-350 bg-slate-50"
                }`}
              >
                <input
                  type="file"
                  id="single_bcast_file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {file ? (
                  <div className="space-y-3">
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Preview" 
                        className="w-28 h-28 object-cover rounded-2xl mx-auto shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600 font-bold text-xs uppercase">
                        MP4
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-black text-slate-800 truncate max-w-sm mx-auto">{file.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[9px] font-black uppercase tracking-widest border-none cursor-pointer"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <label htmlFor="single_bcast_file" className="cursor-pointer block space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-500 mx-auto">
                      <Paperclip className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-700">Choose an attachment file or drag & drop</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Supports PNG, JPG, MP4 video format up to 25MB</p>
                    </div>
                  </label>
                )}
              </div>

              {file && (
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start border-t border-slate-100 pt-4">
                  <div className="text-left">
                    <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Detect Media Type</span>
                    <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-widest mt-0.5 block">{attachmentType}</span>
                  </div>
                  <div className="w-full sm:w-auto">
                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Meta Attachment Format</label>
                    <select
                      value={attachmentType}
                      onChange={(e) => setAttachmentType(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800 rounded-xl"
                    >
                      <option value="image">Image Format</option>
                      <option value="video">Video Format</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Text Area Content Form */}
          {(msgType === 'text' || msgType === 'both') && (
            <div className="space-y-3">
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your campaign message body text here... (Unicode/Urdu supported directly)"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-150 focus:border-indigo-500 rounded-[1.5rem] text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-sans leading-relaxed rtl:text-right"
              ></textarea>
              
              {/* Recipient name dropdown token inserter */}
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  onClick={() => setIsSlugDropdownOpen(!isSlugDropdownOpen)}
                  className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Insert Recipient Name <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {isSlugDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white border border-slate-150 shadow-2xl z-20 py-2 divide-y divide-slate-50 animate-in fade-in duration-200">
                    <button
                      type="button"
                      onClick={() => insertSlug('first_name')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-indigo-50/40 hover:text-indigo-700 font-bold block border-none bg-transparent cursor-pointer"
                    >
                      {"{{first_name}}"} (e.g. Zayn)
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSlug('last_name')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-indigo-50/40 hover:text-indigo-700 font-bold block border-none bg-transparent cursor-pointer"
                    >
                      {"{{last_name}}"} (e.g. Abideen)
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSlug('full_name')}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-indigo-50/40 hover:text-indigo-700 font-bold block border-none bg-transparent cursor-pointer"
                    >
                      {"{{full_name}}"} (e.g. Zayn Ul Abideen)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step 5: Message Tag Selection */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-sm space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
            Select the Messenger Tag Category (For Meta Compliance)
          </label>
          <select
            value={messageTag}
            onChange={(e) => setMessageTag(e.target.value)}
            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800 rounded-xl focus:outline-none"
          >
            <option value="UTILITY">Utility Segment (Transaction records, updates, customer queries)</option>
            <option value="CONFIRMED_EVENT_UPDATE">Confirmed Event Update (Deadlines, bookings, reminders)</option>
            <option value="ACCOUNT_UPDATE">Account Update (Subscribtion status change, portal alerts)</option>
            <option value="POST_PURCHASE_UPDATE">Post-Purchase Update (Invoice numbers, delivery tracks)</option>
          </select>
        </div>

        {/* Step 6: Schedule (Optional) */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Schedule Broadcast Campaign (Optional)
              </label>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Toggle to enqueue message delivery at a specific calendar date</p>
            </div>
            <input
              type="checkbox"
              checked={isScheduleChecked}
              onChange={() => setIsScheduleChecked(!isScheduleChecked)}
              className="w-5 h-5 accent-indigo-600 rounded bg-slate-100 border-none cursor-pointer"
            />
          </div>

          {isScheduleChecked && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 animate-in fade-in duration-200">
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-500" /> Select Delivery Date
                </span>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800 rounded-xl focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-500" /> Select Time Stamp
                </span>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Step 7: Estimated Costs Card and Balance Display (matches Mockup) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estimated Cost Info Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-white hover:from-white hover:to-indigo-50/20 transition-all p-6 rounded-3xl border border-indigo-100/60 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[9px] font-black uppercase text-indigo-500 tracking-wider">Estimated Cost</p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {estimatedCost === 0 ? "0 credits" : `${estimatedCost.toLocaleString()} credits`}
              </p>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-wider">
              Calculated dynamically at 1.0 credit per contact
            </p>
          </div>

          {/* User Credits Balance Card */}
          <div className="bg-gradient-to-br from-indigo-50/10 to-white hover:from-white hover:to-indigo-50/10 transition-all p-6 rounded-3xl border border-slate-105 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Your Balance</p>
              <p className="text-2xl font-black text-indigo-600 mt-1">
                {creditBalance.toLocaleString()} credits
              </p>
            </div>
            <span className="text-[10px] text-emerald-600 font-extrabold mt-4 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Real-Time Sandbox Refill Ready
            </span>
          </div>
        </div>

        {/* Action button row */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 text-right justify-end font-sans">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-4 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer bg-white"
          >
            Cancel Campaign
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !pageId}
            className={`px-8 py-4 bg-indigo-600 hover:bg-slate-950 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2 border-none cursor-pointer ${
              (isSubmitting || !pageId) ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Initializing Broadcaster...' : 'Send Broadcast Now'}
          </button>
        </div>

      </form>
    </div>
  );
};
