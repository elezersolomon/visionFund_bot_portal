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
export const loginUser = async (
  dispatch: AppDispatch,
  username: string,
  password: string
) => {
  try {
    const response = await axiosInstance().post("/auth/login", {
      username,
      password,
    });
    const { id, firstName, lastName, role, email, phoneNumber, status } =
      response.data.user;
    const token = response.data.token;
    dispatch(
      setUser({
        userID: id,
        username,
        firstName,
        lastName,
        role,
        email,
        phoneNumber,
        token,
        status,
      })
    );

    return { role: role, status: status };
  } catch (error: any) {
    console.log("consoleData_ error", error.response.data.message);
    throw error.response.data;
  }
};

export const fetchUsers = async (token: string): Promise<User[]> => {
  try {
    const response = await axiosInstance().get<User[]>("/users", {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    });

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
  const response = await axiosInstance().post("/users/", userData, {
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
    const response = await axiosInstance().put(`/users/`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to update user");
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
    const response = await axiosInstance().put(
      `/users/resetUserPassword`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
    const response = await axiosInstance().put(`/users/changePassword`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.log("consoleData_ error1 ", error);
    throw new Error(error.response.data.message);
  }
};

export const fetchCustomers = async (token: string) => {
  try {
    const response = await axiosInstance().get(`/Customers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching customers");
  }
};

export const updateCustomer = async (customer: Customer, token: string) => {
  const response = await axiosInstance().put("/customers", customer, {
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
  const response = await axiosInstance().post("/customers/", customerData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const fetchFeedbacks = async (token: string): Promise<Feedback[]> => {
  // console.log("consoleData_ token", token);
  try {
    const response = await axiosInstance().get("/data/getFeedbacks", {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

export const getBotData = async (token: string): Promise<botData[]> => {
  try {
    const response = await axiosInstance().get("/data/BotData", {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    });
    if (response.headers.token == "token expired") {
    }
    console.log("value", token);
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
    const response = await axiosInstance().put(
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

export const getDashboardData = async (
  token: string
): Promise<DashboardData> => {
  try {
    const response = await axiosInstance().get("/data/getDashboardData", {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    });

    console.log("consoleData_ response", response);

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};
