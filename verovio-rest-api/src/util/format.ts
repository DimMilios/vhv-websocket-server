import { Document, User } from "@prisma/client";
import { Result, ValidationError } from "express-validator";

interface DocUsers extends Document {
  users: User[];
}

export function dashboardDocuments (documents: DocUsers[], currentUser: string, errors?: Result<ValidationError>) {
  return { 
    documentInfo: documents.map(doc => ({
      id: doc.id,
      title: doc.title,
      createdAt: new Date(doc.createdAt).toLocaleDateString('el-GR'),
      updatedAt: new Date(doc.updatedAt).toLocaleDateString('el-GR'),
      users: doc.users.map((u: User) => u.email)
    })),
    currentUser,
    errors: errors?.array()
  }
}