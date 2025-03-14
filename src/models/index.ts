export interface User {
  userID: number;
  userName: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phoneNumber: string;
  status: string;
}

export interface Customer {
  userID: number;
  isCustomer: boolean;
  userFName: string;
  userLName: string;
  phoneNumber: string;
  telegramUserName: string;
  status: string; // Changing the status here
  dateRegistered: string;
  address: String;
}

export interface Feedback {
  commentID: string;
  dateCreated: string;
  feedback: string;
  leadID: string;
  telegramUserName: string;
  userID: string;
}
export interface Content {
  [key: string]: string | Content;
}
export interface botData {
  id: string;
  description: string;
  content: Content;
}

export type DashboardData = {
  FAQs: {
    totalCount: number;
    countByCategory: Record<string, number>;
    countByDate: Record<string, number>;
  };
  botData: {
    totalCount: number;
    countByCategory: Record<string, number>;
  };
  chatData: {
    totalCount: number;
    countByCategory: Record<string, number>;
    countByDate: Record<string, number>;
  };
  feedbacks: {
    totalCount: number;
    countByCategory: Record<string, number>;
    countByDate: Record<string, number>;
    countByStatus: Record<string, number>;
  };
  leads: {
    totalCount: number;
    countByCategory: Record<string, number>;
    countByDate: Record<string, number>;
    countByStatus: Record<string, number>;
  };
  portalUsers: {
    totalCount: number;
    countByCategory: Record<string, number>;
    countByDate: Record<string, number>;
    countByStatus: Record<string, number>;
  };
  users: {
    totalCount: number;
    countByCategory: Record<string, number>;
    countByDate: Record<string, number>;
    countByStatus: Record<string, number>;
    countByUser: Record<string, number>;
  };
};
