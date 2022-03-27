import { Document, User } from "@prisma/client";
import { Result, ValidationError } from "express-validator";

interface DocUsers extends Document {
  users: User[];
}

export function dashboardDocuments (documents: DocUsers[], currentUser: string, errors?: Result<ValidationError>) {
  let documentInfo = documents.map(doc => ({
    id: doc.id,
    title: doc.title,
    createdAt: new Date(doc.createdAt).toLocaleDateString('el-GR'),
    updatedAt: new Date(doc.updatedAt).toLocaleDateString('el-GR'),
    users: doc.users.map(user => ({ id: user.id, email: user.email, name: user.name, imageProfileURL: user.imageProfileURL}))
  }));
  return { 
    documentInfo,
    currentUser: documentInfo.flatMap(d => d.users).find(u => u.email === currentUser),
    errors: errors?.array()
  }
}