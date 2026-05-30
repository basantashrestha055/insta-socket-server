export interface Message {
  _id: string;
  senderId: string;
  recipientId: string;
  text?: string;
  file?: string;
  createdAt: string | Date;
  isOptimistic?: boolean;
  updatedAt?: string | Date;
}
