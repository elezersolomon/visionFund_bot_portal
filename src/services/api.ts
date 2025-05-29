import axiosInstance from "../utils/axiosInstance";
import { setUser } from "../redux/userSlice";
import { AppDispatch } from "../redux";
import {
  botData,
  User,
  Customer,
  Feedback,
  Content,
  DashboardData,
} from "../models";

// function to get areas list
export const getAreas = async () => {
  try {
    const response = await axiosInstance.get("/getAreas");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch areas");
  }
};

// function to get branches list
export const getBranches = async () => {
  try {
    const response = await axiosInstance.get("/getBranches");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch branches");
  }
};

export const loginUser = async (
  dispatch: AppDispatch,
  username: string,
  password: string
) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      username,
      password,
    });

    const {
      id,
      firstName,
      lastName,
      role,
      branchid,
      email,
      phoneNumber,
      status,
    } = response.data.user;
    const token = response.data.token;
    dispatch(
      setUser({
        userID: id,
        username,
        firstName,
        lastName,
        role,
        branchID: branchid,
        email,
        phoneNumber,
        token,
        status,
      })
    );

    return { role: role, status: status, token: token };
  } catch (error: any) {
    let message = "An error occurred during login.";

    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.request) {
      message =
        "Unable to connect to the backend service. Please try again later.";
    } else if (error?.message) {
      message = error.message;
    }

    // Throw with a clear message to be caught on the frontend
    throw new Error(message);
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get<User[]>("/users");

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

export const createUser = async (
  userData: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    phoneNumber: string;
  },
  token: string
) => {
  const response = await axiosInstance.post("/users/create/", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// New function to update user data
export const updateUser = async (
  userData: {
    userName: string;
    email: string;
    phoneNumber: string;
    role: string;
    userID: number;
    status: string;
  },
  token: string
) => {
  try {
    const response = await axiosInstance.put(
      `/users/edit/${userData?.userID}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update user " + error);
  }
};

export const resetUserPassword = async (
  data: {
    username: string;
    firstName: string;
    userID: string | number;
    phoneNumber: string;
  },
  token: string
) => {
  try {
    const response = await axiosInstance.put(`/users/resetUserPassword`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to update user");
  }
};

export const changePassword = async (
  data: {
    userID: string | number;
    previousPassword: string;
    newPassword: string;
  },
  token: string
) => {
  try {
    const response = await axiosInstance.put(`/users/changePassword`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

// function to fetch all customers
export const fetchCustomers = async () => {
  try {
    const response = await axiosInstance.get(`/Customers`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching customers");
  }
};

// function to get customers by portal userName
export const getCustomerByPortalUserName = async (userName: string) => {
  try {
    const response = await axiosInstance.get(
      `/customers/getMyCustomers/${userName}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching customers");
  }
};

export const updateCustomer = async (customer: Customer, token: string) => {
  const response = await axiosInstance.put("/customers", customer, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createCustomer = async (
  customerData: {
    telegramUserName: string;
    firstName: string;
    lastName: string;
    isCustomer: boolean;
    telegramID: string;
    phoneNumber: string;
    address: string;
  },
  token: string
) => {
  const response = await axiosInstance.post("/customers/", customerData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const fetchFeedbacks = async (): Promise<Feedback[]> => {
  try {
    const response = await axiosInstance.get("/data/getFeedbacks");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

export const getBotData = async (): Promise<botData[]> => {
  try {
    const response = await axiosInstance.get("/data/BotData");

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

export async function updateBotData(
  token: string,
  botData: Content,
  description: string,
  entry?: string
) {
  try {
    const response = await axiosInstance.put(
      `/data/setBotData`,
      botData,

      {
        headers: {
          Authorization: `Bearer ${token}`,
          entry: entry,
          description: description,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update user");
  }
}

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await axiosInstance.get("/data/getDashboardData");

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

/*report routes*/

// report for customers
export const getCustomerReports = async (filters: {
  fromDate?: string;
  toDate?: string;
  district?: string;
  branch?: string;
  status?: string;
}) => {
  try {
    const response = await axiosInstance.post("/reports/customerReports", filters);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch customer reports");
  }
};

// report for users
export const getUserReports = async (filters: {
  fromDate?: string;
  toDate?: string;
  district?: string;
  branch?: string;
  status?: string;
}) => {
  try {
    const response = await axiosInstance.post("/reports/userReports", filters);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user reports");
  }
};

// report for leads
export const getLeadReports = async (filters: {
  fromDate?: string;
  toDate?: string;
}) => {
  try {
    const response = await axiosInstance.post("/reports/leadReports", filters);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch lead reports");
  }
};


