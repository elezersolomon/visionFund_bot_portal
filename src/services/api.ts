import axios from "axios";
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
    const response = await axios.post("http://localhost:5000/api/auth/login", {
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
    const response = await axios.get<User[]>(
      "http://localhost:5000/api/users",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      }
    );

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
  const response = await axios.post(
    "http://localhost:5000/api/users/",
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

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
    const response = await axios.put(
      `http://localhost:5000/api/users/`,
      userData,
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
    const response = await axios.put(
      `http://localhost:5000/api/users/resetUserPassword`,
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
    const response = await axios.put(
      `http://localhost:5000/api/users/changePassword`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log("consoleData_ error1 ", error);
    throw new Error(error.response.data.message);
  }
};

export const fetchCustomers = async (token: string) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/Customers`, {
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
  const response = await axios.put(
    "http://localhost:5000/api/customers",
    customer,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
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
  const response = await axios.post(
    "http://localhost:5000/api/customers/",
    customerData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const fetchFeedbacks = async (token: string): Promise<Feedback[]> => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/data/getFeedbacks",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

export const getBotData = async (token: string): Promise<botData[]> => {
  try {
    const response = await axios.get("http://localhost:5000/api/data/BotData", {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    });
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
    const response = await axios.put(
      `http://localhost:5000/api/data/setBotData`,
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
    const response = await axios.get(
      "http://localhost:5000/api/data/getDashboardData",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      }
    );

    console.log("consoleData_ response", response);

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};
