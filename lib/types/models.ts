import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
    };
  }
}

export interface IWorkspace {
  _id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  owner: string | IUser;
  members: (string | IUser)[];
  createdAt: string;
  updatedAt: string;
}

export interface IBoard {
  _id: string;
  name: string;
  description?: string;
  color: string;
  workspace: string;
  columns: IColumn[];
  createdAt: string;
  updatedAt: string;
}

export interface IColumn {
  _id: string;
  name: string;
  board: string;
  position: number;
  tasks?: ITask[];
  createdAt: string;
  updatedAt: string;
}

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  column: string;
  board: string;
  position: number;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  assignee?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  labels: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}
