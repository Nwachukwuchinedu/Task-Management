import { connectDB } from "@/lib/db";
import { Task, ITask } from "@/lib/models";

export class TaskService {
  async createTask(data: Partial<ITask>): Promise<ITask> {
    await connectDB();
    const task = new Task(data);
    return task.save();
  }

  async getTasksByProject(
    projectId: string,
    options: { status?: string; assignee?: string } = {}
  ): Promise<ITask[]> {
    await connectDB();
    const filter: Record<string, string> = { project: projectId };
    if (options.status) filter.status = options.status;
    if (options.assignee) filter.assignee = options.assignee;

    return Task.find(filter).populate("assignee", "name email avatar");
  }

  async getTaskById(id: string): Promise<ITask | null> {
    await connectDB();
    return Task.findById(id).populate("assignee", "name email avatar");
  }

  async updateTask(
    id: string,
    data: Partial<ITask>
  ): Promise<ITask | null> {
    await connectDB();
    return Task.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteTask(id: string): Promise<boolean> {
    await connectDB();
    const result = await Task.findByIdAndDelete(id);
    return !!result;
  }
}

export const taskService = new TaskService();
