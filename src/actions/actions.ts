import createAxiosInstance from "@/utils/api";

export const getMessages = async (userId: string, clientId: string) => {
  try {
    const axiosInstance = createAxiosInstance();

    const result = await axiosInstance.get(
      `/messages?userId=${userId}&clientId=${clientId}`
    );
    return result.data.data;
  } catch (error) {
    console.log(`Error while getting message`, error);
  }
};
