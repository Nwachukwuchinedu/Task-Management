"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  Kanban, 
  Pulse, 
  Users, 
  ChatCircle, 
  Plus, 
  DotsThree, 
  X, 
  WarningCircle 
} from "@phosphor-icons/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface Task {
  id: string;
  title: string;
  type?: "Feature" | "Bug";
  priority?: "High" | "Medium" | "Low";
  assignee: string;
  comments: number;
  status: "backlog" | "inprogress" | "done";
}

const InteractiveMockup = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "card-1", title: "Design system component review", type: "Feature", assignee: "11", comments: 2, status: "backlog" },
    { id: "card-2", title: "Update brand assets on marketing site", assignee: "42", comments: 0, status: "backlog" },
    { id: "card-3", title: "Fix mobile header navigation glitch", type: "Bug", priority: "High", assignee: "41", comments: 0, status: "inprogress" },
    { id: "card-4", title: "Setup staging environment", assignee: "33", comments: 0, status: "done" },
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: "", visible: false });
  const [isTyping, setIsTyping] = useState(false);
  const [comments, setComments] = useState<{ author: string; text: string; time: string; img: string }[]>([
    { author: "Sarah J.", text: "I've attached the latest Figma files. Let me know if anything is missing.", time: "2 hrs ago", img: "11" },
    { author: "Niels", text: "Looks solid. Will review after lunch.", time: "1 hr ago", img: "41" },
  ]);

  const cursorNielsRef = useRef(null);
  const cursorJeanRef = useRef(null);
  const mockupRef = useRef(null);
  const bellDotRef = useRef(null);

  useGSAP(() => {
    const moveCursor = (cursor: any, delay: number) => {
      gsap.to(cursor, {
        left: `${20 + Math.random() * 60}%`,
        top: `${20 + Math.random() * 60}%`,
        duration: 1.5 + Math.random() * 2,
        delay,
        ease: "power2.inOut",
        onComplete: () => moveCursor(cursor, Math.random() * 2),
      });
    };

    moveCursor(cursorNielsRef.current, 0.5);
    moveCursor(cursorJeanRef.current, 1.5);
  }, { scope: mockupRef });

  useEffect(() => {
    const toastMsgs = [
      "Jean commented on Design System", 
      "Niels moved a card to Done", 
      "Sarah updated a priority",
      "Niels assigned a task to You"
    ];

    const interval = setInterval(() => {
      const msg = toastMsgs[Math.floor(Math.random() * toastMsgs.length)];
      setToast({ msg, visible: true });
      setTimeout(() => setToast({ msg, visible: false }), 3000);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("taskId", id);
  };

  const handleDrop = (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const openTask = (task: Task) => {
    setSelectedTask(task);
    setIsPanelOpen(true);
  };

  const handleNewTask = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTaskTitle.trim()) {
      const newTask: Task = {
        id: `card-${Date.now()}`,
        title: newTaskTitle,
        assignee: "33",
        comments: 0,
        status: "backlog",
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
      setShowTaskInput(false);
    }
  };

  const handleNewComment = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLInputElement;
    if (e.key === "Enter" && target.value.trim()) {
      setComments([...comments, { author: "You", text: target.value, time: "Just now", img: "33" }]);
      target.value = "";
    }
  };

  return (
    <div ref={mockupRef} id="app-mockup" className="w-full h-[640px] bg-[#0A0C10]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex relative select-none">
      
      {/* Multiplayer Cursors */}
      <div ref={cursorNielsRef} className="cursor-mock absolute pointer-events-none z-100 filter drop-shadow-md transition-transform" style={{ top: "30%", left: "70%" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transform -rotate-12">
          <path d="M5.5 3.21V20.8C5.5 21.45 6.27 21.8 6.75 21.36L11.53 16.92L16.63 23.59C16.89 23.94 17.39 24.03 17.76 23.79L19.46 22.49C19.82 22.22 19.92 21.72 19.66 21.36L14.47 14.5H20.5C21.14 14.5 21.5 13.73 21.08 13.26L6.58 2.37C6.15 1.94 5.5 2.22 5.5 2.84V3.21Z" fill="#06B6D4" stroke="white" strokeWidth="1.5"/>
        </svg>
        <div className="bg-[#06B6D4] text-gray-950 text-[10px] font-bold px-2 py-0.5 rounded-full absolute top-5 left-4 whitespace-nowrap shadow-lg">Niels</div>
      </div>

      <div ref={cursorJeanRef} className="cursor-mock absolute pointer-events-none z-100 filter drop-shadow-md transition-transform" style={{ top: "60%", left: "40%" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transform -rotate-12">
          <path d="M5.5 3.21V20.8C5.5 21.45 6.27 21.8 6.75 21.36L11.53 16.92L16.63 23.59C16.89 23.94 17.39 24.03 17.76 23.79L19.46 22.49C19.82 22.22 19.92 21.72 19.66 21.36L14.47 14.5H20.5C21.14 14.5 21.5 13.73 21.08 13.26L6.58 2.37C6.15 1.94 5.5 2.22 5.5 2.84V3.21Z" fill="#8B5CF6" stroke="white" strokeWidth="1.5"/>
        </svg>
        <div className="bg-[#8B5CF6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full absolute top-5 left-4 whitespace-nowrap shadow-lg">Jean</div>
      </div>

      {/* Sidebar */}
      <div className="w-56 bg-black/40 border-r border-white/5 flex flex-col z-10 shrink-0">
        <div className="h-14 flex items-center px-4 border-b border-white/5 gap-3">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-xs font-bold shadow-md">N</div>
          <div className="w-8 h-8 rounded-lg bg-surface border border-surface-border flex items-center justify-center font-logo font-bold text-primary">T</div>
          <span className="font-heading font-semibold text-sm">Taski Inc</span>
        </div>
        <div className="p-3 space-y-1">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 px-2 mt-2">Workspace</div>
          <button className="w-full flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-md text-sm font-medium transition-colors">
            <Kanban size={18} /> Board
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-white/60 hover:bg-white/5 hover:text-white rounded-md text-sm font-medium transition-colors">
            <Pulse size={18} /> Activity
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-white/60 hover:bg-white/5 hover:text-white rounded-md text-sm font-medium transition-colors">
            <Users size={18} /> Members
          </button>
        </div>
        <div className="mt-auto p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/100?img=33" className="w-8 h-8 rounded-full border border-white/10" alt="Me" />
            <div className="text-xs">
              <p className="font-bold text-white">You</p>
              <p className="text-white/40">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-0 overflow-hidden bg-[#0A0C10]">
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 shrink-0 relative">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-lg font-bold">Frontend Q3 Sprint</h2>
            <span className="bg-white/10 text-white/70 px-2 py-0.5 rounded text-[10px] font-bold">Public</span>
          </div>
          
          <div className="relative">
            <button className="relative text-white/60 hover:text-white transition-colors">
              <Bell size={20} />
              {toast.visible && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>
            <div className={`absolute top-8 right-0 w-64 bg-surface-border border border-white/10 rounded-lg shadow-xl p-3 transform transition-all duration-300 z-50 ${toast.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0 pointer-events-none"}`}>
              <p className="text-xs text-white/90">{toast.msg}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto p-6 flex gap-6 items-start">
          {["backlog", "inprogress", "done"].map((status) => (
            <div 
              key={status} 
              className="w-[260px] shrink-0 flex flex-col gap-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, status as Task["status"])}
            >
              <div className="flex justify-between items-center px-1">
                <h3 className={`text-sm font-semibold flex items-center gap-2 ${status === 'inprogress' ? 'text-primary' : status === 'done' ? 'text-green-400' : 'text-white/70'}`}>
                  <div className={`w-2 h-2 rounded-full ${status === 'inprogress' ? 'bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]' : status === 'done' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-white/20'}`}></div>
                  {status === 'inprogress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                </h3>
                <span className="text-xs text-white/30 font-bold">{tasks.filter(t => t.status === status).length}</span>
              </div>
              
              <div className="flex flex-col gap-3 min-h-[150px] p-1 rounded-lg border border-transparent transition-colors">
                {tasks.filter(t => t.status === status).map(task => (
                  <div 
                    key={task.id} 
                    draggable 
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => openTask(task)}
                    className={`task-card bg-[#141720] border border-white/5 hover:border-white/20 rounded-lg p-3 shadow-md transition-all cursor-grab active:cursor-grabbing ${status === 'done' ? 'opacity-60 grayscale-[0.5]' : ''}`}
                  >
                    {task.type && (
                      <div className="flex gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${task.type === 'Feature' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                          {task.type}
                        </span>
                      </div>
                    )}
                    <p className={`text-sm text-white mb-4 font-medium leading-snug ${status === 'done' ? 'line-through text-white/50' : ''}`}>
                      {task.title}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-1">
                        <img src={`https://i.pravatar.cc/100?img=${task.assignee}`} className="w-5 h-5 rounded-full border border-[#141720]" alt="avatar" />
                      </div>
                      <div className="flex items-center gap-2">
                        {task.priority && (
                           <span className="text-[10px] text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">High</span>
                        )}
                        <span className="text-[10px] text-white/40 flex items-center gap-1"><ChatCircle size={12} /> {task.comments}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {status === 'backlog' && (
                  <div className="mt-2">
                    {!showTaskInput ? (
                      <button onClick={() => setShowTaskInput(true)} className="w-full py-2 text-left px-3 text-sm text-white/40 hover:text-white hover:bg-white/5 rounded-md transition-colors font-medium flex items-center gap-2">
                        <Plus size={14} /> New Task
                      </button>
                    ) : (
                      <input 
                        autoFocus
                        type="text" 
                        className="w-full bg-[#141720] border border-primary/50 rounded-lg p-2.5 text-sm text-white focus:outline-none shadow-[0_0_10px_rgba(59,130,246,0.2)]" 
                        placeholder="Type task & press Enter..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={handleNewTask}
                        onBlur={() => setShowTaskInput(false)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Panel */}
      <div className={`absolute top-0 bottom-0 right-0 w-[340px] bg-[#0F111A] border-l border-white/10 transform transition-transform duration-300 z-20 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-5 shrink-0">
          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">NOV-12</span>
          <div className="flex items-center gap-2">
            <button className="text-white/40 hover:text-white transition-colors"><DotsThree size={24} /></button>
            <button onClick={() => setIsPanelOpen(false)} className="text-white/40 hover:text-white transition-colors"><X size={20} /></button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          <h2 className="font-heading text-lg font-bold text-white mb-6 leading-snug">{selectedTask?.title}</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">Assignee</span>
              <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-md">
                <img src={`https://i.pravatar.cc/100?img=${selectedTask?.assignee || '11'}`} className="w-4 h-4 rounded-full" alt="" />
                <span className="text-white font-medium text-xs">Sarah J.</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/40">Status</span>
              <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-md">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                <span className="text-white font-medium text-xs capitalize">{selectedTask?.status}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6">
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Activity</h4>
            <div className="space-y-4">
              {comments.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <img src={`https://i.pravatar.cc/100?img=${c.img}`} className="w-6 h-6 rounded-full shrink-0" alt="" />
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white font-bold text-xs">{c.author}</span>
                      <span className="text-white/30 text-[10px]">{c.time}</span>
                    </div>
                    <p className={`text-sm text-white/80 p-2 rounded-lg rounded-tl-none ${c.author === 'You' ? 'bg-primary/20 border border-primary/30' : 'bg-white/5'}`}>{c.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 mt-4">
                   <img src="https://i.pravatar.cc/100?img=41" className="w-6 h-6 rounded-full shrink-0" alt="" />
                   <div className="bg-white/5 p-2 px-3 rounded-full flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-[#0F111A] shrink-0">
          <div className="flex gap-2">
            <img src="https://i.pravatar.cc/100?img=33" className="w-6 h-6 rounded-full shrink-0" alt="" />
            <input 
              type="text" 
              className="w-full bg-[#141720] border border-white/10 rounded-full px-4 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors" 
              placeholder="Reply..." 
              onKeyDown={handleNewComment}
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default InteractiveMockup;
