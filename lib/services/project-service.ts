import { connectDB } from "@/lib/db";
import { Project, IProject } from "@/lib/models";

export class ProjectService {
  async createProject(data: Partial<IProject>): Promise<IProject> {
    await connectDB();
    const project = new Project(data);
    return project.save();
  }

  async getProjectsByUser(userId: string): Promise<IProject[]> {
    await connectDB();
    return Project.find({
      $or: [{ owner: userId }, { members: userId }],
    }).populate("owner", "name email avatar");
  }

  async getProjectById(id: string): Promise<IProject | null> {
    await connectDB();
    return Project.findById(id)
      .populate("owner", "name email avatar")
      .populate("members", "name email avatar");
  }

  async updateProject(
    id: string,
    data: Partial<IProject>
  ): Promise<IProject | null> {
    await connectDB();
    return Project.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProject(id: string): Promise<boolean> {
    await connectDB();
    const result = await Project.findByIdAndDelete(id);
    return !!result;
  }

  async addMember(projectId: string, userId: string): Promise<IProject | null> {
    await connectDB();
    return Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: userId } },
      { new: true }
    );
  }
}

export const projectService = new ProjectService();
