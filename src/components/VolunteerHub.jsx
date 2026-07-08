import React, { useState } from "react";
import { CheckSquare, Square, Award, ShieldAlert } from "lucide-react";

export default function VolunteerHub({ 
  volunteerTasks, 
  setVolunteerTasks, 
  accessibility, 
  language 
}) {
  const isHC = accessibility?.highContrast;
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");

  const toggleTask = (taskId) => {
    setVolunteerTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === "completed" ? "pending" : "completed";
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      zone: "Volunteer Sector 4",
      priority: newTaskPriority,
      status: "pending",
      assignedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setVolunteerTasks(prev => [newTask, ...prev]);
    setNewTaskTitle("");
  };

  const pendingTasks = volunteerTasks.filter(t => t.status === "pending");

  // Leaderboard data
  const volunteersList = [
    { name: "Carlos R.", points: 340, tasks: 8, badge: "Elite Guide" },
    { name: "Marie L.", points: 290, tasks: 6, badge: "Green Hero" },
    { name: "Aria M.", points: 250, tasks: 5, badge: "Quick Responder" },
    { name: "John D.", points: 180, tasks: 4, badge: "Assistant" }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Task List Panel */}
      <div className="xl:col-span-2 space-y-6">
        <div className={`p-5 rounded-2xl border transition-all ${
          isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-900/60 border-slate-800 text-slate-100"
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-black tracking-wide uppercase flex items-center">
              <CheckSquare className="h-5 w-5 text-emerald-500 mr-2" />
              Volunteer Duty Tasks
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {pendingTasks.length} Pending
            </span>
          </div>

          {/* Quick Create Task */}
          <form onSubmit={handleCreateTask} className="mb-5 flex gap-2">
            <input
              type="text"
              placeholder="Suggest or claim a new volunteer task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className={`flex-grow py-1.5 px-3 rounded-lg text-xs border focus:outline-none ${
                isHC 
                  ? "bg-black border-yellow-400 text-yellow-300" 
                  : "bg-slate-950 border-slate-850 text-white focus:border-emerald-500"
              }`}
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className={`py-1.5 px-2 rounded-lg text-xs border focus:outline-none ${
                isHC 
                  ? "bg-black border-yellow-400 text-yellow-300" 
                  : "bg-slate-950 border-slate-850 text-slate-205"
              }`}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button
              type="submit"
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
                isHC 
                  ? "bg-yellow-400 text-black hover:bg-yellow-300" 
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }`}
            >
              Add
            </button>
          </form>

          {volunteerTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No active tasks dispatched yet.
            </div>
          ) : (
            <div className="space-y-2">
              {volunteerTasks.map((task) => {
                const isCompleted = task.status === "completed";
                const isHigh = task.priority === "high";

                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all hover:-translate-y-0.5 ${
                      isCompleted 
                        ? (isHC ? "bg-black/50 border-yellow-600/40 text-yellow-500/80 line-through" : "bg-slate-950/40 border-slate-900/60 text-slate-500 line-through")
                        : (isHC 
                            ? "bg-black border-yellow-400 text-yellow-300" 
                            : `bg-slate-950/80 border-slate-855 text-slate-105 hover:border-slate-700 ${isHigh ? "border-l-4 border-l-fifa-red" : ""}`)
                    }`}
                  >
                    <div className="flex items-center space-x-3 pr-4">
                      {isCompleted ? (
                        <CheckSquare className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                      ) : (
                        <Square className="h-4.5 w-4.5 text-slate-550 shrink-0" />
                      )}
                      <div className="text-xs">
                        <div className="font-bold">{task.title}</div>
                        <div className="text-[9px] uppercase font-semibold text-slate-400 mt-0.5">
                          📍 {task.zone} | 🕒 Assigned {task.assignedTime}
                        </div>
                      </div>
                    </div>
                    {!isCompleted && (
                      <span className={`text-[8px] uppercase font-extrabold px-1.5 py-0.5 rounded shrink-0 ${
                        isHigh 
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : task.priority === "medium" 
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard and contribution info */}
      <div className="space-y-6">
        <div className={`p-5 rounded-2xl border transition-all ${
          isHC ? "bg-black border-yellow-400 text-yellow-300" : "bg-slate-900/60 border-slate-800 text-slate-100"
        }`}>
          <h2 className="text-base font-black tracking-wide uppercase flex items-center mb-4">
            <Award className="h-5 w-5 text-amber-400 mr-2" />
            Volunteer Leaderboard
          </h2>
          <div className="space-y-3">
            {volunteersList.map((vol, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-900"
              >
                <div className="flex items-center space-x-2">
                  <div className="text-xs font-bold text-slate-400 w-4">#{index + 1}</div>
                  <div>
                    <div className="text-xs font-black">{vol.name}</div>
                    <div className="text-[8px] text-slate-450 font-bold uppercase">{vol.badge}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-amber-400">{vol.points} pts</div>
                  <div className="text-[8px] text-slate-450 font-bold uppercase">{vol.tasks} Tasks</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick instructions alert */}
          <div className="mt-4 p-3 rounded-xl bg-slate-950/30 border border-slate-900 flex items-start space-x-2.5">
            <ShieldAlert className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[10px] leading-normal text-slate-350">
              <span className="font-extrabold text-white block mb-0.5">Duty Conduct Checklist</span>
              Stay active in your assigned zones. If there is an emergency incident, it will appear here instantly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
