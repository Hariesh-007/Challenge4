import { describe, it, expect } from "vitest";

describe("Volunteer Roster and Task Management Tests", () => {
  it("should handle custom task additions with varying priorities", () => {
    let tasks = [
      { id: "task-1", title: "Original task", status: "pending", priority: "medium" }
    ];

    const addNewTask = (newTitle, priority) => {
      const newTask = {
        id: `task-${Date.now()}`,
        title: newTitle,
        priority,
        status: "pending",
        zone: "Sector 4",
        assignedTime: "12:00"
      };
      tasks = [newTask, ...tasks];
    };

    addNewTask("Scan ticket barcode overflow", "high");

    expect(tasks.length).toBe(2);
    expect(tasks[0].title).toBe("Scan ticket barcode overflow");
    expect(tasks[0].priority).toBe("high");
    expect(tasks[0].status).toBe("pending");
  });

  it("should toggle task status between pending and completed", () => {
    let tasks = [
      { id: "task-1", title: "Original task", status: "pending", priority: "medium" }
    ];

    const toggleTaskStatus = (id) => {
      tasks = tasks.map(t => {
        if (t.id === id) {
          return { ...t, status: t.status === "completed" ? "pending" : "completed" };
        }
        return t;
      });
    };

    // Toggle once -> Completed
    toggleTaskStatus("task-1");
    expect(tasks[0].status).toBe("completed");

    // Toggle twice -> Pending
    toggleTaskStatus("task-1");
    expect(tasks[0].status).toBe("pending");
  });
});
