import React, { useState } from 'react';
import { ArrowLeft, User, Image as ImageIcon, Sparkles, Paperclip, Clock, Calendar, AlertTriangle, ChevronDown, Check } from 'lucide-react';

interface MemberPage {
  id: string;
  name: string;
  subscriberCount?: number;
  eligibleCount?: number;
  picture?: {
    data?: {
      url?: string;
    };
  };
}

interface BroadcastBulkProps {
  pages: MemberPage[];
  creditBalance: number;
  onCancel: () => void;
  onSubmit: (data: {
    pageIds: string[];
    message: string;
    file: File | null;
    attachmentType: string;
    messageTag: string;
    scheduleDate: string;
    scheduleTime: string;
    targetAudience: 'all' | 'eligible';
  }) => void;
  isSubmitting: boolean;
}

export const BroadcastBulk: React.FC<BroadcastBulkProps> = ({
  pages,
  creditBalance,
  onCancel,
  onSubmit,
  isSubmitting
}) => {
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState<'all' | 'eligible'>('all');
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

  const [dragActive, setDragActive] = useState(false);

  const getPageSubscriberCount = (id: string) => {
    const page = pages.find(p => p.id === id);
    return page?.subscriberCount || 0;
  };

  const getPageRecipientCount = (page: MemberPage) => {
    if (targetAudience === 'eligible') {
      return page.eligibleCount || 0;
    }
    return page.subscriberCount || 0;
  };

  const togglePageSelection = (id: string) => {
    if (selectedPageIds.includes(id)) {
      setSelectedPageIds(prev => prev.filter(pId => pId !== id));
    } else {
      setSelectedPageIds(prev => [...prev, id]);
    }
  };

  const selectAllPages = () => {
    if (selectedPageIds.length === pages.length) {
      setSelectedPageIds([]);
    } else {
      setSelectedPageIds(pages.map(p => p.id));
    }
  };

  // Compute aggregate total recipients based on actual data
  const getCombinedRecipients = () => {
    return selectedPageIds.reduce((sum, id) => {
      const p = pages.find(page => page.id === id);
      return sum + (p ? getPageRecipientCount(p) : 0);
    }, 0);
  };

  const recipientCount = getCombinedRecipients();
  const creditsPerMessage = msgType === 'both' ? 2 : 1;
  const estimatedCost = recipientCount * creditsPerMessage;

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
      setAttachmentType(droppedFile.type.startsWith('video/') ? 'video' : 'image');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setAttachmentType(selectedFile.type.startsWith('video/') ? 'video' : 'image');
    }
  };

  const insertSlug = (slug: string) => {
    setMessage(prev => prev + ` {{${slug}}}`);
    setIsSlugDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPageIds.length === 0) {
      alert('Please select at least one Facebook Page to include in your bulk broadcast.');
      return;
    }
    if (msgType === 'text' && !message.trim()) {
      alert('Please enter a message body.');
      return;
    }
    if (msgType === 'image' && !file) {
      alert('Please choose a media attachment file.');
      return;
    }
    if (msgType === 'both' && (!message.trim() || !file)) {
      alert('Please provide both message text and a media attached file.');
      return;
    }

    if (isScheduleChecked) {
      if (!scheduleDate || !scheduleTime) {
        alert('Please select both a schedule date and time.');
        return;
      }
      const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
      if (scheduledDateTime <= new Date()) {
        alert('Scheduled time must be in the future.');
        return;
      }
    }

    if (estimatedCost > creditBalance) {
      alert(`Insufficient credits. This broadcast requires ${estimatedCost} credits but you only have ${creditBalance}.`);
      return;
    }

    onSubmit({
      pageIds: selectedPageIds,
      message,
      file,
      attachmentType,
      messageTag,
      scheduleDate: isScheduleChecked ? scheduleDate : '',
      scheduleTime: isScheduleChecked ? scheduleTime : '',
      targetAudience
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-300 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6 text-left">
        <button
          onClick={onCancel}
          className="p-3 border border-slate-100 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-[1.25rem] transition-all cursor-pointer bg-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-1000 tracking-tight">Bulk Pages Broadcast</h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-wider">
            Send the same message to multiple pages at once
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-left">
        
        {/* Step 1: Select Pages Bundle */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
              Select Bulk Destination Pages ({selectedPageIds.length} chosen)
            </label>
            {pages.length > 0 && (
              <button
                type="button"
                onClick={selectAllPages}
                className="text-xs font-black uppercase text-indigo-600 tracking-widest bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-xl transition-all border-none cursor-pointer"
              >
                {selectedPageIds.length === pages.length ? 'Deselect All' : 'Select All pages'}
              </button>
            )}
          </div>

          {pages.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50">
              <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">No active Facebook pages connected.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((p) => {
                const isSelected = selectedPageIds.includes(p.id);
                const subCount = p.subscriberCount || 0;

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      togglePageSelection(p.id);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/10 shadow-sm' 
                        : 'border-slate-100 hover:border-slate-150 bg-slate-50'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[4px]" />}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 border shrink-0 flex items-center justify-center font-bold text-slate-500 uppercase">
                      {p.picture?.data?.url ? (
                        <img src={p.picture.data.url} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        p.name.substring(0, 2)
                      )}
                    </div>

                    {/* Page Name */}
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-black text-slate-800 truncate leading-tight">{p.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 whitespace-nowrap">
                        {subCount} {subCount === 1 ? 'subscriber' : 'subscribers'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 2: Define Campaign Target Audience */}
        <div id="target-audience-step" className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-sm space-y-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
              Step 2: Campaign Target Audience (Critical Facebook Policy)
            </label>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Facebook Standard Window Rules</span>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-left flex gap-2 w-full items-start">
            <AlertTriangle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950 font-semibold leading-relaxed">
              <p className="font-extrabold text-indigo-900 mb-0.5">Facebook Messenger Policy Guide:</p>
              Under Meta guidelines, pages can send direct normal messages <strong>strictly within 24 hours</strong> of the customer's last incoming message. Outside the 24h window, Meta blocks standard messages unless Page Message Tags are approved. Adding this filter protects your page from Meta blockages!
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => setTargetAudience('eligible')}
              className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-40 ${
                targetAudience === 'eligible'
                  ? 'border-indigo-600 bg-indigo-50/10'
                  : 'border-slate-100 hover:border-slate-150 bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg ${
                  targetAudience === 'eligible' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  100% Real Deliverable (Recommended)
                </span>
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  targetAudience === 'eligible' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                }`}>
                  {targetAudience === 'eligible' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-black text-slate-800 mb-0.5">Active Contacts (In last 24h)</p>
                <p className="text-[10px] text-slate-400 font-bold leading-normal">
                  Saves your credits and delivers real-time direct messages with zero blocks or errors!
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTargetAudience('all')}
              className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-40 ${
                targetAudience === 'all'
                  ? 'border-indigo-600 bg-indigo-50/10'
                  : 'border-slate-100 hover:border-slate-150 bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg ${
                  targetAudience === 'all' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
                }`}>
                  Requires Approved Message Tags
                </span>
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  targetAudience === 'all' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                }`}>
                  {targetAudience === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-black text-slate-800 mb-0.5">All Connected Contacts</p>
                <p className="text-[10px] text-slate-400 font-bold leading-normal">
                  Fires tagging parameters (e.g. UTILITY). Facebook blocks these on real pages without app approvals.
                </p>
              </div>
            </button>
          </div>
        </div>



        {/* Step 3: Message Sub-type */}
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

        {/* Step 4: Message Content */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
              Bulk Message Details
            </label>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              {message.length} characters
            </span>
          </div>

          {(msgType === 'image' || msgType === 'both') && (
            <div className="space-y-4">
              <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">
                Shared Media Asset File (Sent to all pages)
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
                  id="bulk_bcast_file"
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
                  <label htmlFor="bulk_bcast_file" className="cursor-pointer block space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-500 mx-auto">
                      <Paperclip className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-700">Choose an attachment or drag & drop</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1">Supports PNG, JPG, MP4 video up to 25MB</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          )}

          {(msgType === 'text' || msgType === 'both') && (
            <div className="space-y-3">
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter campaign details. This exact message copy will dispatch concurrently to all selected pages."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-150 focus:border-indigo-500 rounded-[1.5rem] text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all leading-relaxed rtl:text-right"
              ></textarea>
              
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

        {/* Step 5: Messaging Tag */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-sm space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
            Meta Compliance Messaging Tag
          </label>
          <select
            value={messageTag}
            onChange={(e) => setMessageTag(e.target.value)}
            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800 rounded-xl"
          >
            <option value="UTILITY">Utility Segment (Transaction records, updates, customer queries)</option>
            <option value="CONFIRMED_EVENT_UPDATE">Confirmed Event Update (Deadlines, bookings, reminders)</option>
            <option value="ACCOUNT_UPDATE">Account Update (Subscribtion status change, portal alerts)</option>
            <option value="POST_PURCHASE_UPDATE">Post-Purchase Update (Invoice numbers, delivery tracks)</option>
          </select>
        </div>

        {/* Step 6: Scheduling */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                Schedule Campaign (Optional)
              </label>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Toggle to launch all broadcasts at a specific calendar date</p>
            </div>
            <input
              type="checkbox"
              checked={isScheduleChecked}
              onChange={() => setIsScheduleChecked(!isScheduleChecked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
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
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-500" /> Time Stamp
                </span>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800 rounded-xl"
                />
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Aggregated Cost Estimates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-3xl border border-indigo-100/60 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[9px] font-black uppercase text-indigo-500 tracking-wider">Aggregated Bulk Cost</p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {estimatedCost === 0 ? "0 credits" : (
                  <span>
                    {estimatedCost.toLocaleString()} credits
                    <span className="text-[10px] font-normal text-slate-400 ml-1">
                      ({creditsPerMessage} credit{creditsPerMessage > 1 ? 's' : ''} × {recipientCount.toLocaleString()} recipients)
                    </span>
                  </span>
                )}
              </p>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-wider">
              Summed for {selectedPageIds.length} pages: {recipientCount.toLocaleString()} total messages
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50/10 to-white p-6 rounded-3xl border border-slate-105 shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Your Balance</p>
              <p className="text-2xl font-black text-indigo-600 mt-1">
                {creditBalance.toLocaleString()} credits
              </p>
            </div>
            <span className="text-[10px] text-emerald-600 font-extrabold mt-4 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Credits available
            </span>
          </div>
        </div>

        {estimatedCost > creditBalance && (
          <p className="text-xs font-bold text-rose-600 text-center mt-2">
            ⚠️ Insufficient credits to send this broadcast.
          </p>
        )}

        {/* Footer actions row */}
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
            disabled={isSubmitting || selectedPageIds.length === 0 || estimatedCost > creditBalance}
            className={`px-8 py-4 bg-indigo-600 hover:bg-slate-950 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2 border-none cursor-pointer ${
              (isSubmitting || selectedPageIds.length === 0 || estimatedCost > creditBalance) ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Queueing Broadcasters...' : 'Send Bulk Broadcast now'}
          </button>
        </div>

      </form>
    </div>
  );
};
